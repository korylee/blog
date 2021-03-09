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

:::tip 相关知识

- 应用程序必须运行在某个进程的某个线程上
- 一个进程中至少有一个运行的线程: 主线程, 进程启动后自动创建
- 一个进程中也可以同时运行多个线程, 多个线程可协调工作(共享内存空间)
- 进程之间相互独立, 但一个进程内的数据可以供其中的多个线程直接共享
- 多个进程之间的数据是不能共享的
- 线程上下文切换比进程上下文切换要快的多
- 线程池(thread pool): 保存多个线程对象的容器,实现对象的反复利用

**多进程:一个应用程序可以同时启动多个实例进行<br/>
多线程:一个进程内,可以有多个线程进行**

:::

### 浏览器多进程

- `Browser(只有一个)`: 浏览器的主进程(负责协调、主控)
  - 负责浏览器的界面显示（壳的显示），比如网页之外的前进，后退界面、下载管理等
  - 负责各个页面的管理，创建和销毁其他进程
  - 将 Render 进程得到的内存中的 Bitmap，绘制到用户界面上
  - 网络资源的管理，下载等
- `Render进程(多个, 每个tab是一个进程)`。主要作用为页面渲染，脚本执行，事件处理等（相当于每一个 tab 就是一个应用程序,包括 js 执行、渲染等）。该进程有多个线程，著名的有 js 线程以及渲染线程

### 单进程（单个页面 tab）的多线程

最主要的有`Js引擎线程、渲染线程`

#### 1. JS 引擎线程

- 也称为 JS 内核，负责处理 javascript 脚本程序。（例如 V8 引擎）
- JS 引擎线程负责解析 Javascript 脚本，运行代码
- JS 引擎一直等待着任务队列中任务的到来，然后加以处理，一个 Tab 页(renderer 进程)中无论任何时候都有一个 JS 线程在运行 JS 程序
- 注意: GUI 线程和 JS 引擎线程是互斥的，如果 JS 执行的时间过长,这样就会造成页面的渲染不连贯，导致页面渲染加载堵塞

::: details WebWorker 会造成 js 多线程吗?
Worker 接口会生成**真正的操作系统级别的线程**。所以这里的 webworker 不是一个新的 js 引擎线程。而是操作系统级别的线程。现成的执行不会影响到原有的 js 引擎的执行，也不会影响到浏览器渲染 Render 进程

所以 WebWorker 有如下限制：

1. 不能访问 DOM 和 BOM 对象的，Location 和 navigation 的只读访问，并且 navigation 封装成了 WorkerNavigation 对象，更改部分属性。无法读取本地文件系统
2. 子线程和父级线程的通讯是通过值拷贝,子线程对通信内容的修改,不会影响到主线程.在通信过程中值过大也会影响到性能(解决这个问题可以用 transferable objects)
3. 并非真的多线程, 多线程是因为浏览器的功能
4. 兼容性不高
5. 因为线程是通过 importScripts 引入外部的 js,并且是直接执行,其实是不安全的,很容易被外部注入一些恶意代码
6. 条数限制，大多数浏览器能创建 webworker 线程的条数是有限制的,虽然可以手动去扩展,但是如果不设置的话,基本上都在 20 条以内,每条线程大概 5M 左右,需要手动关掉一些不用的线程才可以创建新的线程
7. js 存在真的线程的东西,比如 SharedArrayBuffer

:::

:::details js 代码的执行(Event Loop)与其他线程之间的合作
Javascript 引擎并不是独立运行的, 它运行在宿主环境中,对多数开发者来说通常就是 Web 浏览器。提供了一种机制来处理程序中多个块（这里的块可以理解为回调函数）的执行，且执行每块时调用 Javascript 引擎，这种机制被称为事件循环。换句话说，`Javascript引擎本身并没有时间的概念,只是一个按需执行Javascript任意代码片段的环境。“事件”（Javascript代码执行）调度总是由包含它的环境进行`。这个调度室时间触发线程调度的

:::

#### 2. 渲染线程(渲染引擎)

- 负责渲染浏览器界面，解析 HTML，CSS， 构建 DOM 树和 RenderObject 树，布局和绘制等
- 当界面需要重绘（repaint）或由于某种操作引发回流（reflow）时，该线程就会执行
- 注意，GUI 渲染线程与 JS 引擎是互斥的，当 JS 线程会被挂起（相当于被冻结了），GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。

#### 3. 其他线程

1. 事件触发线程
   1. 归属于浏览器而不是 JS 引擎，用来控制事件循环
   2. 当 JS 引擎执行代码块如 setTimeout 时（也可来自浏览器内核的其他线程，如鼠标点击、ajax 异步请求等）,会将对应的任务添加到事件线程中
   3. 当对应的事件符合触发条件被触发时,该线程会把事件添加到待处理队列的队尾, 等待 js 引擎的处理
   4. 注意,由于 js 单线程的关系，所以这些待处理队列中的时间都得排队等待 js 引擎处理（当 js 引擎空闲时才会去执行）
2. 定时触发线程
   1. 传说中的 setInterval 与 setTimeout 所在线程
   2. 浏览器定时计数器并不是 Javascript 计数的，（因为 javascript 是单线程的，如果处于阻塞状态就会影响计时的准确）
   3. 注意：W3C 在 HTML 标准中规定，要求 setTimeout 低于 4ms 的时间间隔为 4ms
3. 异步 http 请求线程
   1. 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程要求
   2. 将检测到状态变更时，如果设置有回调函数，异步线程就会变更事件，将这个回调在放入事件队列中。再由 javascript 引擎执行。

## 引擎和 runtime

在具体执行层,是依赖`js引擎`和`宿主环境runtime`来实现 event loop 机制

- `引擎`: 解释并编译代码,并让它变成能交给机器运行的代码
- `runtime`: 宿主环境,提供异步处理模块(如浏览器内核(也叫渲染引擎))

:::warning 注意
`通常是宿主环境提供事件循环机制`来处理多个块的执行, 执行时调用 Javascript 引擎。换句话说，Js 引擎本身没有时间概念,只是一个按需执行 js 任意代码的环境。“事件”（Javascript 代码执行）调度总是由包含它的环境执行。
:::

## 事件循环

事件循环机制是由宿主决定，Web 宿主规范标准定义在[HTML Standard]([opens new window](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops))中，NodeJS 宿主规范标准定义在[libuv](http://docs.libuv.org/en/v1.x/design.html#the-i-o-loop)

![事件循环](/img/eventLoop.jpg)

- 从任务队列中循环取出回调函数放入执行栈中处理(一个接一个)，每进行一次循环操作称为 tick。
- 一个事件循环存在多个任务源,这确保了任务在特定任务源的执行顺序(**同一个任务源的任务才会被添加到相同的任务队列，从不同源来的则被添加到不同的任务队列**),但在每一次的循环中,浏览器会自主选择哪个源的任务优先执行,这就确保了一些性能敏感的任务的优先级,比如用户输入

简单理解为:

1. 所以同步队列都在主线程上执行,形成一个`执行栈`。
2. 主线程之外，还存在一个"`事件队列`"。只要异步操作执行完毕,就到事件队列中排队
3. 一旦执行栈中的所有同步任务执行完毕,系统就会按次序读取事件队列中的异步任务,于是被读取的异步任务结束等待状态,进入执行栈,开始执行。
4. 主线程不断重复上面的第三步

使用伪代码来说明事件队列概念

```ts
//event loop队列数组, 先进先出
var eventLoop = [],
  event;
// "永远"执行事件循环
while (true) {
  // 一次tick
  if (eventLoop.length > 0) {
    event = eventLoop.shift();
    event(); // 执行, 这里面可能产生新的event放入eventLoop中
  }
}
```

while 循环实现持续运转的循环,循环的每一轮称为 tick.对每个 tick 而言,如果在队列中有等待事件,那么就会在队列中摘下一个事件并执行。这些事件就是你的回调函数。
::: note
以上说过是宿主环境提供事件循环,但 ES6 本质上改变了在那里管理事件循环由于 ES6 Promise 的引入，这技术要求对事件循环队列的调度运行能够直接精确控制，所以事件循环后续会纳入 Javascript 引擎的势力范围，而不是只由宿主环境来管理
:::

## 任务队列

这是在 ES6 中引入的概念，它加载事件循环之上。这个概念带来最大的影响可能是 Promise 的异步特性

对于`任务队列`最好的理解方式就是，它是挂在`事件循环队列`的每一个 tick 之后的一个队列。在事件循环的每一个 tick 中,可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中,而会在当前 tick 的任务队列末尾添加一个任务。

- (Macrotask)

  - 宏任务的回调函数放到宏任务队列里，等到执行栈清空后取出并放到执行栈中执行
  - 浏览器为了能够使得 JS 内部`macrotask`与 DOM 任务能够有序的执行,会在一个`macrotask`执行结束后,在下一个`macrotask`执行开始前,对页面进行渲染
  - 主要包含: `script`(整体代码),setTimeOut、setInterval、I/O、UI 交互事件、`postMessage`、`MessageChannel`、`setImmediate`（node.js 环境）

- 微任务(Microtasks)
  - 这些任务应该在正在执行的脚本之后立即执行,比如对一些动作进行反应，或者操作异步执行避免整个新任务造成的性能浪费。微任务在其他没有 JavaScript 运行并且 task 执行完毕后执行，
  - 它的响应速度相比 setTimeOut 会更快，因为无需等渲染，也就是说，在某一个 `macrotask` 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕(在渲染前)
  - 主要包含：`Promise.then`、`MutationObserver`、`process.nextTick`(node.js 环境)

## Node 中的 Event Loop

![Node](/img/nodeEventLoop.png) 相比浏览器端，宏任务与微任务分别增加一个，上文已经列出来这里就不再赘述

:::warning nextTick & setImmediate process.nextTick
注册的回调会在事件循环的**当前阶段结束前**执行。process 是内核模块，运行时是全局上下文，所以 micro task 只有一个，无论你是在哪个阶段、哪个闭包内用 nextTick 注册的回调都会被 push 到 nextTickQueue，并在事件循环当前阶段结束前执行

![nextTick](/img/nextTick.jpg)

setImmediate 只在事件循环 check 阶段执行, poll 阶段空闲时会检测是否有 immediateTask 如果有的话则转入 check 阶段执行 ![setImmediate](/img/setImmediate.jpg)

它俩的名字和作用刚好相反

:::

## 贴个题

### 题一

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

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
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

### 题二

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
