---
title: 构造函数
date: 2020-03-26
tags:
  - JavaScript
  - 学习笔记
categories:
  - frontEnd
---

## 创建对象

新建继承构造函数的新对象`this`会绑定到新建对象如果需要共享原型对象的`prototype`属性，不能使用`this`定义。需要用原型函数名`.prototype.`对象属性来定义，因为 this 属性指针入口已经指向了新建对象

## 显式原型与隐式原型

### `__proto__`隐性原型

创建对象时自动添加的，默认值为构造函数的`prototype`属性值，所有的是**实例对象**都有 `__proto__` 属性，他引用了创建这个函数的`prototype`。

> 对象的隐性原型的值为其对应的构造函数的显性原型的值

### `prototype`显式原型

当使用 new 方法调用该构造函数的时候，它默认指向一个`Object`空（原型）对象（没有我们的属性），它被用于构建新对象的 `__proto__`。另外它不可写，不可枚举，不可配置。程序员可以操作显式原型，但是不能直接操作隐式原型

原型对象之所以特殊，是因为它拥有一个普通对象没有的能力：将它的属性共享给其他对象。

```js
function Fn() {
  //内部语句:this.prototype = {}
}
// 每个函数function都有一个prototype,即显式原型属性,默认指向一个空的Object对象
console.log(Fn.prototype);
var fn = new Fn(); //内部语句:this.__proto__ = Fn.prototype
console.log(Fn.prototype === fn.__proto__);
```

### 关于`prototype`中的`constructor`属性

`constructor`是函数原型的一个属性, 指向构造函数(类)本身

```js
function Foo() {
  this.name = name;
}
Foo.prototype.constructor === Foo; // true
var a = new Foo();
a.constructor === Foo; // true
```

:::warning
当`a.constructor === Foo`时，并不能说明 a 是由 Foo 构成的。实际上，`a.constructor`的引用是委托给了`Foo.prototype`(本身 a 是没有这个属性的),所以才会出现等价的情况。

而对于`constructor`，他并不是什么神秘的属性，`Foo.prototype`的`constructor`属性只是 Foo 函数在声明时的默认属性，再也没什么区别了。
:::

## 原型链

- `__proto__`用于向父级递归,因为自身含有父级的`__proto__`引用（同样也表示自身原型）
- `prototype`用于表示自身原型,因为含有引用自身的`constructor`，并被自己的`constructor`所拥有

:::tip 理解
js 通过`__proto__`进行父子继承，而`prototype`是构造器的一个属性对象，用来链接`__proto__`，实现自身原型链接。

访问一个对象的属性时，先在这个对象自身属性中寻找，如果没有，在沿着`__proto__`这条链向上找，这就是`[[prototype]]`链(原型链)，如果找不到，最后返回`undefined`。
通过`__proto__.__proto__.__proto__.__proto__.constructor.prototype`这种链接进行链接。
:::
![原型链](/img/proto.png)

```js
fn.__proto__.constructor.prototype === Fn.prototype;
// fn是引用变量，Fn是构造函数对象
fn.__proto__ === Fn.prototype; // 牢记这一点
```

引用变量的隐形原型指向构造函数的显示原型，而隐性原型内的构造器引用了自身真实函数构造器

### `instanceof`操作符到底是怎么穿梭的

对于`A instanceof B`来说，它的判断规则是：沿着`A`的`__proto__`这条线来找,同时沿着 B 的`prototype`这条线来找,同时两条线能找到同一引用，即同一个对象，那么就返回`true`。如果找到终点还未重合，则返回`false`。

```js
function fn() {}
var f1 = new fn();
console.log(f1 instanceof Object); // true
console.log(f1 instanceof fn); // true
```

::: theorem 模拟 instanceof
遍历左边变量的原型链，直到找到右边变量的 prototype，如果没有找到，返回`false`

```js
const myInstanceOf = (left, right) => {
  let leftValue = left.__proto__;
  let rightValue = right.prototype;
  while (true) {
    if (leftValue === null) return false;
    if (leftValue === rightValue) return true;
    leftValue = leftValue.__proto__;
  }
};
```

::: right
来自 [初、中级前端应该要掌握的手写代码实现](https://juejin.im/post/5e24590ef265da3e152d27bc)
:::

### 当我们调用`new`时发生了什么

在 js 中构造函数只是一些使用`new`操作符时被调用的函数，所以实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

当使用`new`来调用函数时，会执行以下操作

- 创建一个全新的对象
- 这个新对象会被执行`[[prototype]]`原型链链接 (`this.__proto__ = Fn.prototype`)
- 这个新对象会绑定到函数调用的 this
- 如果函数并没有返回其他对象，那么`new`表达式中的函数会自动返回这个函数

下面的例子

```js
function SuperType(name) {
  // 定义了一个超类
  this.name = name;
}
function SubType() {
  // 定义了子类1，继承了超类，无返回值
  SuperType.call(this, "Cong1");
  this.age = 29;
}
function SubType2() {
  // 定义了子类2，继承了超类，返回了一个引用类型的值
  SuperType.call(this, "Cong2");
  this.age = 29;
  return { a: 2 };
}
function SubType3() {
  // 定义了子类3，继承了超类，返回了一个值类型的值
  SuperType.call(this, "Cong3");
  this.age = 29;
  return 3;
}
/* 下面比较有new操作符和无new操作符调用子类的区别 */
var instance1_nonew = SubType(); // undefined
var instance2_nonew = SubType2(); // Object {a: 3}
var instance3_nonew = SubType3(); // 3
var instance1_hasnew = new SubType(); // SubType {name: "Cong1", age: 29}
var instance2_hasnew = new SubType2(); // Object {a: 2}
var instance3_hasnew = new SubType3(); // SubType3 {name: "Cong1", age: 29}
```

- 没有`new`操作符的语句,就像我们平时调用函数一样,得到的肯定就是函数的返回值,所以前三个`_nonew`变量就会得到图示所示的结果。
- 而看到下面 3 个`_hasnew`变量，行为却有点不同，没有返回值的`1_hasnew`就直接构造了一个实例对象，而`2_hasnew`和`3_hasnew`都是有返回值的,两者的表现却不同了。

根据上面所说的原理再来分析这个过程：

1. 首先新建一个对象 `var instance = {}`
2. 给这个对象设置`[[prototype]]`链：`instance.__proto__ = SubType.prototype`
3. 绑定`this`，将`Subtype`中的`this`指向`instance`，执行`Subtype`中的语句进行赋值。
   - 如果只是一个引用类型（对象），那么就替换掉 instance 本身这个对象。（如：`instance2_hasnew`）
   - 如果是值类型,那么就直接丢弃它，返回 instance 对象本身。（如`instance3_hasnew`）

#### 模拟`new`

```js
const createNew = (Con, ...args) => {
  const obj = {};
  Object.setPrototypeOf(obj, Con.prototype);
  let result = Con.apply(obj, args);
  return result instanceof Object ? result : obj;
};
```

## 函数和对象的关系

![红色标识为特例](/img/prototype.webp)

1. 函数的显示原型指向的对象默认是空 Object 实例对象(但 Object 不满足)

```js
Fn.prototype instanceof Object; // true
Object.prototype instanceof Object; //false
Function.prototype instanceof Object; // true
typeof Object;
```

2. 所以函数都是 Function 的实例(包含 Function)

```js
Function.__proto__ === Function.prototype; // true
```

3. `Object`的原型对象是原型链尽头

```js
Object.prototype.__proto__ === null; // true
```

由以上猜测得

- 首先有的应该是`Object.prototype`，它是由`Javascript`引擎创造出来的。
- 紧接着才有`Function.prototype`，并把它的`__proto__`连接到了 `Object.prototype`
- 接下来，将各种内置引用类型的构造函数的`__proto__`连接到了`Function.prototype`。
- 执行`Function.__proto__`连接到`Function.prototype`的操作。
- 执行`Object.__proto__`连接到`object.prototype`的操作
- 最后才是对`Function`和`Object`实例的挂载

## 继承

### 寄生组合继承

```js
function Super(foo) {
  this.foo = foo;
}
Super.prototype.printFoo = function () {
  console.log(this.foo);
};
function Sub(bar) {
  this.bar = bar;
  super.call(this);
}
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
```

### ES6 版继承

```js
Class Super(){
  constructor(foo){
    this.foo = foo
  }
  printFoo(){
    console.log(this.foo)
  }
}
Class Sub extends Super{
  constructor(foo,bar){
    Super(foo)
    this.bar = bar
  }
}
```

::: warning
详情请学习[Class 的继承](https://es6.ruanyifeng.com/#docs/class-extends)
:::

## 面试题

> 一道特别火的面试题

题目如下:

```js
function Foo() {
  getName = function () {
    alert(1);
  };
  return this;
}
Foo.getName = function () {
  alert(2);
};
Foo.prototype.getName = function () {
  alert(3);
};
var getName = function () {
  alert(4);
};
function getName() {
  alert(5);
}
// 请写出以下结果
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

### 回顾基础

```js
function User(name) {
  var name = name; //私有属性
  this.name = name; //公有属性
  function getName() {
    return name; // 私有方法
  }
}
//公有方法
User.prototype.getName = function () {
  return this.name;
};
User.name = "Kory"; // 静态属性
User.getName = function () {
  return this.name; // 静态方法
};
var kory = new User("kory"); // 实例化
```

1. 调用公有方法，公有属性，我们必须先实例化对象，也就是用 new 操作符实例化对象，就可构造函数实例化对象的方法和属性，并且公有方法是不能调用私有方法和静态方法的
2. 静态方法和静态方法是无需实例化就可以调用
3. 而对象的私有方法和属性，外部是不可以访问的

### 解答

第一问答案就是 2

#### 第二问

定义函数有两种类型,函数表达式和函数声明

```js
getName(); // b
// 函数表达式
var getName = function () {
  console.log("a");
};
getName(); // a
//函数声明
function getName() {
  console.log("b");
}
getName(); // a
```

- Javascript 解释器中存在一种变量声明被提升的机制，也就是说函数声明会被提升到作用域的最前面。
- 而用函数表达式创建的函数是在运行时进行赋值，而要等到表达式赋值完成后才能调用

函数执行上下文具体参见[执行上下文](040301.html)

```js
var getName; // 表量提升,此时为undefined
getName(); // b 函声明数被提升到最前面了
var getName = function () {
  console.log("a");
}; // 函数表达式此时才开始覆盖函数声明的定义
getName(); // a
function getName() {
  console.log("b");
}
getName(); // a 此时就执行了函数表达式的值
```

::: tip
javascript 中函数声明和函数表达式是存在区别的，**函数声明**在**Js 解析时**进行函数提升，因此在同一个作用域内，不管函数声明在哪里定义，该函数都可以进行调用。而**函数表达式**的值是在 JS**运行时**确定，并且在表达式赋值完成后，该函数才能进行调用。
:::
所以第一问的答案就是 4，5 的函数声明被 4 的函数表达式覆盖了

#### 第三问

`Foo().getName()`先执行了 Foo 函数,然后调用 Foo 函数的返回值对象的`getName`属性函数。<br/>
Foo 函数的第一句`getName = function() { alert(1) }`是一句函数赋值语句，注意它没有 var 声明，所以先向当前`Foo`函数作用域寻找 getName 变量，没有。再向当前函数作用域上层，即外层作用域内寻找是否含有 getName 变量，找到了，也就是第二问中的`alert(4)`函数, 将此变量的值赋值为`function(){ alert(1) }`，此处修改外层作用域的 getName 函数
::: warning
此处若依然没有找到会一直向上查找 window 对象,若 window 对象中也没有 getName 属性,就在 window 对象中创建一个 getName 变量
:::
Foo 函数的返回值是 this，此处的 this 指向 window 对象，所以这里相当于执行`window.getName()`，所以最终输出 1

#### 第四问

同第三问, 答案是 1

#### 第五问

运算符的优先级表格,参考 MDN 运算符优先级
:::details

<table>
 <tbody>
  <tr>
   <th>优先级</th>
   <th>运算类型</th>
   <th>关联性</th>
   <th>运算符</th>
  </tr>
  <tr>
   <td>20</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Grouping"><code>圆括号</code></a></td>
   <td>n/a（不相关）</td>
   <td><code>( … )</code></td>
  </tr>
  <tr>
   <td rowspan="5">19</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#%E7%82%B9%E7%AC%A6%E5%8F%B7%E8%A1%A8%E7%A4%BA%E6%B3%95"><code>成员访问</code></a></td>
   <td>从左到右</td>
   <td><code>… . …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#%E6%8B%AC%E5%8F%B7%E8%A1%A8%E7%A4%BA%E6%B3%95"><code>需计算的成员访问</code></a></td>
   <td>从左到右</td>
   <td><code>… [ … ]</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new"><code>new</code></a> (带参数列表)</td>
   <td>n/a</td>
   <td><code>new … ( … )</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions" title="JavaScript/Reference/Operators/Special_Operators/function_call">函数调用</a></td>
   <td>从左到右</td>
   <td><code>… (&nbsp;<var>…&nbsp;</var>)</code></td>
  </tr>
  <tr>
   <td><a class="new" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining" rel="nofollow">可选链（Optional chaining）</a></td>
   <td>从左到右</td>
   <td><code>?.</code></td>
  </tr>
  <tr>
   <td rowspan="1">18</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new" title="JavaScript/Reference/Operators/Special_Operators/new_Operator">new</a>&nbsp;(无参数列表)</td>
   <td>从右到左</td>
   <td><code>new …</code></td>
  </tr>
  <tr>
   <td rowspan="2">17</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Increment" title="JavaScript/Reference/Operators/Arithmetic_Operators">后置递增</a>(运算符在后)</td>
   <td colspan="1" rowspan="2">n/a<br>
    &nbsp;</td>
   <td><code>… ++</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Decrement" title="JavaScript/Reference/Operators/Arithmetic_Operators">后置递减</a>(运算符在后)</td>
   <td><code>… --</code></td>
  </tr>
  <tr>
   <td colspan="1" rowspan="10">16</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_NOT">逻辑非</a></td>
   <td colspan="1" rowspan="10">从右到左</td>
   <td><code>! …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT" title="JavaScript/Reference/Operators/Bitwise_Operators">按位非</a></td>
   <td><code>~ …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus" title="JavaScript/Reference/Operators/Arithmetic_Operators">一元加法</a></td>
   <td><code>+ …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_negation" title="JavaScript/Reference/Operators/Arithmetic_Operators">一元减法</a></td>
   <td><code>- …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Increment" title="JavaScript/Reference/Operators/Arithmetic_Operators">前置递增</a></td>
   <td><code>++ …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Decrement" title="JavaScript/Reference/Operators/Arithmetic_Operators">前置递减</a></td>
   <td><code>-- …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof" title="JavaScript/Reference/Operators/Special_Operators/typeof_Operator">typeof</a></td>
   <td><code>typeof …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void" title="JavaScript/Reference/Operators/Special_Operators/void_Operator">void</a></td>
   <td><code>void …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete" title="JavaScript/Reference/Operators/Special_Operators/delete_Operator">delete</a></td>
   <td><code>delete …</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await">await</a></td>
   <td><code>await …</code></td>
  </tr>
  <tr>
   <td>15</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Exponentiation" title="JavaScript/Reference/Operators/Arithmetic_Operators">幂</a></td>
   <td>从右到左</td>
   <td><code>…&nbsp;**&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="3">14</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Multiplication" title="JavaScript/Reference/Operators/Arithmetic_Operators">乘法</a></td>
   <td colspan="1" rowspan="3">从左到右<br>
    &nbsp;</td>
   <td><code>… *&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Division" title="JavaScript/Reference/Operators/Arithmetic_Operators">除法</a></td>
   <td><code>… /&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Remainder" title="JavaScript/Reference/Operators/Arithmetic_Operators">取模</a></td>
   <td><code>… %&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="2">13</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Addition" title="JavaScript/Reference/Operators/Arithmetic_Operators">加法</a></td>
   <td colspan="1" rowspan="2">从左到右<br>
    &nbsp;</td>
   <td><code>… +&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Subtraction" title="JavaScript/Reference/Operators/Arithmetic_Operators">减法</a></td>
   <td><code>… -&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="3">12</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators" title="JavaScript/Reference/Operators/Bitwise_Operators">按位左移</a></td>
   <td colspan="1" rowspan="3">从左到右</td>
   <td><code>… &lt;&lt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators" title="JavaScript/Reference/Operators/Bitwise_Operators">按位右移</a></td>
   <td><code>… &gt;&gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators" title="JavaScript/Reference/Operators/Bitwise_Operators">无符号右移</a></td>
   <td><code>… &gt;&gt;&gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="6">11</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Less_than_operator" title="JavaScript/Reference/Operators/Comparison_Operators">小于</a></td>
   <td colspan="1" rowspan="6">从左到右</td>
   <td><code>… &lt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Less_than__or_equal_operator" title="JavaScript/Reference/Operators/Comparison_Operators">小于等于</a></td>
   <td><code>… &lt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Greater_than_operator" title="JavaScript/Reference/Operators/Comparison_Operators">大于</a></td>
   <td><code>… &gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Greater_than_or_equal_operator" title="JavaScript/Reference/Operators/Comparison_Operators">大于等于</a></td>
   <td><code>… &gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in" title="JavaScript/Reference/Operators/Special_Operators/in_Operator">in</a></td>
   <td><code>… in&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof" title="JavaScript/Reference/Operators/Special_Operators/instanceof_Operator">instanceof</a></td>
   <td><code>… instanceof&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="4">10</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality" title="JavaScript/Reference/Operators/Comparison_Operators">等号</a></td>
   <td colspan="1" rowspan="4">从左到右<br>
    &nbsp;</td>
   <td><code>… ==&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Inequality" title="JavaScript/Reference/Operators/Comparison_Operators">非等号</a></td>
   <td><code>… !=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity" title="JavaScript/Reference/Operators/Comparison_Operators">全等号</a></td>
   <td><code>… ===&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Nonidentity" title="JavaScript/Reference/Operators/Comparison_Operators">非全等号</a></td>
   <td><code>… !==&nbsp;…</code></td>
  </tr>
  <tr>
   <td>9</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_AND" title="JavaScript/Reference/Operators/Bitwise_Operators">按位与</a></td>
   <td>从左到右</td>
   <td><code>… &amp;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>8</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_XOR" title="JavaScript/Reference/Operators/Bitwise_Operators">按位异或</a></td>
   <td>从左到右</td>
   <td><code>… ^&nbsp;…</code></td>
  </tr>
  <tr>
   <td>7</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_OR" title="JavaScript/Reference/Operators/Bitwise_Operators">按位或</a></td>
   <td>从左到右</td>
   <td><code>… |&nbsp;…</code></td>
  </tr>
  <tr>
   <td>6</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_AND" title="JavaScript/Reference/Operators/Logical_Operators">逻辑与</a></td>
   <td>从左到右</td>
   <td><code>… &amp;&amp;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>5</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_OR" title="JavaScript/Reference/Operators/Logical_Operators">逻辑或</a></td>
   <td>从左到右</td>
   <td><code>… ||&nbsp;…</code></td>
  </tr>
  <tr>
   <td>4</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator" title="JavaScript/Reference/Operators/Special_Operators/Conditional_Operator">条件运算符</a></td>
   <td>从右到左</td>
   <td><code>… ? … : …</code></td>
  </tr>
  <tr>
   <td rowspan="12">3</td>
   <td rowspan="12"><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators" title="JavaScript/Reference/Operators/Assignment_Operators">赋值</a></td>
   <td rowspan="12">从右到左</td>
   <td><code>… =&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… +=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… -=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… *=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… /=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… %=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &lt;&lt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &gt;&gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &gt;&gt;&gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &amp;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… ^=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… |=&nbsp;…</code></td>
  </tr>
  <tr>
   <td colspan="1" rowspan="2">2</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield" title="JavaScript/Reference/Operators/yield">yield</a></td>
   <td colspan="1" rowspan="2">从右到左</td>
   <td><code>yield&nbsp;…</code></td>
  </tr>
  <tr>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*" title="JavaScript/Reference/Operators/yield">yield*</a></td>
   <td><code>yield*&nbsp;…</code></td>
  </tr>
  <tr>
   <td>1</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator" title="JavaScript/Reference/Operators/Spread_operator">展开运算符</a></td>
   <td>n/a</td>
   <td><code>...</code>&nbsp;…</td>
  </tr>
  <tr>
   <td>0</td>
   <td><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_Operator" title="JavaScript/Reference/Operators/Comma_Operator">逗号</a></td>
   <td>从左到右</td>
   <td><code>… ,&nbsp;…</code></td>
  </tr>
 </tbody>
</table>

:::

```js
new Foo.getName() ===> new(Foo.getName)()
```

1. 点的优先级(18)new 无参数列表(17)优先级高
2. 函数调用(17)比 new 有参数列表优先级低
   所以这里实际上将 getName 函数作为了构造函数来执行,遂弹出 2

#### 第六问

首先 new 有参数列表(18)跟点的优先级(18)同级, 同级的话按照从左到右的执行顺序。

```js
new Foo().getName() ===> (new Foo()).getName()
```

::: tip
new 参数列表(18) => 成员访问(18) => 函数调用(17)
:::
原题中由于返回值是 this，则 Foo 函数返回实例化对象
之后调用实例化对象的`getName`函数,因为 Foo 构造函数中没有为实例化对象添加任何属性，则在当前对象的原型对象（prototype）中寻找`getName`函数

::: tip
当然这里扩展一个题外话，如果构造函数和原型链都有相同的方法,如以下的代码，那么会默认拿构造函数的公有方法而不是原型链。

:::
看下面的代码:

```js
function Foo(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}
Foo.prototype.name = "one";
Foo.prototype.getName = function () {
  return "one";
};
console.log(new Foo("two").name); // two
console.log(new Foo("two").getName()); // two
```

#### 第七问

```js
new new Foo().getName() ===> new((new Foo()).getName)()
```

:::tip 优先级
new 有参数列表(19) -> new 有参数列表(19)
:::
也就是说:先初始化 Foo 的实例对象，然后将其原型上的 getName 函数作为构造函数再次 new，所以最终结果为 3

## 答案补充

```js
function Foo() {
  this.getName = function () {
    console.log(3);
    return {
      getName, // 第六问中涉及的构造函数的返回值问题
    };
  }; //这个就是第六问涉及到的，JS构造函数公有方法和原型链方法的优先级
  getName = function () {
    console.log(1);
  };
  return this;
}
Foo.getName = function () {
  console.log(2);
};
Foo.prototype.getName = function () {
  console.log(6);
};
var getName = function () {
  console.log(4);
};
function getName() {
  console.log(5);
}
Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName(); // 1
new Foo.getName(); // 2
new Foo().getName(); // 3
// 补充
new Foo().getName().getName(); // 3 1
new new Foo().getName(); //3
```
