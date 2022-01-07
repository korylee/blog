---
title: 闭包
date: 2020-03-24
tags:
  - JavaScript
categories:
  - frontEnd
---

## 前言

什么是闭包，能搜出很多答案。。。疑惑间遂写一遍自己的学习记录
:::theorem 《JavaScript 高级程序设计》
闭包是指有权访问另一个函数作用域中的变量的函数
:::
:::theorem 《JavaScript 权威指南》
从技术的角度来说,所有的 Javascript 函数都是闭包：他们都是对象，他们都关联到作用域链
:::
:::theorem 《你不知道的 JavaScript》
**当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行**
:::
最能被认同的是《你不知道的 JavaScript》，虽然前面两种说法都没有错，但闭包应该是基于词法作用域书写代码产生的自然结果，是一种现象！不用为了利用闭包特意的创建，因为闭包在你的代码中随处可见。
::: warning
要理解**闭包**是离不开**作用域和作用域链**的
:::

[JavaScript 可视化工具](https://tylermcginnis.com/javascript-visualizer/?code=var%20name%20%3D%20%27Tyler%27%0Avar%20handle%20%3D%20%27%40tylermcginnis%27%0A%0Afunction%20getURL%20%28handle%29%20%7B%0A%20%20var%20twitterURL%20%3D%20%27https%3A%2F%2Ftwitter.com%2F%27%0A%0A%20%20return%20twitterURL%20%2B%20handle%0A%7D%0A%0AgetURL%28handle%29)

## 作用域和作用域链

作用域: 我们将"作用域"定义为一套规则，这条规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找

### 函数的`[[scope]]`函数

JavaScript 中每个函数都表示为一个函数对象(函数实例)，既然是对象，就有相关的属性和方法。除了正常的属性，函数对象具有仅供 JavaScript 引擎内部使用，当不能通过代码访问的一系列内部属性。其中一个就是`[[scope]]`属性

### Scope Chain(作用域链)

在作用域链中，外部函数的活动对象始，始终处于第二位，外部函数的外部函数的活动对象处于第三位，直至...作为作用域链终点的全局执行环境

### 作用域与内部`[[scope]]`属性

```js
function add(num1, num2) {
  var sum = num1 + num2;
  return sum;
}
```

add 函数定义后,其作用域就被创建了。函数所在的**全局作用域的全局对象**被放置到 add 包含的作用域链（`[[scope]]`属性）中。
![作用域](/img/scope.png)
当调用 add 函数时,会为函数创建一个执行环境（上下文），执行上下文对象有自己的作用域链, 然后**通过复制函数的`[[scope]]`属性**中的对象构建起执行环境的作用域链，函数定义时的作用域链对象`[[scope]]`是固定的，而执行上下文的作用域链会根据不同的运行时环境变化。

## 闭包

:::theorem 闭包
闭包是由函数以及声明该函数的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。

闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。这显然类似于面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。

因此，通常你使用只有一个方法的对象的地方，都可以使用闭包。
:::right
来自[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
:::

### 没有被嵌套的函数（Non-nested functions）

```js
"use strict";
var foo = 1;
var bar = 2;

function myFunc() {
  //-- define local-to-function variables
  var a = 1;
  var b = 2;
  var foo = 3;
  console.log("inside myFunc");
}
console.log("outside");
//-- and then, call it:
myFunc();
```

当 myFunc 被定义的时候，myFunc 的标识符（identifier）就被加到了当前的作用域对象中（在这里就是全局对象），并且这个标识符所引用的是一个函数对象（function object）。函数对象中所包含的是函数的源代码以及其他的属性。其中一个我们所关心的属性就是内部属性`[[scope]]`。`[[scope]]`所指向的就是当前的作用域对象。也就是指的就是函数的标识符被创建的时候，我们所能够直接访问的那个作用域对象（在这里就是全局对象）。
![调用后](/img/03/js_closure_3.png)

只要这些作用域对象依然被引用，它们就不会被垃圾回收器（garbage collector）销毁，我们就一直能访问它们。当然，当引用一个作用域对象的最后一个引用被解除的时候，并不代表垃圾回收器会立刻回收它，只是它现在可以被回收了。<br/>
所以，当 `myFunc()`返回的时候，再也没有人引用 `myFunc() scope` 了。当垃圾回收结束后，对象之间的关系变成回了调用前的关系。

![调用前](/img/03/js_closure_2.png)

### 嵌套的函数

你已经知道的是，函数对象总是有一个 `[[scope]]`属性，保存着该函数被定义的时候所能够直接访问的作用域对象。所以，在定义嵌套的函数的时候，这个嵌套函数的`[[scope]]`就会引用外围函数（outer function）的当前作用域对象。

如果我们将这个嵌套函数返回，并被另一个地方的标识符引用的话，那么这个嵌套函数以及`[[scope]]`所引用的作用域对象就不会被垃圾回收所销毁

```js
"use strict";
function createCounter(initial) {
  var counter = initial;
  function increment(value) {
    counter += value;
  }
  function get() {
    return counter;
  }
  return {
    increment,
    get,
  };
}
var myCounter = createCounter(100);
console.log(myCounter.get());
myCounter.increment(5);
console.log(myCounter.get());
```

![关系图](/img/03/js_closure_4.png)

`increment`和`get`函数都存在指向`createCounter(100) scope`的引用。如果`createCounter(100)`没有任何价值，那么`createCounter(100) scope`不再被引用,于是就可以被垃圾回收器回收。但因为`createCounter(100)`实际上是有返回的,并且返回值被储存在了`myCounter`中,所以对象之间的引用关系变成了如下图

![closure_5](/img/03/js_closure_5.png)

所以，`myCounter(100)`虽然返回了，但它的作用域对象依然存在，可以**且仅只能被**嵌套的函数（`increment`和`get`）所访问。

刚才说过，函数被调用的时候会创建一个新的作用域对象，并且该作用域对象的父作用域对象会是当前可以直接访问的作用域对象。

![closure_6](/img/03/js_closure_6_inc.png)

正如你所见，`increment(5)`的调用创建了一个新的作用域对象，并且其中含有传入的参数`value`。当这个函数尝试访问`value`的时候，JavaScript 立即就能在当前的作用域对象找到它。然而，这个函数试图访问`counter`的时候，JavaScript 无法在当前的作用域对象找到它，于是就会在其父作用域`createCounter(100) scope`中查找
:::tip note
除了`get`和`increment`两个方法，没有其他的地方可以访问到`value`这个变量了。**这就是用闭包实现“私有变量”的方法**
:::
需要注意的是作用域链是不会被复制的。每次函数调用只会往作用域链下面新增一个作用域对象。所以，如果在函数调用过程当中对作用域链中的任何一个作用域对象的变量进行修改的话，那么同时作用域链中也拥有该作用域对象的函数对象也是能够访问到这个变化后的变量的。

```js
"use strict";
var items = document.getElementsByClassName("myClass"),
  i;
for (i = 0; i < items.length; i++) {
  items[i].addEventListener("click", function () {
    this.innerHTML = i;
  });
}
```

在上面的循环中创建了多个函数对象，所有函数对象的`[[scope]]`都保存着对当前作用域对象的引用，而变量`i`正好就在当前作用域链中，所以循环每次对 `i` 的修改，对于每个函数对象都是看得到的。

### 闭包的作用

1. 使用函数内部的变量在执行函数之后,仍然存活在内存中(延长了局部变量的生命周期)
2. 让函数外部可以操作(读写)到函数内部的变量(变量/函数)

#### 一个很经典的例子就是 for 循环中使用定时器延迟打印的问题:

```js
for (var i = 1; i <= 10; i++) {
  setTimeOut(function () {
    console.log(i);
  }, 1000);
}
```

究其原因: `i` 是声明在全局作用域中的，定时器中的匿名函数函数也是执行在全局作用域中

```js
for (var i = 1; i <= 10; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 1000);
  })(i);
}
```

#### **将函数作为另一个函数的返回值**

```js
function foo() {
  var a = 20,
    b = 30,
    c = 30;
  function bar() {
    debugger;
    return a + b;
  }
  return bar;
}
var bar = foo();
bar();
```

正常来说，当 foo 函数执行完毕之后，其作用域是会被立刻销毁的，然后垃圾回收器会释放那段内存空间。而闭包却很神奇的将 foo 的作用域存货了下来，**bar 依然持有该作用域的引用，这个应用就是闭包**

:::tip
某个函数在定义时的词法作用域之外的地方被调用，闭包可以使用该函数定义时的词法作用域
:::

解释:

![栗子](/img/example.png)
如上图，scope 是由 Local+closure+Global 组成,scope 也就是我们所说的**当前执行上下文的作用域链**(查找作用域链是通过作用域链一层一层网上找的)

- Local 表示当前正在执行的活动对，包含了 `this`。活动对象还包含 `this` 指向，`this` 可以访问对象属性
- Closure 是指闭包函数中引用外部变量的变量，谷歌浏览器以外部函数名称（这里的 `foo()`）作为闭包名称
- Global 是全局对象

### 总结

- 闭包就是同时含有对函数对象以及作用域对象引用的对象实际上，所有的 JavaScript 对象都是闭包
- 闭包是什么时候被创建的？因为所有的 JavaScript 都是闭包，所以，当你定义一个函数的时候，你就定义了一个闭包
- 闭包是什么时候被销毁的？当他不被任何其他对象引用, 成为垃圾对象的时候

## 闭包的应用

### 定义`js`模块

- 具有特定功能的`js`文件

- 将所有的数据和功能封装在一个函数内部(私有的)

- 只向外暴露一个包含 n 个方法的对象或函数

- 模块的使用者,只需要通过模块暴露的对象调用方法

  **最优应用**

  ```js
  (function (window) {
    //防止后面向外暴露方法的window被压缩
    //私有数据
    var msg = "My atguigu";
    //操作数据的函数
    function doSomething() {
      console.log("doSomething()" + msg.toUpperCase());
    }
    window.myModule = {
      // 向外暴露对象(给外部使用的方法)
      doSomething: doSomething,
    };
  })();
  ```

### 模拟私有变量

```js
function User() {
  var study = 0;
  this.getStudy = function () {
    return study;
  };
  this.studying = function () {
    study++;
  };
}
var student = new User();
student.studying();
assert(student.study === undefined, "The private data is inaccessible to us");
assert(student.getStudy === 1, "We're able to access the internal study count");
```

#### 为什么闭包可以模拟私有变量

- 函数有私有作用域,外部不能访问函数内部的变量
- 闭包保存了外部函数的活动对象, 因为私有作用域的存在,只能通过闭包这个入口去访问

#### ES6 私有变量的实现

> 详情见 [Class 的基本用法](https://es6.ruanyifeng.com/#docs/class)

## 闭包的缺点及解决

1. 缺点
   1. 函数执行完后，函数内的局部变量没有释放，占用内存时间会变长
   2. 容易造成内存泄漏
2. 解决
   1. 能不用就不用闭包
   2. 及时释放`f =null`，让内部函数成为垃圾对象-->回收闭包

## 内存溢出与内存泄漏

1. 内存溢出
   - 一种程序运行出现的错误
   - 当程序运行需要的内存超过了剩余的内存时,就抛出内存溢出的错误
2. 内存泄漏
   - 占用的内存没有及时释放
   - 内存泄漏积累多了就容易导致内存溢出
   - 常见的内存泄漏
     - 意外的全局变量
     - 没有及时清理的计时器或回调函数
     - 闭包

## 两种垃圾回收策略

找出那些不再继续使用的变量，然后释放其内存。垃圾回收器会按照固定的时间间隔，周期性的执行该垃圾回收操作。

共有两种策略：

- **标记清除法**
- **引用计数法**

### 标记清除法

垃圾回收器会在运行的时候，会给存储在内存中的所有变量都加上标记，然后它会去掉环境中变量以及被环境中的变量引用的变量的标记。剩下的就视为即将要删除的变量，原因是在环境中无法访问到这些变量了。最后垃圾回收器完成内存清除操作。

**它的实现原理就是通过判断一个变量是否在执行环境中被引用，来进行标记删除。**

### 引用计数法

引用计数的垃圾收集策略不常用，引用计数的最基本含义就是跟踪记录每个值被引用的次数。

当声明变量并将一个引用类型的值赋值给该变量时，则这个值的引用次数加 1，同一值被赋予另一个变量，该值的引用计数加 1 。当引用该值的变量被另一个值所取代，则引用计数减 1，当计数为 0 的时候，说明无法在访问这个值了，所有系统将会收回该值所占用的内存空间。

**存在的缺陷:** 两个对象的相互循环引用，在函数执行完成的时候，两个对象相互的引用计数并未归 0 ，而是依然占据内存，无法回收，当该函数执行多次时，内存占用就会变多，导致大量的内存得不到回收。
:::tip
最常见的就是在 IE BOM 和 DOM 中，使用的对象并不是 js 对象，所以垃圾回收是基于计数策略的。但是在 IE9 已经将 BOM 和 DOM 真正的转化为了 js 对象，所以循环引用的问题得到解决。
:::

## 如何管理内存

虽然说是 `js` 的内存都是自动管理的，但是对于 `js` 还是存在一些问题的，最主要的一个问题就是**分配给 Web 浏览器的可用内存数量通常比分配给桌面应用程序的少**。

为了能够让页面获得最好的性能，必须确保 js 变量占用最少的内存，最好的方式就是将不用的变量引用释放掉，也叫做**解除引用**。

- 对于局部变量来说，函数执行完成离开环境变量，变量将自动解除。
- 对于全局变量我们需要进行手动解除。（注意：解除引用并不意味被收回，而是将变量真正的脱离执行环境，下一次垃圾回收将其收回）

:::tip
补充：因为通过上边的垃圾回收机制的标记清除法的原理得知，只有与环境变量失去引用的变量才会被标记回收，所用上述例子通过将对象的引用设置为 null ，此变量也就失去了引用，等待被垃圾回收器回收。
:::
