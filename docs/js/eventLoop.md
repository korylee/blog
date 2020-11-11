---
title: 事件轮询模型
date: 2020-04-03
tags:
  - JavaScript
categories:
  - frontEnd
---

## 进程与线程

Event loop 是单线程问题的一种解决机制，所以在正式开始前先来了解一下进程与线程

- 进程： 程序的一次运行,它占有一片独有的内存空间，是 CPU 资源分配的最小单位
- 线程(thread)
  - 是进程内的一个独立执行单元
  - 是程序运行的一个完整流程
  - 是 CPU 的最小调度单元

### 相关知识

- 应用程序必须运行在某个进程的某个线程上
- 一个进程中至少有一个运行的线程: 主线程, 进程启动后自动创建
- 一个进程中也可以同时运行多个进程, 我们会说程序是多线程运行的
- 一个进程内的数据可以供其中的多个进程直接共享
- 多个进程之间的数据是不能共享的
- 线程池(thread pool):保存多个线程对象的容器,实现对象的反复利用

多进程:一个应用程序可以同时启动多个实例进行

多线程:一个进程内,可以有多个线程进行

## 浏览器内核由很多模块组成

- 主线程
  - `js`引擎模块:负责 js 程序的编辑和运行
  - html,css 文档解析模块:负责页面文本的解析
  - DOM/CSS 模块;负责`dom`/`css`在内存中的相关处理
  - GUI 渲染线程:负责页面的布局和效果的绘制(内存中的对象)，页面重绘和回流。(与 JS 线程互斥，也就是所谓的 JS 阻塞页面更新)
- 分线程
  - 定时器模块:负责定时器的管理
  - `DOM`事件响应模块:负责事件的管理
  - 网络请求模块:负责 ajax 请求

### 单线程执行的`js`

#### 怎么证明

- `setTimeout()`的回调函数是主线程执行的
- 定时器回调函数只有在执行栈中的代码全部执行完后才有可能执行

#### 为什么

- 作为浏览器脚本语言,`javaScript`的主要用途是和用户互动,及操作 DOM
- 这决定了它只能是单线程,否则会带来很复杂的问题

#### `Js`引擎执行代码的基本流程

- 先执行初始化代码: 包含一些特殊的代码
  - 设置定时器
  - 绑定监听
  - 发送 ajax 请求
- 当事件发生时，管理模块会将回调函数及其数据添加到回调队列中
- 只有当初始化代码执行完后（可能要一定时间），才会遍历读取回调队列中的回调函数执行

## 浏览器端的 Event Loop

![事件循环](/img/eventLoop.jpg)

- 事件循环(event loop)
  - 从任务队列中循环取出回调函数放入执行栈中处理(一个接一个),每进行一次循环操作称为 tick。
  - 一个事件循环存在多个任务源,这确保了任务在特定任务源的执行顺序(**同一个任务源的任务才会被添加到相同的任务队列，从不同源来的则被添加到不同的任务队列**),但在每一次的循环中,浏览器会自主选择哪个源的任务优先执行,这就确保了一些性能敏感的任务的优先级,比如用户输入
- 任务(Macro task)
  - 宏任务的回调函数放到宏任务队列里，等到执行栈清空后取出并放到执行栈中执行
  - 浏览器为了能够使得 JS 内部`(macro)task`与 DOM 任务能够有序的执行,会在一个`(macro)task`执行结束后,在下一个`(macro)task`执行开始前,对页面进行渲染
  - 主要包含: `script`(整体代码),setTimeOut、setInterval、I/O、UI 交互事件、`postMessage`、`MessageChannel`、`setImmediate`（node.js 环境）
- 微任务(Micro tasks)
  - 这些任务应该在正在执行的脚本之后立即执行,比如对一些动作进行反应，或者操作异步执行避免整个新任务造成的性能浪费。微任务在其他没有 JavaScript 运行并且 task 执行完毕后执行，
  - 它的响应速度相比 setTimeOut 会更快，因为无需等渲染，也就是说，在某一个 macro task 执行完后，就会将在它执行期间产生的所有 micro task 都执行完毕(在渲染前)
  - 主要包含：` Promise``.then `、`MutationObserver`、`process.nextTick`(node.js 环境)

## Node 中的 Event Loop

![Node](/img/nodeEventLoop.png)
相比浏览器端，宏任务与微任务分别增加一个，上文已经列出来这里就不再赘述

:::warning nextTick & setImmediate
process.nextTick 注册的回调会在事件循环的**当前阶段结束前**执行。process 是内核模块，运行时是全局上下文，所以 micro task 只有一个，无论你是在哪个阶段、哪个闭包内用 nextTick 注册的回调都会被 push 到 nextTickQueue，并在事件循环当前阶段结束前执行

![nextTick](/img/nextTick.jpg)

setImmediate 只在事件循环 check 阶段执行, poll 阶段空闲时会检测是否有 immediateTask 如果有的话则转入 check 阶段执行
![setImmediate](/img/setImmediate.jpg)

它俩的名字和作用刚好相反
:::

## 贴个题

[解答在这里](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log("script end");

/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
```

这个忘了是在哪看的来着

```JS
console.log('1');
setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
}, 0)
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
}, 0)
```
