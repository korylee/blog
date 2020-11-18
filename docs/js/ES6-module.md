---
title: ES6模块
date: 2020-11-18
tags:
  - JavaScript
categories:
  - frontEnd
---

## 编译时静态检查

在 ES6 之前,社区制定了一些模块加载方案,最重要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，是的编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西

```js
// 由于不是编译时检查，而commonJS就不会
// 所以使用import和export都会放在最外层，不允许放在arr.forEach()
let modulePath = './test'
import test from modulePath
// 正确
import test from './test'
```

## ES6 module 和 commonJS 不同

1. ES6 module 编译时输出接口，commonJS 运行时加载
2. ES6 module 输出应用，commonJS 输出拷贝
3. 循环引用处理不同。ES6 module 生成指向，内容自己保证；commonJS 只输出已执行部分（说到底还是输出拷贝）

> 由于动态加载非常实用，故 ts39 引用了[import()](https://github.com/tc39/proposal-dynamic-import),动态加载模块
