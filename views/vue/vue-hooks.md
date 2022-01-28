---
title: Vue生命周期
date: 2020-06-17
tags:
  - JavaScript
  - Vue
categories:
  - frontEnd
---

:::theorem 转载
作者：晨曦时梦见兮
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
:::right
[Vue 的生命周期之间到底做了什么事清？（源码详解，带你从头梳理组件化流程）](https://juejin.im/post/5e88953b6fb9a03c4e6468a5)
:::

## 初始化流程

### new Vue

从 new Vue(options)开始作为入口

```js
new Vue(options){
  this._init(options)
}
```

### beforeCreate 被调用完成

1. 初始化`inject`
2. 初始化 state
   - 初始化 `props`
   - 初始化 `methods`
   - 初始化 `data`
   - 初始化 `computed`
   - 初始化 `watch`

### created 被调用完成

调用 \$mount 方法，开始挂载组件到 dom 上。

如果使用了`runtime-with-compile`版本,则会把你传入的`template`选项或者`html`文本,通过一系列的编译生成 render 函数

- 编译这个`template`,生成`ast`语法树
- 优化这个`ast`, 标记静态节点
- 根据`ast`,生成`render`函数

```js
const ast = parse(template.trim(), options);
if (options.optimize !== false) {
  optimize(ast, options);
}
const code = generate(ast, options);
```

如果是脚手架搭建的项目的话,这一步 vue-cli 已经帮你做好了,所以直接进入`mountComponent`函数
有了`render`函数后,就可以往`渲染`的步骤继续进行了

### beforeMounted 被调用完成

把**渲染组件的函数**定义好

```js
updateComputed = () => {
  vm._update(vm._render(), hydrating);
};
```

拆开来看,`vm._render`其实就是调用我们上一步拿到的`render`函数生成一个`vnode`,而`vm._update`方法则会对这个`vnode`进行`patch`操作, 帮我们把`vnode`通过`createElm`函数创建新节点并且渲染到 `dom 节点`中

然后通过响应式原理的一个核心类`Watcher`负责代理执行函数，通过在这段过程中去跟踪这些函数读取了哪些响应式数据，将来这些响应式数据更新的时候，重新执行`updateComponent`函数

这些更新后调用`updateComponent`函数的话,`updateComponent`内部的`patch`就不再是初始化时候的创建节点,而是新旧`vnode`进行`diff`,最小化的更新到 dom 节点上去

```js
new Watcher(
  vm,
  updatecomponent,
  noop,
  {
    before() {
      if (vm._isMounted) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true
);
```

这里在`before`属性上定义了`beforeUpdate`函数,也就是说`Watcher`被先用是属性的更新触发之后,重新渲染视图之前,会先调用 beforeUpdate 生命周期。

在 render 的过程中，如果遇到了子组件，则会调用 `createComponent`函数
`createComponent`函数内部，会为子组件生成一个属于自己的构造函数，可以理解为子组件自己的 Vue 函数: `Ctor = baseCtor.extend(Ctor)`

:::tip Note
除了组件有自己的生命周期外，其实 vnode 也有自己的生命周期，自己不够我们平常开发的时候是接触不到的。那么子组件的 vnode 会有自己的 init 周期,这个周期内部会做这样的事情:
:::

```js
const child = createComponentInstanceForVnode(vnode);
child.$mount(vnode.elm);
```

而`createComponentOptions.Ctor(options)`又会去调用**子组件**的构造函数，也就是说，如果遇到了**子组件**那么就会优先开始**子组件**的构建过程，从`beforeCreated`重新开始

那么如果有`父->子->孙`三个组件，那么他们的初始化生命周期是这样的：

```
父 beforeCreate
父 create
父 beforeMount
子 beforeCreate
子 create
子 beforeMount
孙 beforeCreate
孙 create
孙 beforeMount
孙 mounted
子 mounted
父 mounted
```

然后`mounted`生命周期被触发

### mounted 被调用完成

## 更新流程

当一个响应属性被更新后,出发了`Watcher`的回调函数,也就是`vm._update(vm._render())`,在更新之前,会先调用刚才`before`属性上定义的函数,也就是

```js
callHook(vm, "beforeUpdate");
```

由于 Vue 的异步更新机制,`beforeUpdate`的调用已经是在`nextTick`中了.具体代码如下

```js
nextTick(flushScheduleQueue);
function flushScheduleQueue() {
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      // callHook(vm, 'beforeUpdate')
      watcher.before();
    }
  }
}
```

### beforeUpdate 被调用完成

然后经过一系列的`patch`、`diff`流程后,组件重新渲染完毕,调用`updated`钩子

这里是对`watcher`倒序`updated`调用的

也就是说, 加入同一个属性通过`props`分别流向`父->子->孙`, 那么收集到依赖的先后也是这个顺序, 但是触发 updated 钩子却是`孙->子->父`这个顺序去触发的

```js
function callUpdateHooks(queue) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, "updated");
    }
  }
}
```

### updated 被调用完成

至此,渲染更新完毕

## 销毁流程

在刚刚所说的更新后的 patch 过程中,如果发现有组件在这一轮渲染中消失了,比如 `v-for` 对应的数组中少了一个数据,那么就会调用`removeVnodes`进入组组件的销毁流程

`removeVnodes`会调用`vnode`的`destroy`生命周期,而 destroy 内部则会 调用我们相对比较熟悉的`vm.$destroy()`。（keep-alive 包裹的子组件除外

这时，就会调用 `callHook(vm，'BeforeDestroy')`

### beforeDestroy 被调用完成

之后会经历一系列的**清理**逻辑，清除父子关系，watcher 关闭逻辑。

但是注意: `$destroy`并不会把组件从试图上移除，如果想要手动的销毁一个组件，则需要我们自己去完成这个逻辑

然后，调用最后的`callHook(vm,;destroy')`

### destroy 被调用完成
