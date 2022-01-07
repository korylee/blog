---
title: 优雅的判断元素是否进入当前视区
date: 2021-05-23
tags:
  - DOM
categories:
  - frontEnd
---

## 使用元素位置判断元素是否在当前视区

通过绑定`scroll`事件或者用一个`定时器`, 然后再回调函数中调用元素的`getBoundingClientRect` 获取元素位置实现这个功能

```js
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}
```

### 什么是 getBoundingClientRect

[`getBoundingClientRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)用于获取页面中的某个元素的左,上,右,下分别相对浏览器弹窗的位置。`getBoundClientRect`是`DOM`元素到浏览器可视范围的距离

如果是标准盒子模型，元素的尺寸等于`width/height`+`padding`+`border`的总和。如果`box-sizing: border-box`，元素的尺寸等于`width/height`

- 该函数返回一个[`DOMRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMRect)对象，这个对象是由该元素的 [`getClientRects()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getClientRects) 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。该对象有 6 个属性：`top,left,right,bottom,width,height`
- 这里的 top、left 和 CSS 中的理解很类似，width，height 是元素自身的宽高
- 但是 right，bottom 和 CSS 中的理解不太一样，right 是指元素右边界距窗口最左边的距离，bottom 是指元素下边界距窗口最上面的距离

![getBoundingClientRect picture 1](https://mdn.mozillademos.org/files/15087/rect.png)

## Intersection Observer

因为每次调用`getBoundingClientRect`都会强制浏览器*重新计算*整个页面的布局, 因为这种性能实现方式**性能极差**
如果你的站点被加载到一个`iframe`里,而你想要知道用户什么时候能够看到某个元素,这几乎是不可能的。

单元模型(Single Origin Model)和浏览器不会让你 iframe 里的任何数据
`Intersection Observer`就是为此而生的

它让检测一个元素是否可见`更加高效`,它能让你知道一个被观测的元素什么时候进入或离开浏览器的可见窗口

```js
const io = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    console.log(entry);
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  }
}, options);
const el = document.querySelector(".element");
io.observe(el);
```

entries 参数会被传递给你的回调函数, 他是一个`IntersectionObserverEntry`对象数组。

每个对象都包含更新过的交点数据针对你所观测的数据之一

从输出最有用的特性是：

- `isIntersecting`: 当元素与默认根(在本例中为视口)相交时, 将为 true
- `target`: 这将是我们将要观察的页面的实际元素
- `intersectionRect`: 元素的可见部分。这将包含有关元素，其高度，宽度，视口位置等的信息

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="myogeshchavan97" data-slug-hash="pogrWKV" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Demo Intersection Observer">
  <span>See the Pen <a href="https://codepen.io/myogeshchavan97/pen/pogrWKV">
  Demo Intersection Observer</a> by Yogesh (<a href="https://codepen.io/myogeshchavan97">@myogeshchavan97</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### 更多有用的属性

当被观测的元素部分进入可见窗口时会触发回调函数一次，当它离开可见窗口时会触发另一次

- `threshold`： 它允许你定义一个 intersectionRadio 临界值，默认[0]，就是默认行为
  每次 intersectionRadio 经过这些值的时候，你的回调函数都会被调用
  如果设置为[0,0.25,0.5,0.75,1]，当元素的每四分之一变为可见时，都会受到通知
- `rootMargin`: 允许你指定到根元素的距离,允许你有效的扩大或缩小交叉区域面积
  ```js
  new IntersectionObserver(
    (entries) => {
      // do something width entries
    },
    {
      // options
      // 用于计算相交区域的根元素
      // 如果未提供,使用最上级文档的可见窗口
      root: null,
      // 同margin, 可以是1~4个值,可以是负值
      // 如果显式指定了根元素，该值可以使用百分比，即根元素大小的百分之多少。
      // 如果没指定根元素, 使用百分比会出错
      rootMargin: "0px",
      // 触发回调函数的临界值,用0~1的比率指定,也可以是一个数组
      // 其值式被观测元素可视面积/总面积
      // 当可视比率经过这个值时，回调函数就会被调用
      threshold: [0],
    }
  );
  ```

:::warning Note
IntersectionObserver 不是完美精确到像素级别，也不是低延时性的。
使用它实现类似**依赖滚动效果的动画**注定会失败
因为回调函数被调用的时候那些数据----严格来说已经过期了。
:::

## 实例： 懒加载（lazy load）

有时，我们希望某些静态资源（比如图片），只有用户向下滚动，他们进入视口时才加载，这样可以节省带宽，提高网络性能。

```js
function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}
const io = new IntersectionObserver((changes) => {
  changes.forEach((change) => {
    let container = change.target,
      content = container.querySelector("template").content;
    container.appendChild(content);
    io.unobserve(container);
  });
});
query(".lazy-load").forEach((item) => io.observe(item));
```

## 实例： 无限滚动

```js
const io = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRadio <= 0) return;
  loadItems(10);
  console.log("loaded new Items");
});
io.observe(document.querySelector(".scrollFooter"));
```

无限滚动时，最好在页面底部有一个页尾栏
一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的条目放在页尾栏前面

这样做的好处是：
不需要再一次调用`observe()`方法，现有的`IntersectionObserver`可以保持使用。
