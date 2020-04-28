---
title: Promise、async的实现
date: 2020-04-22
tags:
  - Js
  - 学习笔记
categories:
  - frontEnd
publish: falsex
---

## promise

```js
class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') throw new TypeError(`Promise resolver ${executor} is not a function`);
    this.status = 'pending';
    this.value = null;
    this.callback = [];
    try {
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
      if (typeof onFulfilled !== 'function') onFulfilled = resolve;
      if (typeof onRejected !== 'function') onRejected = reject;
      if (this.status === 'pending') {
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
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const result = onFulfilled.call(undefined, this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === 'rejected') {
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
    if (this.status !== 'pending') return;
    if (value === this) throw new TypeError('Chaining cycle detected for promise');
    if (value instanceof Object) {
      const then = value.then;
      if (typeof then === 'function') {
        return then.call(value, this.resolve.bind(this), this.reject.bind(this));
      }
    }
    this.status = 'fulfilled';
    this.value = value;
    // 如果回调函数数组中有值，说明之前执行过then，需要调用then接受的函数
    this.callback.forEach((callback) => callback.onFulfilled.call(undefined, value));
  }
  reject(reason) {
    if (this.status !== 'pending') return;
    if (reason === this) throw new TypeError('Chaining cycle detected for promise');
    if (reason instanceof Object) {
      const then = reason.then;
      if (typeof then === 'function') {
        return then.call(reason, this.resolve.bind(this), this.reject.bind(this));
      }
    }
    this.status = 'rejected';
    this.value = reason;
    this.callback.forEach((callback) => callback.onRejected.call(undefined, reason));
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
      promiseArr.forEach((promise) => {
        promise.then((value) => {
          results.push(value);
          if (results.length === promiseArr.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }
  static race(promiseArr) {
    return Promise((resolve, reject) => promiseArr.forEach((promise) => promise.then(resolve, reject)));
  }
}
```

### 精简版

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
Promise.prototype.then() = function(onResolved, onRejected) {
  var self = this;
  return new Promise((resolve) => {
    self.callbacks.push(function() {
      var result = typeof onResolved === 'function' ? onResolved(self.data) : self.data;
      if (result instanceof Promise) resolve.then(result);
      else resolve(result);
    });
  });
};
```

## async

```js
function asyncToGenerator(generatorFunc) {
  return function() {
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
              step('next', val);
            },
            // 如果promise被reject了，就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw（err）
            // 被catch到后，把promise给reject掉
            function onRejected(err) {
              step('throw', err);
            }
          );
        }
      }
      step('next');
    });
  };
}
```
