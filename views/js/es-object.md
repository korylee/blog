---
title: JS内置对象属性和方法汇总
date: 2020-04-05
tags:
  - JavaScript
  - 学习笔记
categories:
  - frontEnd
---

## JS 三大对象

JavaScript 有三大对象,分别是**本地对象**、**内置对象**和**宿主对象**。
引用 ECMA-262（ECMAScript 的制定标准）的定义

- 本地对象
  - 与宿主无关,独立于宿主环境的 ECMAScript 实现提供的对象
  - 简单来说,本地对象就是 ECMA-262 定义的类(引用类型)
  - 这些引用类型在运行过程中需要通过 new 来创建所需的实例对象
  - 包含 Object、Array、Data、RegExp、Function、Boolean、Number、String 等
- 内置对象
  - 与宿主无关,独立于宿主环境的 ECMAScript 实现提供的对象
  - 在 ECMAScript 程序开始执行前就存在，本身就是实例化内置对象，开发者无需再去实例化
  - 内置对象是本地对象的子集
  - 包含 Global 和 Math
  - ECMAScript5 增添了 JSON 这个全局的内置对象
- 宿主对象
  - 由 ECMAScript 实现的宿主环境提供的对象，包含两大类，一个是宿主提供，一个是自定义对象
  - 所有非本地的对象都属于宿主对象
  - 对于嵌入到网页中的 js 来说，其宿主对象就是浏览器提供的对象，浏览器对象有很多，如 Window 和 Document 等
  - 所有的 DOM 和 BOM 对象都属于宿主对象

::: theorem 关于专业名词
本地对象也经常被叫做原生对象或内部对象，包含 Global 和 Math 在内的内置对象在《JavaScript 高级程序设计》里也被叫做单体内置对象，很多时候，干脆也会直接把本地对象和内置对象统称为“内置对象”，也就是说除了宿主对象，剩下的都是 ECMAScript 的内部的“内置”对象。

声明：本文也将采取这种统称为“内置对象”的方式，比如文章标题。
:::

### JS 数据类型

ECMAScript 标准定义了九种[数据类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures):

- [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive),可以用`typeof`运算符检查
  - [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
  - [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
  - [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  - [String](https://developer.mozilla.org/en-US/docs/Glossary/String)
  - [BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt)
  - [Symbol](https://developer.mozilla.org/en-US/docs/Glossary/Symbol)
  - [null](https://developer.mozilla.org/en-US/docs/Glossary/Null): 特殊的原始类型, 如果未继承对象,则显示 null
- [Object](https://developer.mozilla.org/en-US/docs/Glossary/Object): 特殊的非数据的结构类型, 所有由构造函数构造的实例都是 Object: `new Object`、`new Array`、`new Set`、`new WeakSet`、`new WeakMap`、`new Date`等所有用`new`构造出的实例都是`Object`
- [Function](https://developer.mozilla.org/en-US/docs/Glossary/Function): 非数据结构(non data Structure): 尽管每个 Function 构造函数都是从 Object 构造函数派生的, 但`typeof instance === "function"`这个操作符判断是以 Function 的特殊简写来完成的

## Object 类型

### 实例方法

#### 1. `toString()`

- 功能:返回当前对象的字符串形式,返回值为 String 类型

```js
[1,'2',true],toString() // "1,2,true"
(new Date()).toString()// "Sun Apr 05 2020 22:31:31 GMT+0800 (中国标准时间)"
({name: 'kory'}).toString() // "[object Object]"
132.toString()// Uncaught SyntaxError: Invalid or unexpected token(123.被识别为小数点)
123..toString()// "123"
```

:::tip
该方法属于 Object 对象，由于所有的对象都“继承”了 Object 的对象实例，因此几乎所有的实例对象都可以使用该方法
JavaScript 的所有内置对象都重写了该函数，以实现更适合自身的功能需要
:::

#### 2. `toLocaleString()`

- 功能: 返回当前对象的"本地化"字符串形式，以便于当前环境的用户辨识度和使用，返回值为 String 类型。

```js
(1234567).toLocaleString(); //"1,234,567"
(6.37588).toLocaleString(); //"6.376"
new Date().toLocaleString(); //"2017/9/24 下午2:58:21"
```

#### 3. `valueOf()`

- 功能: 返货指定对象的原始值

:::tip
JavaScript 的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的 valueOf()方法的返回值和返回值类型均可能不同。
:::

### 静态方法

#### 1. `Object.assign(target,...source)`浅拷贝

- 功能: 把一个或多个愿对小的可枚举、自由属性复制到目标对象中，返回值为目标对象
- 参数：
  - 目标对象（必须）
  - 至少一个源对象（可选）

```js
let target = { a: 1 };
let object2 = { b: 2 };
let object3 = { c: 3 };
Object.assign(target, object2, object3);
// 第一个参数是目标对象，后面的参数是源对象
target; // {a: 1, b: 2, c: 3}
```

#### 2. `Object.create(proto[,propertiesObject])`

- 功能: 创建一个对象,其原型为 prototype,同时可添加多个属性
- 参数:
  - proto(必须):原型对象,可以为 null 表示没有原型。
  - descriptors(可选)： 包含一个或多个属性描述符的对象(propertiesObject)

propertiesObject 参数详解

- 数据属性
  - value：值
  - writable：是否可修改属性的值
  - configurable：是否可以通过 delete 删除属性，重新定义
  - enumerable：是否可 for...in 枚举
- 访问属性
  - get(): 访问
  - set(): 设置

:::tip 总结
`Object.create()`是 ES5 中提出来的一种新的对象创建方式，第一个参数是要继承的原型，如果不是一个子函数，可以传一个 null，第二个可选参数是对象的属性描述符
:::

#### 3. `Object.defineProperty(obj,prop,descriptor)`

- 功能: 在一个对象上定义一个新属性或修改一个现有属性,并返回该对象
- 参数:
  - obj(必须):被操作的目标对象
  - prop(必须): 被定义或被修改的目标属性
  - descriptor(必须):属性的描述符

:::tip 总结
在参数 descriptor 中,如果不指定 configurable, writable,enumerable, 则这些属性默认值为 false,如果不指定 value,get,set,则这些属性默认值为 undefined
:::

#### 4. `Object.defineProperties(obj,props)`

- 功能: 在一个对象定义一个或多个新属性或修改现有属性,并返回该对象
- 参数:
  - obj(必须):被操作的目标对象
  - props(必须): 该对象的一个或多个键值对定义了将要为对象添加或修改的属性的具体配置

```js
var obj = {};
Object.defineProperties(obj, {
  name: {
    writable: true,
    configurable: true,
    enumerable: false,
    value: "张三",
  },
  age: {
    writable: true,
    configurable: true,
    enumerable: true,
    value: 23,
  },
});
```

#### 5. `Object.is(value1,value2)`

- 功能: 用来比较两个值是否严格相等,与`===`基本类似

```js
Object.is("q", "q"); // true
Object.is(1, 1); // true
Object.is([1], [1]); // false
Object.is({ q: 1 }, { q: 1 }); // false
// 与(===)的区别
Object.is(-0, +0) - // false
  0 ===
  +0; // true
Object.is(NaN, NaN); //true
NaN === NaN; // false
```

#### 6.`Object.seal(obj)`/`Object.isSealed(obj)`

- 功能: 密封对象阻止其修改现有属性的配置特性，即将对象的所有属性的 configurable 特性设置为 false（也就是全部属性都无法配置，唯独可以把 writable 的值 true 改为 false，即冻结属性），并阻止添加新属性，返回新对象

- 参数：obj(必须),被密封的对象

```js
var obj = { name: "张三" };
Object.seal(obj);
Object.isSealed(obj);
obj.name = "李四"; //修改值成功
console.log(obj.name); //'李四'
obj.age = 23; //无法添加新属性
console.log(obj.age); //undefined
Object.defineProperty(obj, "name", {
  writable: true,
  configurable: true,
  enumerable: true,
}); //报错：Cannot redefine property: name
```

:::tip
将一个对象密封后仅能保证该对象不被扩展且全部属性不可重新配置, 但是原属性值却可以被修改
:::

#### 7. `Object.freeze(obj)`/`Object.isFrozen(obj)`

- 功能: 完全冻结对象,在 seal 的基础上,属性值也不可修改,即每个属性的 writable 也被设为 false
- 参数:obj(必须), 被冻结的对象

#### 8. `getOwnPropertyDescriptor(obj,prop)`

- 功能: 获取目标对象上某自由属性的配置特性(属性描述符)，返回值为配置对象
- 参数：
  - obj（必须）：目标对象
  - prop（必须）：目标自有属性

```js
var obj = {};

Object.defineProperty(obj, "name", {
  writable: true,
  configurable: false,
  enumerable: true,
  value: "张三",
});

var prop = Object.getOwnPropertyDescriptor(obj, "name");
console.log(prop); //{value: "张三", writable: true, enumerable: true, configurable: false}
```

#### 9. `getOwnPropertyName(obj)`

- 功能:获取目标对象上的全部自有属性(包括不可枚举属性)组成的数组
- 参数: obj(必须), 目标对象

```js
ar obj = {};
obj.say = function(){};
Object.defineProperties(obj,{
    name:{
      writable: true,
      configurable: true,
      enumerable: true,
      value: '张三'
    }
});
var arr = Object.getOwnPropertyNames(obj);
console.log(arr); //["say", "name"]
```

#### 10. `Object.getPrototypeOf(obj)`

- 功能: 获取指定对象的原型, 即目标对象的 prototype 属性的值
- 参数: obj(必须), 目标对象

```js
function Person(name) {
  this.name = name;
}
var person = new Person("张三");
var p = Object.create(person); //对象p的原型为person
console.log(p); //Person {}

var __proto__ = Object.getPrototypeOf(p);
console.log(__proto__); //Person {name: "张三"}
```

#### 11. `Object.setPrototypeOf(obj,proto)`

- 功能: 设定目标对象的原型为另一个对象或 null,返回该目标对象

- 参数:
  - obj(必须):目标对象
  - proto(必须):原型对象

```js
var obj = { a: 1 };
var proto = {};
Object.setPrototypeOf(obj, proto);
proto.b = 2;
```

:::tip
Object.setPrototypeOf()方法的作用域**proto**相同,用来设置当前对象的原型指向的对象(prototype)。它是 ES6 正式推荐的设置原型对象方法
:::

#### 12. `Object.keys(obj)`

- 功能: 获取目标对象上所有的可枚举属性组成的数组
- 参数:
  - obj(必须): 目标对象

::: tip
`Object.keys(obj)`方法获取的集合和 for-in 遍历获取的不同在于，Object.keys()只获取目标对象上可枚举的自有属性，而 for-in 遍历会包含原型链上可枚举属性一并获取。<br/>
`Object.keys()`和 `Object.getOwnPropertyNames()`的相同之处都是获取目标对象的自有属性，区别在于，后者会连同不可枚举的自有属性也一并获取组成数组并返回。
:::

#### 13. `Object.preventExtensions(obj)`/`Object.isExtensible(obj)`

- 功能: 使某一对象不可扩展,也就是不能为其添加新属性
- 参数: obj(必填):目标对象

:::tip
`Object.isExtensible(obj)`方法用于判断一个对象是否可以扩展,是否可以添加新属性
:::

```js
var obj = { name: "张三" };
Object.preventExtensions(obj); //阻止obj的可扩展性
Object.isExtensible(obj); //false
obj.age = 23;
obj.name; //undefined
```

## Array 类型

### Array 对象属性

#### 1. length

设置或返回数组中元素的数目
:::tip
设置 length 属性可改变数组的大小如果设置的值比当前值小，数组将会被截断，其尾部的数组将丢失。如果设置的值比它的当前值要大，数组将增大，新的元素被添加到数组的尾部，他们的值为 undefined
:::

#### 2. constructor

返回创建此数组的数组函数的引用

#### 3. prototype

使您有能力向对象添加属性和方法

### 对象方法

#### 1. `concat()`

- 用于连接两个或多个数组,**此方法不会改变现有的数组**, 而是返回被连接数组的一个副本
- 如果要进行`concat()`操作的参数是数组,那么添加的是数组中的元素,而不是数组。

#### 2. `join()`

- 把数组中的所有元素放入一个字符串,元素是通过指定的分隔符进行分隔的
- 若省略了分隔符参数,则用逗号作为分隔符

#### 3.`push()`

- 向数组的末尾添加一个或多个元素，并返回新的数组长度

#### 4. `pop()`

- 用于删除数组的最后元素, 并返回被删除元素
- 如果数组已经为空,则 pop()不改变数组,并返回 undefined

#### 5.`shift()`

- 删除数组的第一个元素,并且返回被删除的这个元素
- 如果数组是空的,那么 shift()方法将不进行任何操作,返回 undefined

#### 6. `unshift()`

- 向数组的开头添加一个或多个元素,返回新的数组的长度

#### 7. `reverse()`

- 颠倒数组中元素的顺序

#### 8. `sort()`

- 对数组的元素进行排序
- **直接修改数组**
- 该方案接受一个可选参数,如未使用参数,则按字母顺序对数组元素进行排序(按照字符串编码的顺序进行排序)
- 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：
  - 若 a 小于 b，排序后 a 应该在 b 之前，则返回一个小于 0 的值。
  - 若 a 等于 b，则返回 0。
  - 若 a 大于 b，则返回一个大于 0 的值。

#### 9. `slice(start[,end])`

- 截取原数组从 start 到 end 位置(不包含它)元素组成的子数组
- **该方法返回一个新数组**,不修改原数组
- 若未指定 end 参数,那么截取尾巴直到原数组的最后一个元素(包含它)

#### 10. `splice(index,howmany[,item1,item2...])`

- 删除从 index 处开始的 hownamy 个元素，并且用可选参数列表中声明的一个或多个值来替换那些被删除的元素。
- 该方法返回的是含有被删除的元素组成的数组，若无被删元素，则返回空数组。
- 若参数只有 index，那么原数组将从 index 开始删除直至结尾。
- 该方法直接修改原数组。

#### 查找

##### 11. `find(fn,thisArg)`

- 功能：查找出数组中第一个符合条件的元素，若有多个符合条件的元素，则返回第一个元素
- 参数
  - fn：回调函数接受三个参数,依次为当前的值、当前的位置和原数组
  - thisArg（可选）：指定回调函数中的 this 值

:::tip
数组空位处理为 undefined
可以发现 NaN，弥补了 indexOf 的不足
:::

```js
[1, 5, 10, 15].find(function (value, index, arr) {
  return value > 9;
}); //10
```

##### 12.`findIndex(fn,thisArg)`

- 功能：查找数组中符合条件的元素索引，若有多个符合条件的元素，则返回第一个元素索引
- 参数：
  - fn 回调函数
  - thisArg（可选）：指定回调函数中的 this 值

:::tip
数组空位处理为 -1
可以发现 NaN，弥补了 indexOf 的不足
:::

```js
[NaN]
  .indexOf(NaN) // -1

  [NaN].findIndex((y) => Object.is(NaN, y)); // 0
```

#### 填充

##### 13. `fill()`

- 功能：将一定范围索引的数组元素内容填充为单个指定的值

- 参数:
  - 用来填充的值
  - 被填充的起始索引
  - (可选):被填充的结束索引，默认为数组末尾

```js
let arr = Array.of(1, 2, 3, 4);
console.log(arr.fill(0, 1, 2)); // [1,0,3,4]
```

#### 14. `copyWithin()`

- 功能：将一定范围所应得数组元素修改为此数组另一指定范围索引的元素
- 参数:
  - 被修改的起始索引
  - 被用来覆盖的数据的起始索引
  - (可选): 被用来覆盖的数据的结束索引,默认为数据末尾

```js
console.log([1, 2, 3, 4].copyWithin(0, 2, 4)); // [3,4,3,4]
// 参数1为负数表示倒数
console.log([1, 2, 3, 4].copyWithin(-2, 0)); // [1,2,1,2]
console.log([1, 2, , 4].copyWithin(0, 2, 4)); // [, 4, , 4]
```

#### 遍历

##### 15. `entries()`

遍历键值对

```js
for (let [key, value] of ["a", "b"].entries()) {
  console.log(key, value);
}
// 0 "a"
// 1 "b"

// 不使用 for... of 循环
let entries = ["a", "b"].entries();
console.log(entries.next().value); // [0, "a"]
console.log(entries.next().value); // [1, "b"]
// 数组含空位
console.log([...[, "a"].entries()]); // [[0, undefined], [1, "a"]]
```

##### 16. `keys()`

遍历键名,返回一个数组

##### 17. `values()`

遍历键值。

#### 包含

##### 18. `includes()`

- 功能：数组是否包含指定值

- 参数:
  - 包含指定值
  - (可选)搜索的起始索引，默认为 0

:::warning
与 Set 和 Map 的 has 方法区分；Set 的 has 方法用于查找值；Map 的 has 方法用于查找键名
:::

```js
[1,NaN，3].includes(NaN) //true
```

#### 嵌套数组转一维数组

##### 19. `flat()`

- 参数: 指定转换的嵌套层数,默认是 1

```js
console.log([1, [2, , 3]].flat());
console.log([1, [2, [3, [4, 5]]]].flat(Infinity)); // [1, 2, 3, 4, 5]
```

##### 20. `flatMap(fn,thisArg)`

- 功能：先对数组中每个元素进行了的处理,再对数组执行 flat()方法
- 参数:
  - fn 遍历函数，该遍历函数可接受 3 个参数：当前元素、当前元素索引、原数组
  - thisArg 指定遍历函数中 this 的指向

```js
console.log([1, 2, 3].flatMap((n) => n * 2));
```

- map(): 返回一个新的 Array,每个元素为调用 func 的结果
- filter(): 返回一个符合 func 条件的元素数组
- some(): 返回一个 boolean,判断是否有元素复合 func 的条件
- every(): 返回一个 boolean, 判断每个元素是否符合 func 条件
- forEach(): 没有返回值,只针对每个元素调用 func
- reduce(): reduce 方法有两个参数，第一个参数是 callback，用于针对数组项的操作；第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。需要注意的是，reduce 方法返回值并不是数组，而是形如初始值的经过叠加之后的操作。

### 实例方法

#### 1. `Array.of()`

将一组值作为元素转化为数组

```js
Array.of(3, 11, 8); // [3,11,8]
Array.of(3); //[3]
```

:::tip
这个函数的主要目的,是弥补数组构造函数 Array()的不足。因为参数个数不同，会导致 Array()的行为有差异
:::

```js
Array(); //[]
Array(3); // [undefined,undefined,undefined]
Array(3, 11, 8); // [3,11,8]//当参数个数不小于两个时,Array()才会返回由参数组成的新数组
```

#### 2. `Array.from(arrayLike[,mapFn[,thisArg]])`

- 功能：将类数组对象（array-like object）或可迭代对象（iterable）转化成数组
- 参数:
  - arrayLike(必须):想要转换的内数组或可迭代对象
  - mapFn(可选)map 函数,用于对每个元素进行处理,放入数组的是处理后的元素
  - thisArg(可选)用于指定 map 函数执行的 this 对象

```js
let map = {
  do: function (n) {
    return n * 2;
  },
};
let arrayLike = [1, 2, 3];
console.log(
  Array.from(
    arrayLike,
    function (n) {
      return this.do(n);
    },
    map
  )
); // [2,4,6]
```

#### `Array.isArray()`

- 功能: 用来判断对象是否为数组

:::details Object.prototype.toString.call()、instanceof 以及 Array.isArray()的区别与优劣

1. `Array.isArray()`

- `Array.isArray()`优于`instanceof`, `Array.isArray()`可以检测出`iframes`
- **Polyfill**: `Array.isArray()`是 ES5 新增方法,当不存在时, 则在其他代码之前运行下面的代码将创建该方法

```js
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
```

2. `Object.prototype.toString()`

每一个继承 Object 的对象都有`toString`方法, 返回`[Object [type]]`,但当除了 Object 类型的对象外,其他类型直接使用`toString`方法时,会直接返回内容的字符串,所以要依靠`call`或`apply`方法来改变 toString 的执行上下文

```js
const an = ["Hello", "An"];
an.toString(); //'hello,An'
Object.prototype.toString.call(an); //"[object Array]"
```

这种方法对于所有基本的数据类型都能判断,即使是 null 和 undefined

```js
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(Symbol(1)); //"[object Symbol]"
// ...
Object.prototype.toString.call(NaN); // "[object Number]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

> 如上,因 NaN 被判断为 Number,请使用`isNaN()`方法或`Object.is(NaN,obj)`来判断一个值是否是 NaN，原因是 NaN 与所有值都不相等，包括它自己

3. `instanceof`

`instanceof` 的内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

但 `instanceof` 只能用来判断对象类型，原始类型不可以。并且所有对象类型 `instanceof Object` 都是 true。

```js
[] instanceof Object; // true
```

:::

## Date 类型

Date 对象: 封装一个时间点,提供操作时间的 API, Date 对象中封装的是从 1970 年 1 月 1 日 0 点至今的毫秒数

### 创建 Date 对象 4 种方式

#### 1.`new Date()`

```js
let now = new Date(); // 获取客户端的当前系统时间
```

#### 2. `new Date(year,month, ...)`

根据指定的日期时刻来创建 Date 对象；传入的参数按顺序依次是:年、月、日、小时、分钟、秒、毫秒。而这些参数都是可以缺省的
:::warning
当 new Date()只接收一个参数时,则接收的不是年,而是毫秒,针对 1970 年 1 月 1 日北京时间上午 8 点整开始计数(用**UTC 时间**来算，就是 1970 年 1 月 1 日 0 点 0 分 0 秒)
:::

```js
var d7 = new Date(2099); // 不是年,而是毫秒
```

:::warning
一个到十二月份是由 0~11 来代表的,0 代表一月份，11 代表十二月份
当代表年的参数时 1 位数或 2 位数是,则自动代表**19XX**,和自动加上 1900 没啥两样,一般来说不会触发,但还是知道 Date 构造器的这种特性为佳
:::

```js
var d1 = new Date(97, 6, 1); //代表1997年7月1日
var d2 = new Date(1, 0, 1); //代表1901年1月1日
```

#### 3. `new Date(dateString)`

```js
let d1 = new date("1994/02/04 03:23:55"); //创建自定义事件
let d2 = new Date("October 1, 2018 11:11:11");
let d3 = new Date("1997-11-28"); // ISO Date 国际标准
let d4 = new Date("04/19/2099"); // short Date
let d5 = new Date("April 19 2099"); // 等同于"19 April 2099"
```

#### 4. `new Date(new Date(oldDate))`

```js
let oldDate = new Date("1994/02/04");
let newDate = new Date(oldDate); // 复制一个时间对象
```

### Date 对象的输出

Date 对象的输出,常用如以下三种方式

#### `toString()`: 输出是默认自动使用此方法

toString()方法(等价于默认下直接赋值对象本身), 输出类似`Fri Apr 10 2020 17:11:16 GMT+0800 (中国标准时间)`

#### `toUTCString()`

输出类似`Fri, 10 Apr 2020 09:13:09 GMT`

#### `toDateString()`

输出类似`2020/4/10 下午5:14:51`

### Date 对象 - Get 方法

- getFullYear()方法 - 获取代表年份的四位数字（yyyy）
- getMonth()方法 - 获取代表月份的数字（0~11）
- getDate()方法 - 获取代表当月几号的数字（1~31）
- getHours()方法 - 获取代表小时的数字（0~23）
- getMinutes()方法 - 获取代表分钟的数字（0~59）
- getSeconds()方法 - 获取代表秒的数字（0~59）
- getTime()方法 - 获取时间戳数字（以毫秒计算距离 utc 时间 1970 年 1 月 1 日 0 点 0 分 0 时的时间差）
- getDay()方法 - 获取代表周几的数字（0~6）
- getMilliseconds()方法 - 获取代表毫秒的数字（0~999）
- Date.now()方法 - 获取代表当前时间的时间戳数字
  ::: tip
  若使用 UTC 日期与事件,在 get 和具体的后缀词之间加上 UTC 即可,常用的方法有: `getUTCDate()`、`getUTCDay()`、`getUTCFullYear()`、`getUTCHours()`、`getUTCMinutes()`、`getUTCMonth()`、`getUTCSeconds()`、`getUTCMilliseconds()`
  :::

### Date 对象 - Set 方法

- setFullYear()方法 - 设置年份信息（yyyy）
- setMonth()方法 - 设置月份的数字（0~11）
- setDate()方法 - 设置代表当月几号的数字（1~31）
- setHours()方法 - 设置代表小时的数字（0~23）
- setMinutes()方法 - 设置代表分钟的数字（0~59）
- setSeconds()方法 - 设置代表秒的数字（0~59）
- setMilliseconds()方法 - 设置代表毫秒的数字（0~999）
- setTime() - 设置时间戳数字信息（以毫秒计算距离 utc 时间 1970 年 1 月 1 日 0 点 0 分 0 时的时间差）
  ::: tip
  若使用 UTC 日期与事件,在 set 和具体的后缀词之间加上 UTC 即可,常用的方法有: `setUTCDate()`、`setUTCDay()`、`setUTCFullYear()`、`setUTCHours()`、`setUTCMinutes()`、`setUTCMonth()`、`setUTCSeconds()`、`setUTCMilliseconds()`
  :::

## RegExp 类型

正则表达式（Regular Expression）是一种对字符串操作的逻辑公式，其描述的是一种**字符串匹配的模式（Pattern）**；根据这种匹配模式，可对字符串进行诸如：搜索子串、替换子串、验证字符串是否符合指定匹配模式等操作。

### 语法

`/正则表达式(pattern)/修饰符(modifiers,非必选)`

### 修饰符

| 修饰符 | 说明                                                  |
| ------ | ----------------------------------------------------- |
| `i`    | 执行匹配过程中,**忽略大小写的区别**                   |
| `g`    | 执行全局匹配(找到所有匹配,而非找到第一个匹配后就停止) |
| `m`    | 执行**多行匹配**                                      |

### RegExp 对象方法

#### 1. `compile()`

- 用于在脚本执行过程中编译正则表达式
- 改变和重新编译正则表达式

#### 2.`exec()`

- 功能: 用于检索字符串中的正则表达式的匹配
- 参数: String(必填), 要检索的字符串
- 返回值: 返回一个数组, 其中存放的匹配的结果。如果没有找到匹配，则返回值为 null

#### 3. `test()`

- 功能: 用于检测一个字符串是否匹配某个模式
- 参数: string(必填), 要检索的字符串
- 返回值: true 或者 false
  ::: tip
  支持正则表达式的 String 对象的方法有: `search()`、`match()`、`replace()`和`split()`
  :::

## Function 类型

### Function 对象属性

#### 1. `arguments`

- arguments.length：获取函数实参的个数
- arguments.callee：获取函数对象本身的引用
- arguments.callee.length：获取函数形参的个数
  :::tip
  JavaScript 中每个函数都会有一个 Arguments 对象实例 arguments，它引用着函数的实参，可以用数组下标的方式引用每个始计传入的值
  :::

### Function 对象方法

#### 1. `toString()`

将函数体转化成对应的字符串

## Boolean 类型

### 1. `toString()`

根据布尔值返回字符串"true"或"false"

> 注释: 在 Boolean 对象被用于字符串环境中, 此方法会自动被调用

### 2. valueOf()

返回 Boolean 对象的原始值

### 会返回 false 的特殊值

- 0
- -0
- ""(空字符串)
- undefined
- null
- false
- NaN

## Number 类型

1. `toString()`
   将 Number 数值转换为字符串，该方法接受一个可选参数基数，若省略该参数，则默认基数为 10，即十进制
2. `toLocalString()`
   把一个 Number 对象转换为本地格式的字符串
3. `valueOf()`
   返回一个 Number 对象的基本数字值

:::tip
`valueOf()`方法通常由 JavaScript 在后天自动进行调用，而不是现实地处于代码中
:::

## BigInt 类型 <Badge text="ES2020新增"/>

JavaScript 能处理的最大数为`2**53`, 也就是`9007199254740991`, 可以写作`Number.MAX_SAFE_INTEGER`。

当数字超过`Number.MAX_SAFE_INTEGER`时：

```js
console.log(9999999999999999); // → 10000000000000000
// 注意最后一位的数字
9007199254740992 === 9007199254740993; // → true
```

任何超出范围的数值都可能失去精度

- 只需在整数的末尾添加`n`就可以创建 BigInt
- 或者调用`BigInt()`

BigInt 文字也可用二进制、八进制、十六进制表示

```js
// binary
console.log(0b100000000000000000000000000000000000000000000000000011n);
// → 9007199254740995n

// hex
console.log(0x20000000000003n);
// → 9007199254740995n

// octal
console.log(0o400000000000000003n);
// → 9007199254740995n

// note that legacy octal syntax is not supported
console.log(0400000000000000003n);
// → SyntaxError
```

### 隐式类型转换

不能使用严格相等运算符将 BigInt 和常规数字进行比较,因为它们类型不同:

但是可以使用等号运算符,他在处理操作数之前执行隐式类型转换

```js
10n === 10; // false
10n == 10; // true
```

因为隐式转换可能丢失信息, 所以不允许在`BigInt`和`Number`之间进行混合操作。当混合使用整数和浮点数时，结果可能无法由`BigInt`或`Number`精确表示

```js
+10n; // Uncaught TypeError: Cannot convert a BigInt value to a number
10 + 10n; // → TypeError
Math.max(2n, 4n, 6n); // → TypeError
```

:::waring 注意
关系运算符并不遵循此规则

```js
10n > 5;
```

:::
由于上述的限制, 不能混合使用`Number`和`BigInt`进行算术操作. 也不能将`BigInt`传给 Web API 和内置的 JS 函数,这些函数需要一个`Number`类型的数字。

所以希望使用`Number`和`BigInt`进行算数运算时,要先用`Number()`或`BigInt()`进行类型转换

```js
const arr = [3n, 4, 1n, 0, -1n];
arr.sort(); // [-1n,0,0n,2,3n,4]
```

:::tip 兼容
不幸的是，转换 BigInt 是一个极其复杂的过程，这会导致严重的运行时性能损失。直接 polyfill BigInt 也是不可能的，因为该提议改变了几个现有操作符的行为。目前，更好的选择是使用[JSBI](https://github.com/GoogleChromeLabs/jsbi)库，它是 BigInt 提案的纯 JS 实现。
这个库提供了一个与原生 BigInt 行为完全相同的 API。下面是如何使用 JSBI：

```js
import JSBI from "./jsbi.mjs";

const b1 = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
const b2 = JSBI.BigInt("10");

const result = JSBI.add(b1, b2);

console.log(String(result)); // → '9007199254741001'
```

使用 JSBI 的一个优点是，一旦浏览器支持，就不需要重写代码。 相反，可以使用 babel 插件自动将 JSBI 代码编译为原生 BigInt 代码。

:::

## String 类型

### String 对象属性

#### 1. length

功能： String 对象的 length 属性声明了该字符串中的字符串数

### String 对象方法

#### 1.`charAt(index)`

- 功能: 返回指定位置的字符
- 参数: index(必须), 为目标字符的下标位置

:::tip
若参数 index 不在 0 与 string.length 之间,该方法将返回一个空字符串
:::

#### 2.`charCodeAt(index)`

- 功能: 返回在指定的位置的字符的 Unicode 编码
- 参数: index(必须),默认 0,为目标字符的下标位置

:::tip
若 index 不在 0 与 string.length 之间,该方法将返回 NaN
:::

:::theorem 字符串操作

```ts
/**
 * @function isReserved 检测字符串是否以$或者_开头
 * @param {String} str
 **/
export function isReserved(str: string): boolean {
  const c = (str + "").charCodeAt(0); // 默认0,不填好像也没事
  return c === 0x24 || c === 0x5f;
}
```

从传递进来的字母序列中找到缺失的字母并返回它。如：fearNotLetter("abce")应该返回“d”

```js
function fearNotLetter(str) {
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i));
  }
  for (let j = 0; i < str.length; i++) {
    let num = arr[j] - arr[j - 1];
    if (num !== 1) return String.fromCharCode(arr[j] - 1);
  }
  return undefined;
}
```

:::right
[[从源码中学习」Vue 源码中的 JS 骚操作](https://github.com/roger-hiro/BlogFN/blob/master/%E3%80%8C%E4%BB%8E%E6%BA%90%E7%A0%81%E4%B8%AD%E5%AD%A6%E4%B9%A0%E3%80%8DVue%E6%BA%90%E7%A0%81%E4%B8%AD%E7%9A%84JS%E9%AA%9A%E6%93%8D%E4%BD%9C.md)
:::

#### 3. `indexOf()`

- 功能: 检索字符串,返回指定子字符串在字符串中首次出现的位置。
- 参数：
  - 参数 1：检索目标子字符串，必须
  - 参数 2： 在字符串中开始检索的位置，可选。其合法取值是 0 到`stringObject.length - 1`。如省略该参数，则将从字符串的首字符开始检索

:::warning
indexOf()方法对大小字母敏感
如果要检索的字符串值没有出现,则该方法返回-1
:::

#### 4. `lastIndexOf()`

- 功能: 从后向前搜索字符串,返回指定字符串在字符串中首次出现的位置。
- 参数
  - 参数 1：检索目标字符串(必须)
  - 参数 2：在字符串中开始检索的位置(可选)，其合法取值是 0 到`stringObject.length - 1`。如省略该参数，则将从字符串的最后一个字符开始检索

#### 5. `startsWith(searchString[,position])` & `endsWith(searchString[,length])`

- 功能: 判断当前字符串是否以另外一个给定的字符串开头/结尾
- 参数

  - 参数 1: 检索目标字符串(必须)
  - 参数 2: 在字符串中开头/结束检索的位置

#### 6.`includes(searchString[,position])`

- 功能：字符串是否包含指定字符

- 参数:
  - 包含指定值
  - (可选)搜索的起始索引，默认为 0

#### 7. `match()`

- 功能：返回指定位置的字符
- 参数： 规定要检索的字符串值或待匹配的 RegExp 对象(必须)
- 返回值：存放匹配结果的数组。该数组的内容依赖于 RegExp 是否具有全局标志`g`。

:::tip 提示
如果 RegExp 没有标志 g,那么`match()`方法只能在 stringObject 中执行一次匹配。如果没有找到任何匹配的文本，`match()`将返回 null。否则，它将返回一个数组，其中存放了与它找到的匹配文本有关信息。该数组的第 0 个元素是匹配文本，而其余的元素存放的是与正则表达式的子表达式的文本。除了这些常规的数组元素之外，返回的数组还包含两个对象属性。index 属性声明的是匹配文本的其实自付在 stringObject 的位置，input 属性声明的是对 stringObject 的引用。<br/>
如果 RegExp 有标志 g，则`match()`方法将执行全局检索，找到 stringObject 中的所有匹配子字符串。若没有找到任何匹配的子串，则返回 null。如果找到了一个或多个匹配子串，则返回一个数组。不过全局匹配返回的数组的内容与前者大不相同，它的数组元素中存放的是 stringObject 中所有的匹配子串，而且也没有 index 属性或 input 属性
:::

```js
let s1 = "hello21 world21";
console.log(s1.match(/\d{2}/)); // ['21',index:5,input: 'hello21 world21']
let s2 = "hello21 world21";
console.log(s2.match(/\d{2}/g)); // ['21','21']
```

#### 8. `matchAll()` <Badge text="ES2020新增"/>

- 用于获取特定正则表达式的**所有**匹配项(包括捕获组)

```JS
const test = "climbing, oranges, jumping, flying, carrot"
const regex = /([a-z]*)ing/g;
let result = test.matchAll(regex)
result.next() // {value:["climbing", "climb", index: 0, input: "..."...],done:false}
```

#### 9. `replace()`

- 功能：在字符串中用一些字符替换另一种字符，或替换一个与正则表达式匹配的子串
- 参数：
  - 参数 1:regexp/subStr(必须),规定子字符串或要匹配的 RegExp 对象
  - 参数 2:replacement(必须),用于替换的字符串值
- 返回值: 替换后的一个新字符串

```js
let s = "hello world hello";
console.log(s.replace("hello", "hi")); // hi world hello
console.log(s.replace(/hello/, "hi")); // hi world hello
console.log(s.replace(/hello/g, "hi")); // hi world hi
```

::: warning
replace 方法返回一个新字符串,并不会修改原字符串
:::

#### 9. `search()`

- 功能: 用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串
- 参数： regexp/subStr(必须),规定子字符串或要匹配的 RegExp 对象。
- 返回值: 原字符串中第一次匹配到目标字符串的起始位置

:::warning
`search()`方法不执行全局匹配，它将忽略标志 g。也就是说，它只匹配一次。若没有匹配到结果，则返回-1.
:::

#### 10. `toLowerCase()`&`toUpperCase()`

- 功能: 把字符串转换为小写/大写
- 返回值:一个新字符

#### 11. `concat()`

- 功能: 用于连接两个或多个字符串(不修改原字符串)
- 返回值: 衔接后的一个新字符串

:::warning
通常使用"+"运算符
:::

#### 12. `padStart(targetLength[,padString])` & `padEnd()`

- 用另一个字符串填充当前字符串(可重复)
- 参数:
  - targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
  - padString(可选):填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断。此参数的缺省值为 " "（U+0020）。

#### 13. `repeat(count)`

- 重复 str 字符串 count 次

#### 14. `trim()` & `trimStart()/trimEnd()` & `trimLeft()/trimRight()`

- 功能: 返回去除两端、开头/末端、左/右端空格的新字符串

#### 15. `split(separator[,limit])`

- 功能: 用于把一个字符串分割成字符串数组,是`Array.join()`的逆操作
- 参数:
  - separator(必须),字符串或者正则表达式,从该参数指定的地方分割原字符串
  - limit(可选),指定返回数组的最大长度
- 返回值: 一个字符串数组

```js
let s = "hi baby";
console.log(s.split("")); //['h','i',' ','b','a','b','y']
console.log(s.split(" ")); //['hi',''baby']
console.log(s.split("b")); //['hi','a','y']
```

#### 16. `slice(start[,end])`

- 功能: 截取字符串的某个部分,以新的字符串返回被提取的部分
- 参数:
  - start(必须),截取的起始位置
  - end(可选),截取的结束位置
- 返回值: 截取部分, 一个新的字符串

#### 12. `substr(start[,length])`<Badge text="beta" type="warning"/>

- 功能: 截取从指定下标开始的指定数目的字符
- 参数:
  - start(必须) 截取的起始位置, 接受负值
  - length(可选) 截取的字符串的长度,若未指定,则默认截取到原字符串的末尾。
- 返回值：截取部分，一个新的字符串

:::warning Notice
ECMAScript 没有对该方法进行标准化,因此不建议使用它
:::

#### 13. `substring()`

- 功能: 截取字符串中介于两个指定下标之间的字符
- 参数:
  - start(必须),截取的起始位置
  - end(可选),截取的结束位置,若未指定,则默认截取到原字符的末尾
- 返回值: 截取部分,一个新的字符串

:::tip Note
与`slice()`和`substr()`方法不同的是,`substring`不接受负的参数

如果参数 start 与 stop 相等，那么该方法返回的一个空串, `slice()`与之相同

如果 start 比 end 大，那么该方法在提取子串之前会交换这两个参数，而`slice()`方法返回一个空字符串
:::

## Global 对象(全局对象)

:::tip 说明
全局对象只是一个对象,而不是类。既没有构造函数，也无法实例化 一个新的全局函数
:::

### 属性

#### Infinity

代表正的无穷大的数值

```js
console.log(6 / 6); //Infinity
console.log(0 / 0); // NaN
console.log(1.7976931348623157e10308); //Infinity
console.log(-1.7976931348623157e10308); //-Infinity
```

:::tip
Infinity 代表了超出 Javascript 处理范围的数值也就是说 JS 无法处理的数值是 Infinity
:::

#### NaN

代表非数字的值
:::tip
请使用`isNaN()`或`Object.is(NaN,obj)`方法来判断一个值是否是 NaN，原因是 NaN 与所有值都不相等，包括它自己
:::

#### undefined

代表未定义的值
:::tip
判断一个变量是否定义,只能用`=== undefined`运算来测试，因为`undefined == null`<br/>
null: 表示无值<br/>
undefined 表示一个未声明的变量,或已声明但没有赋值的变量,或一个并不存在的对象属性
:::

### 方法

#### 1. `encodeURI(URIString)`

- 功能: 将字符串作为 URI 进行编码, 返回值为 URIString 的副本
- 参数: URIString(必须): 一个待编码的字符串

- 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码: `-_.!~*'()`。
- 该方法的目的是对 URI 进行完整的编码,因此对在 URI 中具有特殊含义的 ASCII 标点符号(`;/?@&=+$,#`),是不会进行转义的

:::tip 提示
如果 URI 组件中含有分隔符, 比如?和#,则应当使用 encodeURIComponent()方法分别对各组件进行编码
:::

#### 2. `encodeURIComponent(URIString)`

- 功能: 将字符串作为 URI 组件进行编码, 返回值为 URIString 的副本
- 参数: URIString(必须): 一个待编码的字符串

- 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码: `-_.!~*'()`。
- 其他字符(比如: `;/?:@&=+$,#`这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

:::tip
`encodeURI()`和`encodeURIComponent()`的区别:
他们都是编码 URI,唯一区别就是编码的字符范围。<br/>
`encodeURI()`不会对下列字符 ASCII 字母、数字、`~!@#$&*()=:/,;?+'`, <br/>
`encodeURIComponent()`方法不会对下列字符编码 ASCII 字母、数字、`~!*()'`, <br/>
所以 encodeURIComponent 比 encodeURI 编码的范围更大。<br/>
但按实例来说，encodeURIComponent 会把`http://`编码为`http%3A%2F%2F`而 encode 却不会
:::

- 使用场景:
- 当你需要编码整个 URL，然后使用这个 URL，则使用 encodeURI。

```js
console.log(encodeURI("http://www.baidu.com/home/some other thing"));
// 编码后为：http://www.baidu.com/home/some%20other%20thing; 其中，空格被编码成了%20

//但是如果你用了encodeURIComponent
console.log(encodeURIComponent("http://www.baidu.com/home/some other thing"));
// http%3A%2F%2Fwww.baidu.com%2Fhome%2Fsome%20other%20thing 连 "/" 都被编码了，整个URL已经没法用了
```

- 当你需要编码 URL 中的参数时,那么使用`encodeURIComponent()`

```js
var param = "http://www.baidu.com/home/"; //param为参数
param = encodeURIComponent(param);
var url = "http://www.baidu.com?next=" + param;
console.log(url); //'http://www.baidu.com?next=http%3A%2F%2Fwww.baidu.com%2Fhome%2F'
//显然，参数中的 "/" 被编码了，而如果用encodeURI肯定要出问题，因为后面的/是需要编码的。
```

::: tip 补充
与此同时, `decodeURI()`和`decodeURIComponent()`是用来解码的,逆向操作
:::

#### 3.`parseInt(string,radix)`

- 功能:解析一个字符串,并返回一个整数
- 参数:
  - string(必须): 待解析的字符串
  - radix(可选): 表示要解析的数字的基数。该值介于 2~36 之间。
    如果省略该参数或者其值为 0，则数字以 10 为基础来解析。如果它以'0x'或'0X'开头,将以 16 为基数
    如果该参数小于 2 或大于 36，则将返回 NaN

```js
console.log(parseInt("11", 9)); //10 (9+1)
console.log(parseInt("11", 2)); //3 (2+1)
console.log(parseInt("17", 8)); //15 (8+7)
console.log(parseInt("0x0011")); //17
```

#### 4. `parseFloat()`

- 功能: 解析一个字符串, 并返回一个浮点数。该函数指定字符串中的某个字符是否为数字。如果是，则对字符串进行解析，直到达到数字的末端为止
- 参数：String（必须），待解析的字符串

```js
console.log(parseFloat("10")); //10
console.log(parseFloat("10.00")); //10
console.log(parseFloat("10.33")); //10.33
console.log(parseFloat(" 60 ")); //60 首尾的空格会忽略
console.log(parseFloat("23 34 45")); //23 中间的空格不会忽略，会中断
console.log(parseFloat("23 years")); //23
console.log(parseFloat("i am 23")); //NaN
```

:::warning
开头和结尾的空格是允许的。如果字符串的第一个字符不能转换为数字，那么`parseFloat()`会返回 NaN 如果只想解析数字的整数部分,请使用`parseInt()`方法。
:::

#### 5. `isFinite(number)`

- 功能: 检查参数是否为无穷大
- 参数:
  - number(必须): 待检测数字。
    如果 NaN、正、负无穷大的数、返回 false

#### 6. `isNaN(number)`

- 功能: 检测其参数是否为非数字值

:::tip 提示
`isNaN()`函数通常用来检测`parseFloat()`和`parseInt`的结果, 以判断它们表示的是否是合法的数字。当然也可以用`isNaN()`函数来检测算数错误。
:::

#### 7. `Number(object)`

- 功能: 把对象的值转换成数字
- 参数: object(必须): 待转换对象。
  如果参数是 Date 对象，`Number()`返回从 1970 年 1 月 1 日至今的毫秒数，即时间戳。如果对象的值无法转换为数字，那么 Number() 函数返回 NaN。

```js
console.log(Number(new Boolean(true)))// 1
console.log(Number(new Date())); //1586553414703
console.log(Number('999))// 999
console.log(Number('999 888')); //NaN
```

#### 8. 不常用方法

- `toString()`: 将数字转换成字符串(**返回 String 类型**)
- `toExponential()`: 可选计数(**返回 String 类型**)
- `toFixed()`: 保留小数(**返回 String 类型**)
- `toPrecision()`: 指定数组长度(**返回 String 类型**)

## Math 对象

常用方法:

- `Math.abs()`: 取绝对值
- `Math.ceil()`: 向上取整
- `Math.floor()`: 向下取整
- `Math.round()`: 四舍五入取整
- `Math.random()`: 生成 0~1 间的随机数(>0)
- `Math.max(x,y)`: 取 x、y 中较大的那个
- `Math.min(x,y)`: 取 x、y 中较小的那个

## JSON 对象

我们常说的对象字面量其实不是 JSON 对象, 但是有真正的 JSON 对象。

两者完全不一样概念，在新版的浏览器里 JSON 对象已经被原生的内置对象了，目前有 2 个静态方法：JSON.parse 用来将 JSON 字符串反序列化成对象，JSON.stringify 用来将对象序列化成 JSON 字符串。

老版本的浏览器不支持这个对象，但你可以通过 json2.js 来实现同样的功能。

### JSON 对象方法

#### 1. `JSON.parse()`

- 功能: 将 JSON 字符串反序列化为对象
- 参数: JSON 字符串
- 返回值: 对象

#### 2. `JSON.stringify()`

- 功能: 将一个对象解析为 JSON 字符串
- 参数: 对象
- 返回值: JSON 字符串

<hr/>
API催眠功能显著，这就是JavaScript的乐趣吗?i了i了
