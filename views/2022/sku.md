---
title: 前端sku算法
date: 2022-02-08
tags:
- TypeScript
- sku
categories:
- frontEnd
---

## 笛卡尔积算法

| 规格属性                       | 目标结果                                                 |
| ------------------------------ | -------------------------------------------------------- |
| `[['红色', '白色']]`           | `[['红色'],['白色']]`                                    |
| `[['红色','白色'],['S', 'M']]` | `[['红色','S'],['红色','M'],['白色','S'],['白色','M']] ` |

### SKU 组合实现思路

首先让我们来看看笛卡尔积的描述

笛卡尔乘积是指在数学中，两个[集合] X 和 Y 的笛卡尔积(Cartesian product)，又称 [ 直积 ] ，表示为 X × Y，第一个对象是 X 的成员而第二个对象是 Y 的所有可能 [ 有序对 ] 的其中一个成员 假设集合
A = { a, b }，集合 B = { 0, 1, 2 }，则两个集合的笛卡尔积为 { ( a, 0 ), ( a, 1 ), ( a, 2), ( b, 0), ( b, 1), ( b, 2) }

![笛卡尔积](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8ce8a7ab96f4b48a9f5ea61f6c23102~tplv-k3u1fbpfcp-watermark.awebp)
通过上面的思维导图，可以看出这种规格组合是一个经典的排列组合，去组合每一个规格值得到最终 SKU。

那么让我们来进行代码实现，看看代码如何实现笛卡尔积。

```js
const isNil = (obj) => obj === undefined || obj === null;

function wrapInArray(v) {
    if (isNil(v)) return [];
    return Array.isArray(v) ? v : [v];
}

function calcDescartes(array) {
    if (!array?.length) return [];
    if (array.length === 1) return array[0].map((item) => [item]);

    return array.reduce((total, currentValue) => {
        let res = [];

        total.forEach((t) => {
            currentValue.forEach((cv) => {
                res.push([...wrapInArray(t), cv]);
            });
        });
        return res;
    });
}
```

## 生成规格列表

### 业务场景

原始的数据结构(后端给过来的)

```ts
interface BackEndVariationOption {
    name: string;
    options: string[];
}
```

### 具体实现

首先给每个规格属性`红色, 白色`生成一个对应的 uid(避免规格重复)
生成的数据结构

```ts
type Uid = string;

interface VariationOptionData {
    name: string;
    options: { uid: Uid; value: string }[];
    uid: Uid;
}

// 规格项
interface VariationIndex {
    uids: Uid[]; // 当前规格项的规格组合`红色, M`
}
```

生成一个笛卡尔积 uid 数组, 它包含所有的规格列表的组合

```ts
const mapSkip = Symbol("skip");

function map(iterable, mapper) {
    const result = [];
    for (let i = 0; i < iterable.length; i++) {
        const item = iterable[i];
        const element = mapper(item, i, iterable);
        if (element === mapSkip) continue;
        result.push(element);
    }
    return result;
}

function getDescartesUidArray(variations: VariationOptionData[]): Uid[][] {
    const optionsArray = map(variations, ({options}) =>
        options?.length ? options.map(({uid}) => uid) : mapSkip
    );
    return calcDescartes(optionsArray);
}
```

规格属性的编辑只有两种情况

- 增加
    - 总体思想: 通过遍历笛卡尔积 uid 数组, 更新相似的改变, 填充缺失的规格项
- 删除(更新)
    - 总体思想: 通过遍历规格项列表, 更新相似的改变, 并且清除多余的。

那么什么是相似的改变呢?

假设有`[['红色','白色'],['S']]`规格, 转换成前端的数据结构就是

```js
const varitions = [
    {
        name: "颜色",
        options: [
            {value: "红色", uid: 0},
            {value: "红色", uid: 1},
        ],
    },
    {name: "尺寸", options: [{value: "S", uid: 2}]},
];
```

通过上述笛卡尔积生成uid数组就是`[[0,2],[1,2]]`
现增加一列年龄的规格`{name: '年龄', options:[{value: '12岁', uid: 3}]}`
笛卡尔积uid数组就变成了`[[0,2,3],[1,2,3]]`
`[0,2]`=>`[0,2,3]`, 那么逻辑上只要判断旧的uid数组被包含于新的uid就好了
删除规格的话就正好相反, `[0,2,3]` => `[0,2]`,

```ts
/**
 * @description 两数组是否相似，b可以存在a中不存在的值
 * b->[_,...a]
 * */
function isSimilarArray(a, b): boolean {
    return !a.some((item) => !b.includes(item))
}

type UpdateItemFn<T> = (
    item: T,
    uids: Uid[],
    variations: VariationOptionData[]
) => void

function addVariationOption<T>(
    items: T[],
    {
        variations,
        descartesUidArray,
        createItem = (uids, variations) => ({
            uids,
        }),
        updateItem,
        addItems = [],
    }: {
        variations: VariationOptionData[],
        descartesUidArray?: Uid[][],
        createItem?: (uids: Uid[], variations: VariationOptionData[]) => T,
        updateItem?: UpdateItemFn<T>,
        force?: boolean,
        addItems?: VariationOptionValue[],
    }
): void {
    descartesUidArray = descartesUidArray ?? getDescartesUidArray(variations)
    descartesUidArray.forEach((uids) => {
        const findIndex = items.findIndex((variationTableItem) => {
            const res = isSimilarArray(variationTableItem.uids, uids)
            if (res) {
                variationTableItem.uids = uids
                updateItem?.(variationTableItem, uids, variations)
            }
            return res
        })
        if (findIndex !== -1) return
        const isContain = addItems?.length
            ? uids.some((uid) => addItems.some((item) => uid === item.uid))
            : true
        if (!isContain) return
        const addItem = createItem(uids, variations)
        items.push(addItem)
    })
}

function removeVariationOption<T>(
    items: T[],
    {
        variations,
        descartesUidArray,
        updateItem = (item, uids, variations) => {
            item.index = uidsToIndex(uids, variations)
        },
    }: {
        variations: VariationOptionData[],
        descartesUidArray?: Uid[][],
        needSort?: boolean,
        updateItem?: UpdateItemFn<T>,
    }
): void {
    const removeIndex = []
    const memo = []
    descartesUidArray = descartesUidArray ?? getDescartesUidArray(variations)
    items.forEach((variationTableItem, index) => {
        let res = true
        descartesUidArray.forEach((uids, index) => {
            const result = isSimilarArray(uids, variationTableItem.uids)
            if (result) {
                if (!memo[index]) res = false
                variationTableItem.uids = uids
                updateItem?.(variationTableItem, uids, variations)
                memo[index] = true
            }
        })
        if (res) removeIndex.push(index)
    })
    const len = removeIndex.length
    for (let i = len - 1; i >= 0; i--) {
        const item = removeIndex[i]
        items.splice(item, 1)
    }
}

```

## vue3 的 hooks 写法

```ts
function useVariationOption<T>
(
    variations: Ref<VariationOptionData[]>,
    variationIndexs: Ref<BaseVariationIndex[]>,
    createItem?: (uids: Uid[], variations: VariationOptionData[]) => T,
    updateItem?: UpdateItemFn<T>
)
{
    const descartesUidArray = computed(() =>
        getDescartesUidArray(variations.value)
    )
    return {
        descartesUidArray,
        add: (addItems) => {
            addVariationOption(variationIndexs.value, {
                variations: variations.value,
                descartesUidArray: descartesUidArray.value,
                updateItem,
                createItem,
                addItems: wrapInArray(addItems),
            })
        },
        remove: () => {
            removeVariationOption<T>(variationIndexs.value, {
                variations: variations.value,
                descartesUidArray: descartesUidArray.value,
                updateItem,
            })
        },
    }
}

```
