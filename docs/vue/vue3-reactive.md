---
title: Vue3响应式原理
date: 2021-02-28
tags:
  - vue
categories:
  - frontEnd
# publish: false
---

## ref

ref 常用于基本类型，reactive 用于引用类型。如果 ref 传入对象，其实内部会自动变成 reactive。<br/>
ref 本质是把 js 基本类型(string/number/bool)包装为引用对象,使得具有响应式特性。

```ts
const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val;

export function ref(raw: unknown) {
  if (isRef(raw)) return raw;
  raw = convert(raw);
  // 基本类型,转为含有getter/setter的对象
  const r = {
    _isRef: true,
    //基本类型无法被追踪,所以使用ref包装为object,使得可以被追踪
    get value() {
      track(r, OperationTypes.Get, "");
      return raw;
    },

    set value(newVal) {
      raw = convert(newVal);
      trigger(r.OperationTypes.Set, "");
    },
  };
  return r as Ref;
}
```

同时 ref 支持 reactive 转为 ref 对象-- toRefs

```ts
export function toRefs<T extends object>(
  obj: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {};
  //for in 展开一层
  for (const key in object) {
    ret[key] = toProxyRef(obj, key);
  }
}
function toProxyRef<T extends object, K extends keyof T>(
  obj: T,
  key: K
): Ref<T[K]> {
  return {
    _isRef: true,
    get value(): any {
      return obj[key];
    },
    set value(newVal) {
      obj[key] = newVal;
    },
  };
}
```

## reactive

先认识下以下 4 个全局存储,使用 weakmap 存储起普通对象和生成的响应式对象，因为很多地方都需要用到判断以及取值。其中 rawToReactive 和 reactiveToRaw 是一组，只不过 key 和 value 互相对调。

```ts
// 防止重复设置响应式对象,建立store存起来
// WeakMaps that store {raw <.> observed} pairs
const rawToReactive = new WeakMap<any, any>(); // 原始object对象:封装的响应式对象
const reactiveToRaw = new WeakMap<any, any>(); // 封装的响应式对象: 原始object对象
// 只读响应式
const rawToReadonly = new WeakMap<any, any>();
const readonlyToRaw = new WeakMap<any, any>();
```

下面是 reactive 入口，如果传入参数是只读响应式，或者是用户设置的只读类型，返回处理。大部分都会走 createReactiveObject()方法:

```ts
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version
  if (readonlyToRaw.has(target)) {
    return target;
  }
  // target is explicitly marked as readonly bu user
  if (readonlyValues.has(target)) {
    return readonly(target);
  }
  // 给普通对象创建响应式对象
  return createReactiveObject(
    target,
    rawToReactive,
    reactiveToRaw,
    mutableHandlers,
    mutableCollectionHandlers
  );
}
function createReactiveObject(
  target: unknown, //原始对象
  toProxy: WeakMap<any, any>, // 全局rawToReactive
  toRaw: WeakMap<any, any>, //全局reactiveToRaw
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  // 重复的对象引用,最终都返回初始的监听对象,这就是创建全局store的原因之一
  // target already has corresponding proxy
  let observed = toProxy.get(target);
  if (observed !== void 0) {
    return observed;
  }
  // target is already a proxy
  if (toRaw.has(target)) return target;
  // vue 对象、vnode对象等不能被创建为响应式
  //  only a whitelist of value types can be observed
  if (!canObserve(target)) return target;

  // 真正的创建代理Proxy对象并返回
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers // [Set, Map, WeakMap, WeakSet]对象走这个handles
    : baseHandlers; // 大部分走baseHandle
  observed = new Proxy(target, handlers);
  // 创建完马上全局缓存
  toProxy.set(target, observed);
  toRaw.set(observed.target);
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map());
  }
  return observed;
}
```

所以还得看代理对象 mutableHandlers 中的处理

```ts
export const mutableHandlers: ProxyHandler<object> = {};
```

// TODO 未完待续
