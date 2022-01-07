---
title: 前端优秀实践不完全指南
date: 2020-03-02
tags:
  - 学习笔记
  - CSS
categories:
  - frontEnd
publish: false
---

## 界面展示

### 处理动态内容--文本超长

对于所有接受后端接口字段的文本展示类的界面。都需要考虑全面（防御性编程：所有的外部数据都是不可信的），正常情况下，是没有问题的

对于**单行文本**，使用单行省略

```css
 {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

多行文本的超长省略

```css
 {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

### 图片相关

图像通常占据了网页上下载资源的绝大部分。优化图像通常可以最大限度地减少从网站下载的字节数以及提高网站性能。

通常可以，有一些通用的手段

1. 消除多余的图像资源
2. 尽可能利用 CSS3、SVG 矢量图像替代某些光栅图像
3. 谨慎使用字体图标，使用网页字体取代在图像中进行文本编码
4. 选择正确的图片格式
5. 为不同的 DPR 屏幕提供最合适的图片尺寸

#### srcset 配合 1x 2x 像素密度描述符

简单来说，srcset 可以根据不同的 dpr 拉取对应尺寸的图片

```html
<img
  src="illustration-small.png"
  srcset="images/illustration-small.png 1x, images/illustration-big.png 2x"
  style="max-width: 500px"
/>
```

上面的`srcset`里的 1x，2x 表示**像素密度描述符**，表示

- 当屏幕的 dpr=1 时，使用 small 这张图
- 当屏幕的 dpr=2 时，使用 big 这张图

#### srcset 属性配合 sizes 属性 w 宽度描述符

```html
<img
  size="(min-width: 600px ) 600px, 300px"
  src="photo.png"
  srcset="photo@1.x.png 300w, phtot@2x.png 600w, photo@3x.png 1200w"
/>
```

`sizes ="(min-width: 600px) 600px, 300px"`的意思是，如果屏幕当前的 CSS 像素宽度大于或者等于 600px，则图片宽度为 600px，反之，则图片的 CSS 宽度为 300px

> 这里的 sizes 属性只是声明了在不同宽度下图片的 CSS 宽度表现，而具体是图片在大于 600px 的屏幕上展示 600px 的屏幕上展示为 600px 宽度的代码需要另外由 CSS 或者 JS 实现，有点绕。

`srcset="photo@1x.png 300w, phote@2x.png 600w, phote@3x.png 1200w"`里面的 300w, 600w, 900w 叫宽度描述符。怎么确定当前的场景会选取哪张图片呢？

当前屏幕 dpr=2， CSS 宽度为 375px
当前屏幕 CSS 宽度为 375px，则图片宽度为 300px。

1. 300/300 = 1
2. 600/300 = 2
3. 1200/300 = 4

上面计算得到的 1、2、4 即是算出的有效像素宽度，换算成 x 描述符等价的值。这里 600w 算出的 2 即满足 dpr=2 的情况，选择这张图

当前屏幕 dpr=3，CSS 宽度为 414px。
当前屏幕 CSS 宽度为 414px，则图片宽度仍为 300px。再计算一次：

- 300/300 = 1
- 600/300 = 2
- 1200/300 = 4

因为 dpr=3 已经不满足了，则此时会选择 1200w 这张图

当前 dpr=1，CSS 宽度为 1920px

当前屏幕 CSS 宽度为 1920px，则图片 CSS 宽度变成了 600px。在计算一次

1. 300/600 = 0.5
2. 600/600=1
3. 1200/600 = 2

所以会选择 600w 对应的图片

> CSS 有个类似的属性，`image-set()`，搭配使用，效果更佳。
