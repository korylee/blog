---
title: Resize Observer
date: 2021-05-23
tags:
  - DOM
categories:
  - frontEnd
---

[Resize Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Resize_Observer_API)提供了一种高性能的机制，通过该机制，代码可以监视元素的大小更改，并且每次大小更改都会向观察者传递通知

## 概念

- 能够监听不同`box-sizing`的变化，比如`border-box` / `content-box`
- 能够监听元素挂载和卸载
- 能够监听非容器类型的 DOM，比如`input`,`canvas` 等

自古监听，就没逃过循环计算的问题，大家熟悉的脏值检查的次数限制，而`ResizeObserver`是怎么解决这个问题的呢

- `observer`每一个`Resize Observer`实例
- `observation`当 observer 实例调用 observe 方法之后创建的每一个监听,每一个`observer`可以包含多个`observation`
- `target`被监听的 DOM 元素
- `depth`深度,表示一个 DOM 元素距离根元素的距离,在网页中,也就是距离 html 标签的距离

在每一次 Event Loop 中, 会检查每一个`observation`的`target`的`depth`,并取一个最小值。然后顺便检查有哪些`observation`产生了变化,并创建对应的`entity`, 最后作为参数传给`observer`的回调。当上面这一操作之后, 就完成了检测,然后会再重复一遍这样的操作,只不过这次有个要求,不仅要求`observation`有变化, 还要求对应的`depth`比上次检查的最小值还要大,才可以创建`entity`。就这样一直一直循环检测跑下去，知道没有任何东西被检测出变化
简单来说，除了第一轮的检查外，其他的每一轮检查都要求元素的高度要大于在上一轮检查元素的高度最小值，从而保证每一次检查，深度会越来越大，直到打到最小的根节点，进而检查结束

对于那些深度小于上一次的最小深度的`observation`会自动到下一个 Event Loop 的时机去检查

```js
import ResizeObserver from "resize-observer-polyfill";
const ro = new ResizeObserver((entries, observer) => {
  for (const entry of entries) {
    const { left, top, width, height } = entry.contentRect;
    console.log("entry", entry);
    console.log("element", entry.target);
    console.log(`Element's size ${width}px x ${height}px`);
    console.log(`Element's paddings ${top}px; ${left}px`);
  }
});
ro.observe(document.body);
```
