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
    return fn.call(this instanceof bindFn ? this : context, ...args, ...newArgs);
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

```js
const PROMISE_STATUS = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};
const isFunction = (val) => typeof val === "function";

class MyPromise {
  constructor(executor) {
    if (!isFunction(executor)) {
      throw new Error(`Promise executor ${executor} is not a function`);
    }
    this._status = PROMISE_STATUS.PENDING;
    this._reason = undefined;
    this._result = undefined;
    this._onSuccess = [];
    this._onFail = [];
    const _resolve = (result) => {
      this._status = PROMISE_STATUS.FULFILLED;
      this._result = result;
      this._onFail.length = 0;
      queueMicrotask(() => {
        while (this._onSuccess.length) {
          this._onSuccess.shift()();
        }
      });
    };
    const _reject = (reason) => {
      this._status = PROMISE_STATUS.REJECTED;
      this._reason = reason;
      this._onSuccess.length = 0;
      queueMicrotask(() => {
        while (this._onFail.length) {
          this._onFail.shift()();
        }
      });
    };

    const create = (callback) => (value) => {
      let then;
      if (isFunction(value) || (value !== null && typeof value === "object")) {
        try {
          then = value.then;
        } catch (error) {
          return reject(error);
        }
      }
      if (isFunction(then)) {
        if (value === this) {
          return reject(new TypeError("Chaning cycle detected for promise"));
        }
        let called = false;
        try {
          then.call(
            value,
            (v) => {
              if (called) return;
              called = true;
              resolve(v);
            },
            (e) => {
              if (called) return;
              called = true;
              reject(e);
            }
          );
        } catch (error) {
          if (called) return;
          reject(error);
        }
      } else {
        callback(value);
      }
    };
    const resolve = create(_resolve);
    const reject = create(_reject);
    try {
      executor(resolve, reject);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const onSuccess = () => {
        try {
          const value = isFunction(onFulfilled) ? onFulfilled(this._result) : this._result;
          resolve(value);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      };
      const onFail = () => {
        try {
          isFunction(onRejected) ? reject(onRejected(this._reason)) : reject(this._reason);
        } catch (error) {
          reject(error);
        }
      };
      switch (this._status) {
        case PROMISE_STATUS.FULFILLED:
          queueMicrotask(onSuccess);
          break;
        case PROMISE_STATUS.REJECTED:
          queueMicrotask(onFail);
          break;
        default:
          this._onSuccess.push(onSuccess);
          this._onFail.push(onFail);
          break;
      }
    });
  }

  catch(onRejected) {
    return this.then((_) => _, onRejected);
  }

  finally(onSettled) {
    const illegal = !isFunction(onSettled);
    return this.then(
      (result) => {
        if (illegal) return result;
        return MyPromise.resolve(onSettled()).then(() => {
          return result;
        });
      },
      (reason) => {
        if (illegal) throw reason;
        return MyPromise.resolve(onSettled()).then(() => {
          throw reason;
        });
      }
    );
  }

  static resolve(result) {
    return new MyPromise((resolve) => resolve(result));
  }
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const iterator = iterable[Symbol.iterator]?.();
      if (!iterator) {
        reject(
          TypeError(
            `${typeof iterable} ${iterable} is not Iterable (cannot read property Symbol(Symbol.iterator))`
          )
        );
      }
      const results = [];
      let complete = 0;
      let size = 0;
      let value = undefined;
      let done = false;
      while ((({ done, value } = iterator.next()), !done)) {
        const promise = MyPromise.resolve(value);
        const index = size++;
        promise.then((result) => {
          complete++;
          results[index] = result;
          if (size === complete) {
            resolve(results);
          }
        }, reject);
      }
      if (!size) {
        resolve(results);
      }
    });
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for (const item of iterable) {
        MyPromise.resolve(item).then(resolve, reject);
      }
    });
  }

  static allSettled(iterable) {
    return new MyPromise((resolve) => {
      const iterator = iterable[Symbol.iterator]?.();
      if (!iterator) {
        reject(
          TypeError(
            `${typeof iterable} ${iterable} is not Iterable (cannot read property Symbol(Symbol.iterator))`
          )
        );
      }
      const results = [];
      let complete = 0;
      let size = 0;
      let value = undefined;
      let done = false;
      while ((({ done, value } = iterator.next()), !done)) {
        const promise = MyPromise.resolve(value);
        const index = size++;
        const onFulFilled = (result) => {
          complete++;
          results[index] = {
            status: PROMISE_STATUS.FULFILLED,
            value: result,
          };
          if (size === complete) {
            resolve(results);
          }
        };
        const onRejected = (reason) => {
          complete++;
          results[index] = {
            status: PROMISE_STATUS.REJECTED,
            reason: reason,
          };
          if (size === complete) {
            resolve(results);
          }
        };
        promise.then(onFulFilled, onRejected);
      }
      if (!size) {
        resolve(results);
      }
    });
  }

  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const iterator = iterable[Symbol.iterator]?.();
      if (!iterator) {
        reject(
          TypeError(
            `${typeof iterable} ${iterable} is not Iterable (cannot read property Symbol(Symbol.iterator))`
          )
        );
      }
      const errors = [];
      let complete = 0;
      let size = 0;
      let value = undefined;
      let done = false;
      while ((({ done, value } = iterator.next()), !done)) {
        const promise = MyPromise.resolve(value);
        const index = size++;
        promise.then(resolve, (reason) => {
          complete++;
          errors[index] = reason;
          if (size === complete) {
            reject(new MyAggregateError(errors, "All promises were rejected"));
          }
        });
      }
      // 空数组不会进入上述循环
      if (!size) {
        reject(new MyAggregateError(errors, "All promises were rejected"));
      }
    });
  }

  static map(iterable) {
    return new MyPromise((resolve, reject) => {
      const iterator = iterable[Symbol.iterator]?.();
      if (!iterator) {
        reject(
          TypeError(
            `${typeof iterable} ${iterable} is not Iterable (cannot read property Symbol(Symbol.iterator))`
          )
        );
      }
      const results = [];
      let complete = 0;
      let size = 0;
      let value = undefined;
      let done = false;
      while ((({ done, value } = iterator.next()), !done)) {
        const promise = MyPromise.resolve(value);
        const index = size++;
        promise.then((result) => {
          complete++;
          results[index] = result;
          if (size === complete) {
            resolve(results);
          }
        }, reject);
      }
      if (!size) {
        resolve(results);
      }
    });
  }
}

class MyAggregateError extends Error {
  get name() {
    return "MyAggregateError";
  }
  constructor(errors, message) {
    super(message);
    if (!isFunction(errors[Symbol.iterator])) {
      throw new TypeError(`${typeof errors} ${errors} is not iterable`);
    }
    this.errors = errors;
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
      if (this.keys.length > this.capacity) removeCache(this.cache, this.keys, this.keys[0]);
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
  cache[key] = null;
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
    return undefined;
  }

  put(key, value) {
    if (this.$cache.has(key)) this.$cache.delete(key);
    else if (this.$cache.size >= this.$capacity)
      this.$cache.delete(this.$cache.keys().next().value);
    this.$cache.set(key, value);
  }
}
```

## 排序算法

### 快排

```JS
function quickSort(arr, start = 0, end = arr.length - 1) {
  let pos = start - 1
  let pivot = arr[end]
  if (start < end) {
    for (let i = start; i <= end; i++) {
      if (arr[i] <= pivot) {
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
    leftArr[0] <= rightArr[0] ? result.push(leftArr.shift()) : result.push(rightArr.shift());
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
const throttle = (fn, wait = 300, { first = true, last = true } = {}, ...args) => {
  let timeId,
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
function delegate(element, eventType, selector, fn) {
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
const isType = (type) => (obj) => Object.prototype.toString.call(obj) === `[object ${type}]`;
const isArray = isType("Array");
const isNull = isType("Null");
const isFunction = isType("Function");
const isDate = isType("Date");
const isRegExp = isType("RegExp");

const deepClone = (obj, map = new Map()) => {
  if (typeof obj !== "object" || isNull(obj) || isDate(obj) || isRegExp(obj)) return obj;
  if (map.has(obj)) return map.get(obj);
  const res = isArray(obj) ? [] : {};
  map.set(obj, res);
  Reflect.ownKeys(obj).forEach((key) => (res[key] = deepCopy(obj[key], map)));
  return res;
};
```

## 实现 sleep

```js
const sleep = (time = 300) => new Promise((resolve) => setTimeout(resolve, time));
```

## 发布订阅模式 Mitt

```ts
/**
 * copy to https://github.com/developit/mitt
 * Expand clear method
 */

export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = any> = (event?: T) => void;
export type WildcardHandler = (type: EventType, event?: any) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList = Array<Handler>;
export type WildCardEventHandlerList = Array<WildcardHandler>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap = Map<EventType, EventHandlerList | WildCardEventHandlerList>;

export interface Emitter {
  all: EventHandlerMap;

  on<T = any>(type: EventType, handler: Handler<T>): void;

  on(type: "*", handler: WildcardHandler): void;

  off<T = any>(type: EventType, handler: Handler<T>): void;

  off(type: "*", handler: WildcardHandler): void;

  emit<T = any>(type: EventType, event?: T): void;

  emit(type: "*", event?: any): void;

  clear(): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt(all?: EventHandlerMap): Emitter {
  all = all || new Map();

  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on<T = any>(type: EventType, handler: Handler<T>) {
      const handlers = all?.get(type);
      const added = handlers && handlers.push(handler);
      if (!added) {
        all?.set(type, [handler]);
      }
    },

    /**
     * Remove an event handler for the given type.
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     * @memberOf mitt
     */
    off<T = any>(type: EventType, handler: Handler<T>) {
      const handlers = all?.get(type);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit<T = any>(type: EventType, evt: T) {
      ((all?.get(type) || []) as EventHandlerList).slice().map((handler) => {
        handler(evt);
      });
      ((all?.get("*") || []) as WildCardEventHandlerList).slice().map((handler) => {
        handler(type, evt);
      });
    },

    /**
     * Clear all
     */
    clear() {
      this.all.clear();
    },
  };
}
```

## list-helper

```ts
interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

function listToTree<T = any>(
  list: any[],
  { id = "id", children = "children", pid = "pid" }: Partial<TreeHelperConfig> = {}
): T[] {
  const nodeMap = listToMap(list, (item) => [item[id], item], new Map());
  const result: T[] = [];
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent.children || (parent.children = []) : result).push(node);
  }
  return result;
}

function treeToList<T = any>(
  tree: any,
  { id = "id", children = "children", pid = "pid" }: Partial<TreeHelperConfig> = {}
): T {
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

function findNode<T = any>(
  tree: any,
  func: Fn,
  { children }: Partial<TreeHelperConfig> = {}
): T | null {
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

type ListToMapGetKeyValue = (
  item: T,
  index: number,
  items: T[]
) => { key: string | symbol; value: T | R };

function listToMap<T = any, K = any, V = any, R = Map<K, T | V> | { [K]: T | V } | any>(
  list: T[],
  getKeyAndValue: K | ((acc: R, item: T, index: number, items: T[]) => [K, V]) = "id",
  map: R = {}
): R {
  return list.reduce((acc, cur, curIndex, arr) => {
    const keyValue = isFunction(getKeyAndValue)
      ? getKeyAndValue(acc, cur, curIndex, arr)
      : [Reflect.get(cur, getKeyAndValue), cur];
    if (!keyValue) return acc;
    const [key, value] = keyValue;
    Reflect.set(acc, key, value);
    return acc;
  }, map);
}
```

## promise-helper

### pMap

github 地址: [https://github.com/sindresorhus/p-map](https://github.com/sindresorhus/p-map)

p-map 适用于使用不同的输入多次运行 promise-returning 或 async 函数的场景。

它与 Promise.all 方法的区别是，你可以控制并发，也可以决定是否在出现错误时停止迭代。

```ts
const pMapSkip = Symbol("skip");

async function pMap<T = Promise | any, R = any>(
  iterable: Iterable<T>,
  mapper: (item, index) => R,
  {
    concurrency = Number.POSITIVE_INFINITY,
    stopOnError = true,
  }: {
    concurrency?: number; //—— 并发数，默认值 Infinity，最小值为 1；
    stopOnError?: boolean; //出现异常时，是否终止，默认值为 true。
  } = {}
): Promise<R> {
  return new Promise((resolve, reject) => {
    const result = [];
    const errors = [];
    const skippedIndexes = [];
    const iterator = iterable[Symbol.iterator]();
    let isRejected = false;
    let isIterableDone = false;
    let resolvingCount = 0;
    let currentIndex = 0;

    const next = () => {
      if (isRejected) return;
      const nextItem = iterator.next();
      const index = currentIndex;
      currentIndex++;
      if (nextItem.done) {
        isIterableDone = true;
        if (resolvingCount === 0) {
          if (stopOnError && errors.length > 0) {
            reject(errors);
          } else {
            skippedIndexes.sort((a, b) => b - a);
            for (const skippedIndex of skippedIndexes) {
              result.splice(skippedIndex, 1);
            }
            resolve(result);
          }
        }
        return;
      }
      resolvingCount++;
      (async () => {
        try {
          const element = await nextItem.value;
          if (isRejected) return;
          const value = await mapper(element, index);
          if (value === pMapSkip) {
            skippedIndexes.push(index);
          } else {
            result[index] = value;
          }

          resolvingCount--;
          next();
        } catch (e) {
          if (stopOnError) {
            isRejected = true;
            reject(e);
          } else {
            errors.push(e);
            resolvingCount--;
            next();
          }
        }
      })();
    };
    for (let index = 0; index < concurrency; index++) {
      next();
      if (isIterableDone) break;
    }
  });
}
```

#### 用法

它提供了一个 pMapSkip, 可以直接移除对应索引值

```ts
const inputs = [200, 100, pMapSkip];
const mapper = (value) => delay(value, { value });

async function main() {
  console.time("start");
  const result = await pMap(inputs, mapper, { concurrency: 1 });
  console.dir(result); // 输出结果：[ 200, 100 ]
  console.timeEnd("start"); //start: 368.708ms
}

main();
```

而当把 concurrency 属性的值更改为 2 之后，再次执行以上代码。那么命令行将会输出以下信息：

```shell
[ 200, 100 ]
start: 210.322ms
```

### pAll

该模块提供的功能，与 Promise.all API 类似

主要的区别是该模块允许你限制任务的并发数。 如果数组里有函数且 runInFunction 为 true, 可以自动帮你执行

```ts
async function pAll(
  iterable,
  { runInFunction = true, concurrency = Number.POSITIVE_INFINITY, stopOnError = true } = {}
) {
  return pMap(
    iterable,
    (element) => {
      if (!runInFunction) return element;
      return isFunction(element) ? element() : element;
    },
    { concurrency, stopOnError }
  );
}
```

#### 用法

```ts
const inputs = [
  () => delay(200, { value: 1 }),
  async () => {
    await delay(100);
    return 2;
  },
  async () => 8,
];

async function main() {
  console.time("start");
  const result = await pAll(inputs, { concurrency: 1 });
  console.dir(result); // 输出结果：[ 1, 2, 8 ]
  console.timeEnd("start");
}

main();
```

### awaitTo

try-catch 包裹器(异步)

```ts
import $loading from "loading";

function to(
  promise: Promise,
  {
    notifyError = true,
    errorExt = {},
    notifyOptions = {},
    initialValue = undefined,
    loading = false,
  }?: {
    notifyError?: boolean | string;
    notifyOptions?: any;
    errorExt?: any;
    initialValue?: any;
    loading?: boolean;
  } = {}
): Promise<[Error, any]> {
  loading && $loading.show();
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (errorExt) Object.assign(err, errorExt);
      if (notifyError) {
        notifyErrorByHttpCode(isString(notifyError) ? notifyError : err, notifyOptions);
        console.warn(err);
      }
      return [err, initialValue];
    })
    .finally(() => {
      loading && $loading.hide();
    });
}
```

#### 用法

```ts
const [err, { data }] = await awaitTo(request.get(``));
```

### cached

函数返回值缓存是优化一个函数的常用手段。(同步, 异步皆可)
我们可以将函数、输入参数、返回值全部保存起来，当下次以同样的参数调用这个函数时，直接使用存储的结果作为返回(不需要重新计算)。

这种方法是有代价的，我们实际是在用内存空间换取运行时间。此方法中使用了 LRUCache(Least Recently Used, 最近最少使用)来优化存储空间

> 注意: 如果是请求, 请谨慎使用, 如果前端的数据和后端数据不一致,请求还一直拿缓存的值就玩大发了
> 例如像类目列表, 品牌列表等很久才会更新, 请求频率高且数据量大的才考虑用(ps: 整个协商缓存多好, 还得前端在这想办法)

```ts
const generateKey = (arg) => {
  if (isString(arg)) return arg;
  else if (Array.isArray(arg))
    return arg.reduce((acc, cur) => (acc ? `${acc},${generateKey(cur)}` : generateKey(cur)), "");
  else if (isRealObject(arg)) {
    const keys = Object.keys(arg).sort();
    const res = keys.reduce((acc, cur) => {
      const value = arg[cur];
      return acc ? `${acc},${cur}=${generateKey(value)}` : `${cur}=${generateKey(value)}`;
    }, "");
    return `{${res}}`;
  }
  return String(arg);
};

export function cached<T>(func: T, capacity: number = 100): T {
  const cache = new LRUCache(capacity);
  return async function (...args) {
    const key = generateKey(args);
    const target = cache.get(key);
    if (target) {
      if (!target?.then) return target;
      const [err, data] = await to(target);
      if (!err) return data;
    }
    const result = func(...args);
    cache.put(key, result);
    return result;
  };
}
```

#### 用法

```ts
const getData = () => request.get(``);
const cacheGetData = cached(getData);
cacheGetData();
//cacheGetData 与 detData 行为一致
```

## 参考

- [underscore 函数节流的实现](https://github.com/lessfish/underscore-analysis/issues/22)
