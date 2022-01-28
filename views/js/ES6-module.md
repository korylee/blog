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

## export 几种用法

`export`命令用于规定模块的对外接口

```js
// 使用export  {}不能使用import {name1, name2...}from '...'导入
export { variable1 as name1, variable2 as name2 };

// export type
// 使用export type才是import{name1, name2}from '...'的正确用法
export let name1;
export function func() {}
export class Class {}
// export default 方式,default,as关键字
export default Expression;
export { name1 as default }; //等价于export default name1

// 模块继承
// 这种方法很适合重构时,帮助把大文件拆分成多个小文件
export * from "";
export { name1, name2 } from "...";
export { imp1 as name1 };
```

## import 几种用法

使用 export 命令定义了模块的对外接口,其他 js 文件就可以通过`import`命令加载这个模块

```js
// export default 方式
import defaultName from "module.js";
// import type 方式
import { export1, export2 } from "modules";
import { export1 as ex1, export2 as ex2 } from "...";
import * as module from '...'

// 同时引入export default和export type
import defaultName ,{export1,export2} from '...'
import defaultName ,* as moduleName from '...'
// 引入无输出模块
import '...'
```

<!-- TODO:未完待补充 -->
