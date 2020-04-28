---
title: vue-next(vue3.0)
date: 2020-04-28
tags:
  - vue
categories:
  - frontEnd
publish: false
---

## 设计动机

### 逻辑组合与复用

组件 API 设计所面对的核心问题之一就是如何组织逻辑，以及如何在多个组件之间抽取和复用逻辑。基于 Vue 2.x 目前的 API 有一些常见的逻辑复用模式，但都或多或少存在一些问题。这些模式包括：

- Mixins
- 高阶组件 (Higher-order Components, aka HOCs)
- Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件）

网络上关于这些模式的介绍很多，这里就不再赘述细节。总体来说，以上这些模式存在以下问题：

- 模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 mixin 的时候，光看模版会很难分清一个属性到底是来自哪一个 mixin。HOC 也有类似的问题。
- 命名空间冲突。由不同开发者开发的 mixin 无法保证不会正好用到一样的属性或是方法名。HOC 在注入的 props 中也存在类似问题。
- 性能。HOC 和 Renderless Components 都需要额外的组件实例嵌套来封装逻辑，导致无谓的性能开销。

从以上 useMouse 例子中可以看到：

- 暴露给模版的属性来源清晰（从函数返回）；
- 返回值可以被任意重命名，所以不存在命名空间冲突；
- 没有创建额外的组件实例所带来的性能损耗。
### 类型推导
> TS还在学...
## setup()函数
`setup()`函数会在`beforeCreate`之后、`created`之前
### state
