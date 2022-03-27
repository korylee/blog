(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{595:function(t,s,n){"use strict";n.r(s);var a=n(10),e=Object(a.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("p",[n("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/API/Resize_Observer_API",target:"_blank",rel:"noopener noreferrer"}},[t._v("Resize Observer API"),n("OutboundLink")],1),t._v("提供了一种高性能的机制，通过该机制，代码可以监视元素的大小更改，并且每次大小更改都会向观察者传递通知")]),t._v(" "),n("h2",{attrs:{id:"概念"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#概念"}},[t._v("#")]),t._v(" 概念")]),t._v(" "),n("ul",[n("li",[t._v("能够监听不同"),n("code",[t._v("box-sizing")]),t._v("的变化，比如"),n("code",[t._v("border-box")]),t._v(" / "),n("code",[t._v("content-box")])]),t._v(" "),n("li",[t._v("能够监听元素挂载和卸载")]),t._v(" "),n("li",[t._v("能够监听非容器类型的 DOM，比如"),n("code",[t._v("input")]),t._v(","),n("code",[t._v("canvas")]),t._v(" 等")])]),t._v(" "),n("p",[t._v("自古监听，就没逃过循环计算的问题，大家熟悉的脏值检查的次数限制，而"),n("code",[t._v("ResizeObserver")]),t._v("是怎么解决这个问题的呢")]),t._v(" "),n("ul",[n("li",[n("code",[t._v("observer")]),t._v("每一个"),n("code",[t._v("Resize Observer")]),t._v("实例")]),t._v(" "),n("li",[n("code",[t._v("observation")]),t._v("当 observer 实例调用 observe 方法之后创建的每一个监听,每一个"),n("code",[t._v("observer")]),t._v("可以包含多个"),n("code",[t._v("observation")])]),t._v(" "),n("li",[n("code",[t._v("target")]),t._v("被监听的 DOM 元素")]),t._v(" "),n("li",[n("code",[t._v("depth")]),t._v("深度,表示一个 DOM 元素距离根元素的距离,在网页中,也就是距离 html 标签的距离")])]),t._v(" "),n("p",[t._v("在每一次 Event Loop 中, 会检查每一个"),n("code",[t._v("observation")]),t._v("的"),n("code",[t._v("target")]),t._v("的"),n("code",[t._v("depth")]),t._v(",并取一个最小值。然后顺便检查有哪些"),n("code",[t._v("observation")]),t._v("产生了变化,并创建对应的"),n("code",[t._v("entity")]),t._v(", 最后作为参数传给"),n("code",[t._v("observer")]),t._v("的回调。当上面这一操作之后, 就完成了检测,然后会再重复一遍这样的操作,只不过这次有个要求,不仅要求"),n("code",[t._v("observation")]),t._v("有变化, 还要求对应的"),n("code",[t._v("depth")]),t._v("比上次检查的最小值还要大,才可以创建"),n("code",[t._v("entity")]),t._v("。就这样一直一直循环检测跑下去，知道没有任何东西被检测出变化\n简单来说，除了第一轮的检查外，其他的每一轮检查都要求元素的高度要大于在上一轮检查元素的高度最小值，从而保证每一次检查，深度会越来越大，直到打到最小的根节点，进而检查结束")]),t._v(" "),n("p",[t._v("对于那些深度小于上一次的最小深度的"),n("code",[t._v("observation")]),t._v("会自动到下一个 Event Loop 的时机去检查")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" ResizeObserver "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"resize-observer-polyfill"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" ro "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ResizeObserver")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("entries"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" observer")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" entry "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("of")]),t._v(" entries"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" left"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" top"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" width"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" height "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" entry"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("contentRect"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"entry"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" entry"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"element"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" entry"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("target"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token template-string"}},[n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("Element's size ")]),n("span",{pre:!0,attrs:{class:"token interpolation"}},[n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("width"),n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("px x ")]),n("span",{pre:!0,attrs:{class:"token interpolation"}},[n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("height"),n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("px")]),n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token template-string"}},[n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("Element's paddings ")]),n("span",{pre:!0,attrs:{class:"token interpolation"}},[n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("top"),n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("px; ")]),n("span",{pre:!0,attrs:{class:"token interpolation"}},[n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("left"),n("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("px")]),n("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nro"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("observe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("document"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("body"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=e.exports}}]);