---
title: for in和for of 的区别
date: 2021-02-28
tags:
  - JavaScript
categories:
  - frontEnd
# publish: false
---

## for in

以任意顺序遍历一个对象的[可枚举属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。遍历数组时，key 为**数组下标字符串**；遍历对象,key 为对象字段名

### 缺点

1. for in 迭代顺序依赖于执行环境,不一定保证顺序
2. for in 不仅会遍历当前对象,还包括原型链上的可枚举属性
3. for in 没有 break 中断
4. for in 不适合遍历数组，主要应用为对象

## for of

ES6 引用的新语法,在[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)（包括 Array，Map，Set，String，TypedArray，arguments 对象）上创建一个迭代循环，调用自定义迭代钩子，并且为每个不同属性的值执行语句

**Object 对象不是可迭代对象,故 for of 不支持。**<br/>
for of 有个很大的特点是支持数组的 break 中断。

### 优点

1. for of 有 for in 一样的简洁语法，但没有 for in 的缺点
2. for of 保证顺序并且不会遍历当前对象
3. for of 可与 break，continue，return 配合
