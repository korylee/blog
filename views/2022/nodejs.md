---
title: nodejs基础
date: 2022-06-27
tags:
- nodejs
categories:
- frontEnd
---


## 前言

之前用 node 用的蛮多，但没系统性的学过，每次都是草草的翻下 api 文档就完事

## 非阻塞

### 阻塞和非阻塞 I/O（Input/Output）

阻塞和非阻塞 I/O 其实是针对操作系统内核而言的， 而不是 nodejs 本身。阻塞 I/O 的特点就是**一定要等到操作系统完成所有操作后才表示调用结束**，而非阻塞性 I/O 是调用后立马返回，不用等操作系统内核完成操作。

对前者而言，在操作系统进行 I/O 的操作过程中，应用程序是处于阻塞状态的，什么都做不了
而换成非阻塞 I/O，调用返回后 nodejs 还能完成其他的事情，而操作系统同时也在进行 I/O。提高了执行效率，但同时又会产生一个问题，nodejs 应用程序怎么知道操作系统已经完成了 I/O 操作了呢

为了让 nodejs 知道操作系统完成了 I/O 操作，需要轮询那里判断一下是否完成。对于轮询而言， 有以下几种方案

1. 一直轮询检查 I/O 状态，知道 I/O 完成。这是最原始的方式，也是性能最低的，会让 CPU 一直消耗在等待上面，其实跟阻塞 I/O 是一样的
2. 便利文件描述符（即文件 I/O 时操作系统和 nodejs 之间的文件凭证）的方式来确定 I/O 是否完成，I/O 完成则文件描述符的状态改变。但 CPU 的轮询消耗还是大
3. epoll 模式。即在进入轮询的时候如果 I/O 未完成 CPU 就休眠，完成后唤醒 CPU

总之， CPU 要么重复检查 I/O，要么重复检查文件描述符，要么休眠，都得不到很好的利用，我们希望的是

> nodejs 发起 I/O 调用后可以直接去执行别的逻辑，操作系统默默地作完 I/O 之后给 nodejs 发一个完成信号，nodejs 执行回调操作

### 异步 I/O 的本质

Linux 原生存在这样的一种方式，即（A|O），但两个致命的缺陷

1. 只有 Linux 下存在，在其它操作系统中没有异步 I/O 支持
2. 无法利用系统缓存

#### nodejs 中的异步 I/O 方案

js 本身是一个单线程， 同步的，阻塞的语言。
但倘若把思路放开一点， 利用操作系统的多线程来考虑这个问题，就变得轻松多了。没错，**异步 I/O 是利用线程池来实现的。**

以文件为 I/O，有一段代码示例

```js
const fs = require("fs");
fs.readFile("./test.txt", (err, data) => {
  console.log(data);
});
```

#### 执行流程

执行代码的过程中大概发生了这些事情

1. fs.readFile 调用 Node 的核心模块 js
2. Node 的核心模块调用内建模块 node_file.cc，创建对应的文件 I/O 观察者对象
3. 最后，根据不同平台（Linux 或 windows），内建模块通过 libuv 中间层进行系统调用

#### libuv 调用过程拆解

重点来了！libuv 中是如何进行系统调用的？ 也就是 uv_fs_open()中做了些什么

##### 1. 创建请求对象

以 windows 系统为例，在这个函数的调用过程中，我们创建了一个文件 I/O 的请求对象，并往里注入了回调函数

```cpp
req_wrap->object_->Set(oncomplete_sym, callback)
```

*req_wrap 便是这个请求对象，req_wrap 中 object*的 oncomplete_sym 属性对应的值便是我们 nodejs 应用程序代码中传回的回调函数

##### 2. 推入线程池，调用返回

在这个对象包装完后，QueueUserWorkItem()方法将这个对象推进线程池中等待执行。

###### 3. 回调通知

- `GetQueuedCompletionStatus`: 在每一个 tick 中都会调用`GetQueuedCompletionStatus`检查线程池中是否有执行完的请求，如果有则表示时机已经成熟，可以执行回调了
- `PostQueuedCompletionStatus`: 向 IOCP 提交状态，告诉它当前 I/O 完成了

当对应线程中的 I/O 完成后，会将对应获得的结果**存储**起来，保存到**相应的请求对象**中，然后调用`PostQueuedCompletionStatus`向 IOCP 提交执行完成的状态，并且将线程还给操作系统。一旦 EventLoop 的轮询操作中，调用`GetQueuedCompletionStatus`检测到了完成的状态，就会把`请求对象`塞给文件 I/O 观察者（上文[执行流程](#执行流程)中创建

I/O 观察者现在的行为就是取出**请求对象**和**缓存结果**，同时也取出它的`oncomplete_sym`属性，即回调函数。将前者作为函数参数传给后者，并执行后者。

### 站在巨人肩上

- [阻塞对比非阻塞一览](https://nodejs.org/zh-cn/docs/guides/blocking-vs-non-blocking/)

## 事件循环

![node事件循环](https://raw.githubusercontent.com/korylee/blog/master/.vuepress/public/img/nodeEventLoop.png)

### 1. 三大关键阶段

1. 执行定时器回调阶段，检查定时器，如果到了时间，就执行回调。这些定时器就是 setTimeout，setInterval。这个阶段暂且叫他`Timer`
2. 轮询（英文叫`Poll`）阶段。node 中异步操作完成后，就是通过 data、connect 等事件使得事件循环到达 poll 阶段。到了这个阶段后：如果当前已经存在定时器，而且定时器到时间了，拿出来执行，eventLoop 将回到 timer 阶段。

如果没有定时器，会去看回调函数队列

- 如果队列不为空，拿出队列中的方法依次执行
- 如果队列为空，检查是否有`setImmdiate`的回调
  - 如果有则往`check`阶段
  - 没有则继续等待。相当于阻塞了一段时间（阻塞时间是有上限的），等待 callback 函数加入队列，加入后会立刻执行。一段时间后自动进入`check`阶段

3. check 阶段。直接执行`setImmdiate`的回调

### 2. 完善

首先，当第一阶段结束后，可能额并不会立即等待到异步事件的响应，这时候 nodejs 会进入到`I/O异常的回调状态`。比如说 TCP 连接遇到 ECONNREFUSED，就会在这个时候执行回调
并且在 check 阶段结束后还会进入到`关闭事件的回调阶段`。如果一个 socket 或句柄（handler）被突然关闭，例如 `socket.destroy()`, `close` 事件的回调就会在这个阶段执行

梳理下：

1. timer 阶段
2. I/O 异常回调阶段
3. 空闲、预备阶段（第二阶段结束， poll 未触发之前）
4. poll 阶段
5. check 阶段
6. 关闭事件的回调阶段

### 3. nodejs 和浏览器关于 eventLoop 的主要区别

两者最主要的区别在于浏览器中的微任务是在`每个相应的宏任务`中执行的，而 nodejs 中的微任务是在`不同阶段`执行的。

### 4. process.nextTick & setImmediate

process.nextTick 是独立于 eventLoop 的任务队列
在每个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务**优先于微任务**执行。

![process.nextTick](https://raw.githubusercontent.com/korylee/blog/master/.vuepress/public/img/nextTick.jpg)

`setImmdiate`只在事件循环 check 阶段执行，poll 阶段空闲时会检测是否有 immediateTask，如果有则会转入 check 阶段执行
![setImmediate](https://raw.githubusercontent.com/korylee/blog/master/.vuepress/public/img/setImmediate.jpg)

**它俩的名字和作用刚好相反**

### 站在巨人肩上

- [Node.js 事件循环](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick)

## npm

### npm 模块安装机制

1. 发出 npm install 命令
2. 查询 node_modules 目录之中是否已经存在指定模块
3. 若存在， 不再重新安装
4. 若不存在
5. 查询根目录下的.npm 目录里有无指定模块
6. 若有，直接解压压缩包到当前项目的 node_modules 目录
7. npm 向 registry 查询模块压缩包的网址
8. 下载压缩包，存放在根目录下的.npm 目录里
9. 解压压缩包到当前项目的 node_modules 目录

## buffer

### 概述

`Buffer`对象是 Node 处理二进制数据的一个借口。它是 Node 原生提供的全局对象，可以直接使用

Javascript 比较擅长处理字符串，对于处理二进制数据（比如 TCP 数据流），就不太擅长。`Buffer`对象就是为了解决这个问题而设计的。它是一个构造函数，生成的实例代表了 V8 引擎分配的一段内存，是一个类似数组的对象，成员都是 0 到 255 的整数值，即一个 8 位的字节

```js
// ==！ new Buffer() 被弃用了
const bytes = Buffer.alloc(256);
for (var i = 0; i < bytes.length; i++) {
  bytes[i] = i;
}

// 生成一个buffer的view
const end = bytes.slice(240, 256);
console.log(end[0]); // 240
end[0] = 0;
console.log(end[0], bytes[240]); // 0 0
```

### 与二进制数组的关系

`TypedArray`构造函数可以接受`Buffer`实例作为参数，生成一个二进制数组。比如，`new Unit32Array(Buffer.from([1,2,3,4]))`，生成一个 4 个成员的二进制数组。另外，这时二进制数据所对应的内存是从 Buffer 对象拷贝的，而不是共享的。二进制数据的`buffer`属性，保留着指向原 Buffer 对象的指针。

二进制数组的操作，与 Buffer 对象的操作基本上是兼容的，只有轻微的差异。比如：二进制数组的`slice`方法返回原内存的拷贝，而 Buffer 对象的`slice方法`创造原内存的一个视图（view）

### 如何创建 buffer

> new Buffer()通过构造函数生成实例已经被弃用了，应该尽量少使用

使用`Buffer.from()`，`Buffer.alloc()`，`Buffer.allocUnsafe()`方法创建 buffer

- Buffer.from(array)
- Buffer.from(arrayBuffer[, byteOffset[, length]])
- Buffer.from(buffer)
- Buffer.from(string[, encoding])
  也可以只初始化 buffer（传入大小）。以下会创建一个 1kb 的 buffer

虽然`alloc`和`allocUnsafe`均分配指定大小的`Buffer`（以字节为单位），但是`alloc`创建的`Buffer`会被使用`buf.fill(0)`进行初始化，而`allocUnsafe`创建的不会被初始化。

当`Buffer`内存被读取时，如果内存中存在较旧的数据，则可以被访问或泄露。这就是真正使`allocUnsafe`不安全的原因

### 站在巨人肩上

- [Node.js Buffer](http://nodejs.cn/learn/nodejs-buffers)
- [Buffer api](http://nodejs.cn/api/buffer.html)
- [Buffer.from()、Buffer.alloc() 与 Buffer.allocUnsafe()](http://nodejs.cn/api/buffer/buffer_from_buffer_alloc_and_buffer_allocunsafe.html)

## stream 流

### 概述

数据读写可以看作是时间模式（Event）的特例，不断发送的数据块好比一个个的事件。读数据是`read`事件，写数据是`write`事件，而数据块是事件附带的信息。Node 为这类情况提供了一个特殊接口[`Stream`](http://nodejs.cn/api/stream.html)，所有的流都是[EventEmitter](http://nodejs.cn/api/events.html#events_class_eventemitter)的实例

“数据流”是处理系统缓存的一种方式。操作系统采用数据块（chunk）的方式读取数据，每收到一次数据，就存入缓存。
Node 应用程序有两种缓存的处理方式，第一种是等到所有的数据接收完毕，一次性从缓存中读取，这就是传统的读取文件的方式；第二种是采用“数据流”的方式，每收到一块数据，就读取一块，即在数据还没有接受完成时，就开始处理它。

第一种方式先将数据全部存入内存，然后处理，优点是符合直觉，流程非常自然美，缺点是如果遇到大文件，要花很长事件，才能进入数据处理的步骤。第二种方式每次只读入数据的一小块，像流水一样，每当系统读入了一小块数据，就会触发一个事件，发出‘新数据块’的信号。应用程序只要监听这个事件，就能掌握数据读取的进展，做出相应处理，这样就提高了程序的性能。

```js
const fs = require("fs");
fs.createReadStram("./customers.csv").pipe(propcess.stdout);
```

上面代码中，fs.createReadStream 方法就是以”数据流“的方式读取文件，这可以在文件还没有读取完的情况下，就输出到标准输出。这显然对大文件的读取非常有利。

Unix 操作系统从很早以前，就有“数据流”这个概念，它是不同进程之间传递数据的一种方式。管道命令（pipe）就起到在不同命令之间，连接数据流的作用。

数据流接口的最大特点就是通过事件通信，具有`readable`, `writeable`,`drain`,`data`,`end`,`close`等事件，即可以读取数据，也可以写入数据。读取数据时，每读入（或写入）一段数据，就会触发一次`data`事件，全部读取完毕触发`end`事件，发生错误触发`error`事件。

### why

相较于其他数据处理方法，流基本上有两个优点

- **内存效率**：无需加载大量的数据到内存中即可进行处理
- **时间效率**：当获得数据之后即可立即开始处理数据，这样所需要的时间更少，而无需等整个数据有效负载可用才开始。

### `pipe()`

它用来获取来源流，并将其通过管道传输到目标流

`pipe()`方法的返回值是目标流，这是非常方便的事情，它使得可以链接多个`pipe()`调用，如下：

```js
src.pipe(dest1).pipe(dest2);
```

### 不同类型的流

- `Readable`: 可以通过管道读取，但不能通过管道写入的流（可以接收数据，但不能向其发送数据）
- `Writeable`：可以通过管道写入，但不能通过管道读取的流（可以发送数据，但不能从中接收数据）
- `Duplex`: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合
- `Transform`: 类似于双工流，但在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）

### 站在巨人肩上

- [Node.js 流](http://nodejs.cn/learn/nodejs-streams)
