---
title: 执行上下文
date: 2020-04-03
tags:
  - JavaScript
  - 学习笔记
categories:
  - frontEnd
---

## 执行上下文

1. 全局执行上下文

   - 在执行全局代码前将 window 确定为全局执行上下文
   - 对全局数据进行预处理
     - `var`定义的全局变量==>`undefined`,添加为 window 的属性
     - function 声明的全局函数==>赋值,添加为 window 方法
     - this ==>赋值(window)

2. 函数执行上下文
   - 在**调用函数**前,准备执行函数体前,创建对应的<span style="border-bottom:2px solid blue;">函数执行上下文对象</span>(虚拟,存在于栈中)
   - 对局部数据进行预处理
     - 形参变量-->赋值(实参)-->添加为执行函数上下文的属性
     - arguments(伪数组) ==>赋值（实参列表）,添加为执行函数上下文的属性
     - `var`定义的局部变量==>`undefined`，添加为执行函数上下文的属性
     - `function`声明的函数==>赋值(fun), 添加为执行函数上下文的方法
     - this==>赋值(调用函数的对象)
   - 开始执行代码
3. Eval 函数执行上下文: 执行在`eval`函数内部的代码也会有属于自己的执行上下文。

```js
var c = 1;
function c(c) {
  //函数提升优先于变量提升
  console.log(c);
  var c = 3;
}
c(2); //报错
```

## 执行上下文栈

1. 在全局代码执行前,`js`引擎就会创建一个栈来存储管理所有的执行上下文对象
2. 在全局执行上下文(window)确定后,将其添加到栈中(压栈)
3. 在函数执行上下文创建后,将其添加入栈中(压栈)
4. 在函数执行完后,将栈顶的对象移除(出栈)
5. 当所有的代码执行完后,栈中只剩 window

## 执行上下文的创建

> ES3 --> ES6 作用域 --> 词法环境 作用域链 --> outer 引用 VO|AO --> 环境记录

- 创建阶段(The Creation Phase)执行环境的状态组件
  1. 创建词法环境(`LexicalEnvironment`)
  2. 创建变量环境(`VariableEnvironment`)
  3. ThisBanding: 确定当前环境 this 的指向

因此执行上下文在概念上应该是这样的

```ts
ExecutionContext = {
  /*变量对象加上父级上下文的变量对象*/
  LexicalEnvironment = <ref. to LexicalEnvironment in memory>,
  /*函数的参数,内部的方法变量声明*/
  VariableEnvironment = <ref. to VariableEnvironment in memory>,
  ThisBinding = <this value>
}
```

## 词法环境(LexicalEnvironment)

词法环境是 ECMA 中的一个规范类型 --基于代码词汇嵌套结构来记录标识符 和具体变量或函数的关联。简单来说，词法环境就是建立了标识符--变量的映射表。这里的标识符指的是变量名称或函数名，而变量则是实际变量原始值或对象、函数的引用地址。

词法环境中由两个个部分组成

- 环境记录`EnvironmentRecord`: 存放变量和函数声明的地方
- 外层调用`outer`: 提供了访问父词法环境的引用,可能为 null

### 词法环境的类型

- 全局环境(`GlobalEnvironment`): 在 JavaScript 代码运行开始宿主（浏览器，node 等）会事先初始化全局环境，在全局环境的`EnvironmentRecord`中会绑定内置对象(Infinity 等)或全局函数(eval、parseInt 等)，其他声明的全局变量或函数也会储存在全局词法变量中。全局环境的`outer`引用为`null`

:::tip
全局对象包含所有内置对象，如 Math、Object、Array 等构造函数，以及 Infinity 等全局变量。全局函数则包含了 eval、parseInt 等函数。
:::

- 模块环境(`ModuleEnvironment`): 在模块环境中可以读取到`export`、`module`等变量, 这些变量都记录在模块环境的 ER 中。模块环境的`outer`引用指向全局环境。
- 函数环境(`FunctionEnvironment`): 每一次调用函数时都会产生函数环境, 在函数环境中会涉及`this`的绑定或者`super`的调用.在 ER 中也会记录该函数的`length`和`arguments`属性。函数环境的`outer`引用指向调用函数的父环境。在函数体内声明的变量或声明记录在函数环境中

### 环境记录 ER

代码中声明的变量和函数都会存放在`EnvironmentRecord`中等待执行时访问。ER 也有两个不同类型，分别是`declarative`和`object`。

- `declarative`是较常见的类型，通常函数声明、变量声明，try...catch 等都会生成这种类型的 ER。此类型对应其范围内包含的声明定义的标识符集。
- `object`类型可以由程序级别的（program）对象，声明，`with`语句（使用场景很少）等触发，与称为其绑定对象的对象相关联，此类型对应其绑定对象的属性名称的字符串标识符名称集

在函数体中遇到诸如`var const let class module import`等函数声明，那么环境记录就是`declarative`类型的

:::warning 注意
全局上下文的`ER`有点特殊,因为它是`object ER`和`declarative ER`的混合体。在`object ER`中存放的是全局对象函数、`function`函数声明、`async`、`generator`、`var`关键词变量。在`declarative ER`则存放其他方式声明的变量,如`let const class`等。由于标准中将`object`类型的 ER 视作基准 ER, 因此这里我们仍可以将全局 ER 的类型视作`object`

```js
GlobalExecutionContext = {
  this: <global object>
  LexicalEnvironment: {
    EnvironmentRecord: {
      type: 'object',  // 混合 object + declarative
      NaN,
      parseInt,
      Object,
      myFunc,
      a,
      b,
      ...
    },
    outer: null
  }
}
```

:::

`LexicalEnvironment`只存储声明和`let/const`声明的变量，与下文的`VariableEnvironment`有所区别。

```js
let a = 10;
var c
function foo() {
  let b = 20;
  console.log(a, b);
}
foo()

// 他们的词法作用域伪码如下
GlobalEnvironment: {
  ThisBinding: <global object>,
  LexicalEnvironment: {
    EnvironmentRecord: {
      type: 'object',
      a: <uninitialized>,
      foo: <func>
    },
    outer: <null>,
  },
  VariableEnvironment: {
    EnvironmentRecord: {
      // 对象环境记录
      type: "object",
      c: undefined
    }
    outer: <null>
  }
}
FunctionEnvironment: {
  this: <global object>, // 严格模式为undefined
  LexicalEnvironment: {
    EnvironmentRecord: {
      type: 'declarative',
      arguments: {length: 0},
      b: <uninitialized>
    },
    outer: <GlobalEnvironment>
  }
}
```

#### 函数环境记录

当调用一个函数时,会生成函数执行上下文,这个函数执行上下文的词法环境的环境记录就是函数类型的。

```
// 树状图表示
FunctionContext
    |LexicalEnvironment
        |EnvironmentRecord  //--> 函数类型
```

为什么要强调这个类型呢？因为 ECMA 针对函数式环境记录会额外增加一些内部属性：
| 内部属性 | value | 说明 | 补充 |
| ----------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `ThisValue` | `Any` | 函数调用`this`时引用的地址,我们常说的函数`this`绑定就是给这个内部属性赋值 | |
| `[[ThisBindingStatus]]` | `lexical/initialized/uninitialized` | 若等于`lexical`,则为箭头函数,意味着`this`是空的 | 强行`new`箭头函数会报`TypeError`错误 |
| `FunctionObject` | `Object` | 在这个对象中有两个属性`[[call]]`和`[[Construct]]`, 他们都是函数, 如何赋值取决于如何调用函数 | 正常函数调用赋值`[[call]]`,而通过`new`或`super`调用函数赋值`[[Construct]]` |
| `[[HomeObject]]` | `Object/ undefined` | 如果该函数(非箭头函数)有`super`属性(子类),则`[[HomeObject]]`指向子类构造函数 | `extend` |
| `NewTarget` | `Object/ undefined` | 如果是通过`[[Construct]]`方式调用的函数,那么`[[NewTarget]]`非空 | 在函数中可以通过`new.target`读取到这个内部属性,以此来判断函数是否通过`new`来调用的 |

此外,函数记录中还存在一个 arguments 对象,记录了函数的入参信息

### 小结

```js
词法环境分类 = 布局 / 函数 / 模块;
词法环境 = ER + outer;
ER分类 = declarative(DER) + object(OER);
全局ER = DER + OER;
```

## ThisBinding 四条准则

- 构造函数绑定
  - 当一个函数被当作构造函数使用时`new foo()`
- 显式绑定
  - 关键词`call`, `apply`, `bind`
- 隐式绑定
  - 关键词`.`
  - 隐式绑定发生在对象**方法调用**的时候,即通过点标识符调用对象
- 默认绑定
- 非严格模式下, this 指向全局对象 -- `window` | `global`, 代码输出为全局对象
- 严格模式下,此时的 this 绑定为`undefined`

:::tip 优先级

`构造函数` ==> `显示绑定` ==> `隐式绑定` ==> `默认绑定`

:::

### 箭头函数

箭头函数的 this 取值，规则非常简单，因为在箭头函数中，可以看做一个普通变量

> An arrow function does note has its own this. the this value of the enclose lexical scope is used;
> arrow function follow the normal variable lookup rules

箭头函数没有自己的 this 值, 箭头函数中所使用的 this 都是来自函数作用域链, 它的取值遵循普通变量一样的规则，在函数作用域链中一层一层往上找

## VariableEnvironment 变量环境

在 ES6 前,声明变量都是通过`var`关键词声明的,在 ES6 中则提倡使用`let`和`const`来声明变量,为了兼容`var`的写法,于是使用变量环境来存储`var`声明的变量

> `var`会让变量提升,而通过`let/const`声明的变量却不会。为了区分,就用不同的词法环境去区分

有了这些概念， 一个完整的执行上下文应该是什么样的呢? 来看个 🌰：

```js
let a = 10;
const b = 20;
var sum;
function add(e, f) {
  var d = 40;
  return d + e + f;
}
let utils = { add };
sum = utils.add(a, b);
```

完整的词法作用域如下所示:

```js
GlobalExecutionContext ={
  ThisBinding: <global object>,
  LexicalEnvironment: {
    EnvironmentRecord: {
      type : 'object',
      add: <function>,
      a: <uninitialized>,
      b: <uninitialized>,
      utils: <uninitialized>
    },
    outer: null,
  },
  VariableEnvironment: {
    EnvironmentRecord :{
      type: 'object',
      sum: undefined
    },
    outer: null,
  }
},
  // 当执行到函数时才会创建函数执行上下文
FunctionExecutionContext = {
  ThisBinding: <utils>,
  LexicalEnvironment: {
    EnvironmentRecord: {
      type: 'declarative',
      arguments: {0:10,1:20,length:2},
      [[ThisValue]]: <utils>,
      [[NewTarget]]: undefined,
      ...
    },
    outer: <GlobalLexicalEnvironment>,
  },
  VariableEnvironmentRecord: {
    EnvironmentRecord: {
      type: 'declarative',
      d:undefined
    },
    outer: <GlobalLexicalEnvironment>,
  }
}
```

执行上下文创建后,进入执行环境,变量在执行过程中赋值,读取,再赋值等。直至程序运行结束，能注意到的是：在执行上下文创建时，变量`a, b`都是`<uninitialized>`的,而 sum 则被初始化为`undefined`。这就是`var`声明的变量存在变量提升，而访问`let/const`定义的变量就会报引用错误的原因。

## `let`、`const`与`var`

- 存放位置:
  - 在上一节,我们知道了`let/const`声明的变量是归属于`LexicalEnvironment`, 而`var`声明的变量归属于`VariableEnvironment`。
- 初始化(词法阶段)：
  - `let/const`在初始化时会被置为`<uninitialized>` 标志位，在没有执行到`let xxx`或`let xxx = ???`(赋值行)的具体执行,提前读取变量会报`ReferenceError`的错误。（这个特性又叫**暂时性死区**）`var`在初始化时先被赋值为`undefined`，即使没有执行到赋值行，仍可以读取`var`变量(undefined)。
- 块环境记录（块作用域）
  - 在[ECMA 链接](http://www.ecma-international.org/ecma-262/10.0/index.html#sec-blockdeclarationinstantiation)中提到，当遇到`Block`或`CaseBlock`时,将会新建一个环境记录, 在块中声明的`let/const`变量、函数、类都存放这个新的环境记录中，这些变量与块**强绑定**，在块外界则无法读取这些声明的变量。这个特性就是我们熟悉的块作用域。

## 作用域和执行上下文

JavaScript 既是编译语言，又是解释性语言。JavaScript 实际上在执行代码前微秒就编译了代码。称为**JIT（即时编译）**
JavaScript 的执行分为：编译和执行两个阶段，这两个阶段所做的事并不一样

- 编译阶段
  - 分词/词法分析
  - 解析/语法分析
  - 预编译(代码生成、解释阶段，作用域规则确定)
- 执行阶段
  - 创建执行上下文
  - 执行函数代码
  - 垃圾回收

作用域与执行上下文的区别与联系

1. 区别 1
   1. JavaScript 解释阶段会确定作用域规则，所以除全局作用域之外,每个函数都会创建自己的作用域,作用域在函数定义之后就已经确定,而不是在函数调用时
   2. 全局执行上下文环境是在全局执行上下文确定之后,js 代码马上执行之前创建
   3. 函数执行上下文环境是在调用函数时,函数体代码执行之后创建
2. 区别 2
   1. 作用域是静态的,只要函数定义好了就一直存在,且不会再变化
   2. 上下文环境在调用函数时创建, 随时可能改变，并且在函数调用结束后上下文环境就会被自动释放
3. 联系
   1. 上下文环境(对象)是从属于所在的作用域
   2. 全局上下文环境==>全局作用域
   3. 函数执行上下文环境==>对应的函数使用域
4. 总结
   1. 一个作用域可能包含若干个上下文环境。可能从来没有过上下文环境（函数从来没有被调用过）；有可能调用过，现在函数被调用完毕后，上下文环境被销毁了；有可能存在一个或者多个(闭包)。同一作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值

```js
var x = 10;
function fn() {
  console.log(x);
}
function show(f) {
  var x = 20;
  f();
}
show(fn); //10
```

## 参考

- [W3C](https://www.w3.org/html/ig/zh/wiki/ES5/%E5%8F%AF%E6%89%A7%E8%A1%8C%E4%BB%A3%E7%A0%81%E4%B8%8E%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83#.E8.AF.8D.E6.B3.95.E7.8E.AF.E5.A2.83)
- [彻底理解 JS 执行上下文](https://juejin.im/post/5ea6f7556fb9a0436b221048)
- [JS 夯实之执行上下文与词法环境](https://juejin.im/post/5eaabf895188256d7f12f412)
