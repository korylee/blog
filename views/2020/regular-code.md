---
title: 手写代码实现
date: 2020-05-15
tags:
  - JavaScript
  - 学习笔记
categories:
  - frontEnd
---

## ES6 部分语法糖实现

### call 实现

```js
Function.prototype.myCall = function (context, ...args) {
  context = (context ?? window) && new Object(context);
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};
```

### apply 实现

```js
Function.prototype.myApply = function (context, args) {
  context = (context ?? window) && new Object(context);
  const key = Symbol();
  context[key] = this;
  args = Array.from(args);
  const result = args ? context[key](args) : context[key]();
  delete context[key];
  return result;
};
```

### bind 实现

```js
Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  const bindFn = function (...newArgs) {
    return fn.call(
      this instanceof bindFn ? this : context,
      ...args,
      ...newArgs
    );
  };
  bindFn.prototype = Object.create(fn.prototype);
  return bindFn;
};
```

### new 实现

```js
const createNew = function (con, ...args) {
  let obj = Object.create(con.prototype);
  let result = con.apply(obj, args);
  return result instanceof Object ? result : obj;
};
```

### create 实现

> 注: `Reflect.defineProperty() == Object.defineProperty()`,但不存在 `Reflect.defineProperties()`

```js
Object.myCreate = (o, properties) => {
  const F = {};
  Reflect.setPrototypeOf(F, o);
  Object.defineProperties(F, properties);
  return F;
};
```

### promise 实现

#### 精简版

```js
function Promise(executor) {
  var self = this;
  var callbacks = [];
  executor(resolve.bind(self));
  function resolve(value) {
    setTimeout(() => {
      self.data = value;
      callbacks.forEach((cb) => cb(value));
    });
  }
}
Promise.prototype.then() = function (onResolved, onRejected) {
  var self = this;
  return new Promise((resolve) => {
    self.callbacks.push(function () {
      var result =
        typeof onResolved === "function" ? onResolved(self.data) : self.data;
      if (result instanceof Promise) resolve.then(result);
      else resolve(result);
    });
  });
};
```

#### 完整版

```js
class Promise {
  constructor(executor) {
    if (typeof executor !== "function")
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    this.status = "pending";
    this.value = null;
    this.callback = [];
    try {
      // 如果将方法绑定this，实例化的时候就能显式的看到有哪些属性
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      // 前面的Promise是resolve时，会调用 onFulfilled
      // 那么then的新Promise也resolve
      // typeof onFulfilled !== 'function' && (onFulfilled = resolve);
      if (typeof onFulfilled !== "function") onFulfilled = resolve;
      if (typeof onRejected !== "function") onRejected = reject;
      if (this.status === "pending") {
        this.callback.push({
          onFulfilled: () => {
            setTimeout(() => {
              try {
                const result = onFulfilled.call(undefined, this.value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          },
          onRejected: () => {
            setTimeout(() => {
              try {
                const result = onRejected.call(undefined, this.value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          },
        });
      }
      if (this.status === "fulfilled") {
        setTimeout(() => {
          try {
            const result = onFulfilled.call(undefined, this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === "rejected") {
        setTimeout(() => {
          try {
            const result = onRejected.call(undefined, this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
  resolve(value) {
    if (this.status !== "pending") return;
    if (value === this)
      throw new TypeError("Chaining cycle detected for promise");
    if (value instanceof Object) {
      const then = value.then;
      if (typeof then === "function") {
        return then.call(
          value,
          this.resolve.bind(this),
          this.reject.bind(this)
        );
      }
    }
    this.status = "fulfilled";
    this.value = value;
    // 如果回调函数数组中有值，说明之前执行过then，需要调用then接受的函数
    this.callback.forEach((callback) =>
      callback.onFulfilled.call(undefined, value)
    );
  }
  reject(reason) {
    if (this.status !== "pending") return;
    if (reason === this)
      throw new TypeError("Chaining cycle detected for promise");
    if (reason instanceof Object) {
      const then = reason.then;
      if (typeof then === "function") {
        return then.call(
          reason,
          this.resolve.bind(this),
          this.reject.bind(this)
        );
      }
    }
    this.status = "rejected";
    this.value = reason;
    this.callback.forEach((callback) =>
      callback.onRejected.call(undefined, reason)
    );
  }
  // 静态方法在程序开始时生成内存，实例方法在程序运行过程中生成内存
  // 所以静态方法可以直接调用，实例方法要先生成示例，通过实例调用方法，静态速度很快，但多了会产生内存
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      if (reason instanceof Promise) {
        reason.then(resolve, reject);
      } else {
        reject(reason);
      }
    });
  }
  static all(promiseArr) {
    return new Promise((resolve, reject) => {
      const results = [];
      promiseArr.forEach((promise) =>
        promise.then(
          (value) => {
            results.push(value);
            if (results.length === promiseArr.length) resolve(results);
          },
          (err) => reject(err)
        )
      );
    });
  }
  static race(promiseArr) {
    return Promise((resolve, reject) =>
      promiseArr.forEach((promise) => promise.then(resolve, reject))
    );
  }
}
```

### async 实现

await 是让出线程的标志。await 后面的表达式会先执行一遍，将 await 后面的代码加入到 microtask 中，然后就会跳出整个 async 函数来执行后面的代码

```js
function asyncToGenerator(generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments);
    // 返回一个Promise因为外部时用.then的方式,或者await的方式去使用这个函数的返回值的
    //var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数,用来跨越yield的阻碍
      // key有next和throw两种取值,分别对应了gen的next和throw
      // args 用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
        let generatorResult;
        // 报错就把Promise给reject掉,外部可以通过reject获取到错误
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }
        const { value, done } = generatorResult;
        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是最后一次调用next后才会为true
          // 如果是{done: true, value: 'success'},
          // value也就是generator函数最后的返回值
          return resolve(value);
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回{value:promise,done:false}
          // !注意promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(value).then(
            // value 这个promise被resolve的时候，执行next
            // 只要done不是true的时候，就会递归的往下解开promise。在done为true了，整个promise被resolve了
            function onResolved(val) {
              step("next", val);
            },
            // 如果promise被reject了，就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw（err）
            // 被catch到后，把promise给reject掉
            function onRejected(err) {
              step("throw", err);
            }
          );
        }
      }
      step("next");
    });
  };
}
```

## LRU（least Recently Used)实现

如果数据被访问过，那么将发来被访问的几率也高

### 数组 + 对象实现

```js
class LRUCache {
  constructor(capacity) {
    this.keys = [];
    this.cache = Object.create(null);
    this.capacity = capacity;
  }
  get(key) {
    if (this.cache[key]) {
      remove(this.keys, key);
      this.keys.push(key);
      return this.cache[this];
    }
    return false;
  }
  put(key, value) {
    if (this.cache[key]) {
      this.cache[key] = value;
      remove(this.keys, key);
      this.keys.push(key);
    } else {
      this.keys.push(key);
      this.cache[key] = value;
      if (this.keys.length > this.capacity)
        removeCache(this.cache, this.keys, this.keys[0]);
    }
  }
}
function remove(arr, key) {
  if (arr.length) {
    const index = arr.findIndex((item) => item === key);
    if (index > -1) arr.splice(index, 1);
  }
}
function removeCache(cache, keys, key) {
  cache(key) = null;
  remove(keys, key);
}
```

### Map 实现

```js
class LRUCache {
  constructor(capacity, cache = new Map()) {
    this.$cache = cache;
    this.$capacity = capacity;
  }
  get(key) {
    if (this.$cache.has(key)) {
      let temp = this.$cache.get(key);
      this.$cache.delete(key);
      this.$cache.set(key, temp);
      return temp;
    }
    return false;
  }
  put(key, value) {
    this.$cache.set(key, value);
    if (this.$cache.has(key)) this.$cache.delete(key);
    else if (this.$cache.size >= this.$capacity)
      this.$cache.delete(this.$cache.keys().next().value);
  }
}
```

## 排序算法

### 快排

```JS
function quickSort(arr, start = 0, end = arr.length - 1){
  let pos = start - 1
  let pivot = arr[end]
  if(start<end){
    for(let i = start; i<= end; i++){
      if(arr[i] <= pivot){
        let temp = arr[i]
        pos++
        arr[i] = arr[pos]
        arr[pos] = temp
      }
    }
    quickSort(arr, start, pos - 1)
    quickSort(arr, pos + 1, end)
  }
  return arr
}
```

### 归并排序

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const midIndex = arr.length / 2 || 0,
    leftArr = arr.slice(0, midIndex),
    rightArr = arr.slice(midIndex, arr.length);
  return merger(mergeSort(leftArr), mergeSort(rightArr));
}
function merger(leftArr, rightArr) {
  const result = [];
  while (leftArr.length && rightArr.length) {
    leftArr[0] <= rightArr[0]
      ? result.push(leftArr.shift())
      : result.push(rightArr.shift());
  }
  while (leftArr.length) result.push(leftArr.shift());
  while (rightArr.length) result.push(rightArr.shift());
  return result;
}
```

## 防抖和节流函数

### 函数防抖

函数防抖是在事件被触发 n 秒后再执行回调，如果在 n 秒内又被触发，则重新计时。函数防抖多用于 input 输入框

- 箭头函数继承自父级上下文,这里指触发事件的目标元素
- 事件被触发时,传入`event`对象
- leading 参数,判断是否可以立即执行回调函数,不必等到事件停止触发后才开始执行
- 回调函数可以有返回值,需要返回执行结果

```js
/**
 * @param {Function} fn 需要防抖的回调函数
 * @param {Number} wait 间隔时间
 * @param {boolean} leading 是否立即执行回调函数
 */
const debounce = (fn, wait = 300, leading = true) => {
  let timeId, result;
  return function (...args) {
    timeId && clearTimeout(timeId);
    if (leading) {
      if (!timeId) result = fn.apply(this, args);
      timeId = setTimeout(() => (timeId = null), wait);
    } else {
      timeId = setTimeout(() => (result = fn.apply(this, args)), wait);
    }
    return result;
  };
};
```

### 函数节流

函数节流是指连续触发事件,但在 n 秒内只执行一次函数,适合应用于动画相关的场景

#### 定时器

```js
const throttle = (fn, wait = 300) => {
  let timeId;
  return function (...args) {
    if (!timeId) {
      timeId = setTimeOut(() => {
        timeId = null;
        return (result = fn.apply(this, ...args));
      }, wait);
    }
  };
};
```

#### 时间戳

```js
const throttle = (fn, wait = 300) => {
  let prev = 0,
    result;
  return function (...args) {
    let now = +new Date();
    if (now - prev > wait) {
      prev = now;
      return (result = fn.apply(this, ...args));
    }
  };
};
```

| 方法       | 使用时间戳   | 使用定时器       |
| ---------- | ------------ | ---------------- |
| 开始触发时 | 立即执行     | n 秒后执行       |
| 停止触发后 | 不再执行事件 | 继续执行这一事件 |

#### 二合一精装

```js
/**
 * @param {Function} fn 需要防抖的回调函数
 * @param {Number} wait 间隔时间
 * @param {boolean} first 开始触发时是否立即执行
 * @param {boolean} last 停止触发时是否继续执行,与first不呢同时设置为false
 **/
const throttle = (
  fn,
  wait = 300,
  { first = true, last = true } = {},
  ...args
) => {
  let timeId,
    args,
    prev = 0;
  const later = (args) => {
    timeId && clearTimeout(timeId);
    timeId = setTimeout(() => {
      timeId = null;
      fn.apply(this, args);
    }, wait);
  };
  return function () {
    let now = Date.now();
    let remaining = wait - (now - prev);
    if (!prev && first === false) prev = now;
    if (!first) return later(args);
    if (remaining <= 0 || remaining > wait) {
      fn.apply(this, args);
      prev = now;
    } else if (!timeId && last) later(args);
  };
};
```

## 事件委托

```js
function delegate(element, elementType, selector, fn) {
  element.addEventListener(
    eventType,
    (e) => {
      let el = e.target;
      while (!el.matches(selector)) {
        if (element === el) {
          el = null;
          break;
        }
        el = el.parentNode;
      }
      el && fn.call(el, e, el);
    },
    true
  );
  return element;
}
```

## 实现可拖拽的 div

```js
var dragging = false,
  position;
xxx.addEventListener("mousedown", (e) => {
  dragging = true;
  position = [e.clientX, e.clientY];
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const x = e.clientX;
  const y = e.clientY;
  const deltaX = x - position[0];
  const deltaY = y - position[1];
  const left = parseInt(xxx.style.left || 0);
  const top = parseInt(xxx.style.top || 0);
  xxx.style.left = left + deltaX + "px";
  xxx.style.top = top + deltaY + "px";
  position = [x, y];
});
document.addEventListener("mouseup", function (e) {
  dragging = false;
});
```

## 深拷贝

```js
const isType = (type) => (obj) =>
  Object.prototype.toString.call(obj) === `[object ${type}]`;
const isArray = isType("Array");
const isNull = isType("Null");
const isFunction = isType("Function");
const isDate = isType("Date");
const isRegExp = isType("RegExp");

const deepClone = (obj, map = new Map()) => {
  if (typeof obj !== "object" || isNull(obj) || isDate(obj) || isRegExp(obj))
    return obj;
  if (map.has(obj)) return map.get(obj);
  const res = isArray(obj) ? [] : {};
  map.set(obj, res);
  Reflect.ownKeys(obj).forEach((key) => (res[key] = deepCopy(obj[key], map)));
  return res;
};
```

## 实现 sleep

某个时间后执行某个函数,感觉可以直接用 async 写

```js
const sleep = (cb, time = 300) =>
  new Promise((resolve, reject) => setTimeout(() => resolve(cb), time));
```

## 参考

- [underscore 函数节流的实现](https://github.com/lessfish/underscore-analysis/issues/22)
