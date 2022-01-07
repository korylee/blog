---
title: 设计模式
date: 2020-05-18
tags:
  - JavaScript
  - 学习笔记
categories:
  - frontEnd
---

## 设计模式

| 设计模式   | 描述                                         | 例子                               |
| ---------- | -------------------------------------------- | ---------------------------------- |
| 单例模式   | 一个类只能构造出唯一实例                     | Redux/Vuex 的 store                |
| 工厂模式   | 对创建对象逻辑的封装                         | jQuery 的`$(selector)`             |
| 观察者模式 | 当一个对象被修改时，会自动通知它对的依赖对象 | Redux 的 subscribe、Vue 的双向绑定 |
| 装饰器模式 | 对类的包装，动态的扩展类的功能               | React 高阶组件，ES7 装饰器         |
| 适配器模式 | 兼容新旧接口，对类的包装                     | 封装新旧 API                       |
| 代理模式   | 控制对类的访问                               | 事件代理、ES6 的 proxy             |

### 1. 介绍单一职责原则与开放封闭原则

- 单一职责原则：一个类只负责一个功能领域中的相应职责，或者可以定义为：就一个类而言，应该只有一个引起它变化的原因
- 开放封闭原则：核心思想是软件实体（类，模块，函数等）是可扩展的、但不可修改的。也就是说：对扩展是开放的，对修改是封闭的

### 2.单例模式

单例模式的意义在于共享、唯一，`Redux/Vuex`中的 store、jQuery 的`$`或者业务场景中的购物车、登录框都是单例模式的应用

```js
class SingletonLogin {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
  static getInstance(name, password) {
    if (!this.instance) this.instance = new SingletonLogin(name, password);
    return this.instance;
  }
}
let obj1 = SingletonLogin.getInstance("cxk", "123");
let obj2 = SingletonLogin.getInstance("cxk", "321");
console.log(obj1 === obj2); // true
console.log(obj1); // {name:CXK,password:123}
console.log(obj2); // 输出的依然是{name:CXK,password:123}
```

### 3. 工厂模式

工厂模式即对创建对象逻辑的封装,或者简单理解为对 new 的封装。

```js
class User {
  constructor(name, auth) {
    this.name = name;
    this.auth = auth;
  }
}
class UserFactory {
  static createUser(name, auth) {
    // 工厂内封装了创建对象的逻辑
    // 权限为admin时,auth=1,权限为user时,auth为2
    // 使用者在外部创建对象时,不需要知道各个权限对应哪个字段,不需要知道赋权的逻辑,只需要知道创建了一个管理员和用户
    if (auth === "admin") new User(name, 1);
    if (auth === "user") new User(name, 2);
  }
}
```

### 4. 观察者模式

概念:观察者监听被观察者的变化,被观察者发生改变时,通知所有的观察者。观察者模式被广泛用于监听事件的实现

```js
class Observer {
  constructor(fn) {
    this.update = fn;
  }
}
class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  // 通知所有观察者,实际上把观察者的update()都执行了一遍
  notify() {
    this.observers.forEach((observer) => {
      // 依次取出观察者,并执行观察者的update()方法
      observer.update();
    });
  }
}
```

有些文章把观察者模式称为发布订阅模式,其实二者是有区别的,发布订阅模式相较于观察者模式多一个调度中心

```js
class EventEmitter {
  #subs = {};
  emit(event, ...args) {
    if (this.#subs[event]?.length)
      this.#subs[event].forEach((cb) => cb.call(this, ...args));
  }
  on(event, cb) {
    (this.#subs[event] || (this.#subs[event] = [])).push(cb);
  }
  off(event, offCb) {
    if (!offCb) this.#subs[event] = [];
    else {
      if (this.#subs[event]?.length)
        this.#subs[event] = this.#subs[event].filter((cb) => cb !== offCb);
    }
  }
}
```

### 5. 装饰器模式

可以理解为对类的一个包装,动态的扩展类的功能

### 6. 适配器模式

将一个接口转换为客户希望的另一个接口,使接口不兼容的那一些类可以一起工作。

```js
class Adapter {
  test() {
    return "旧接口";
  }
}
class Target {
  constructor() {
    this.adapter = new Adapter();
  }
  test() {
    let info = this.adapter.test();
    return `适配${info}`;
  }
}
let target = new Target();
console.log(target.test());
```

### 7. 代理模式

为一个对象找一个替代对象,以便于对原对象进行访问。即在访问者与目标对象之间加一层代理，通过代理做授权和控制。
