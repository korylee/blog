---
title: Vue3响应式原理
date: 2021-02-28
tags:
  - vue
categories:
  - frontEnd
# publish: false
---

## ref

ref 常用于基本类型，reactive 用于引用类型。如果 ref 传入对象，其实内部会自动变成 reactive。<br/> ref 本质是把 js 基本类型(string/number/bool)包装为引用对象,使得具有响应式特性。

```ts
const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val;

export function ref(raw: unknown) {
  if (isRef(raw)) return raw;
  raw = convert(raw);
  // 基本类型,转为含有getter/setter的对象
  const r = {
    _isRef: true,
    //基本类型无法被追踪,所以使用ref包装为object,使得可以被追踪
    get value() {
      track(r, OperationTypes.Get, "");
      return raw;
    },

    set value(newVal) {
      raw = convert(newVal);
      trigger(r.OperationTypes.Set, "");
    },
  };
  return r as Ref;
}
```

同时 ref 支持 reactive 转为 ref 对象-- toRefs

```ts
export function toRefs<T extends object>(
  obj: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {};
  //for in 展开一层
  for (const key in object) {
    ret[key] = toProxyRef(obj, key);
  }
}
function toProxyRef<T extends object, K extends keyof T>(
  obj: T,
  key: K
): Ref<T[K]> {
  return {
    _isRef: true,
    get value(): any {
      return obj[key];
    },
    set value(newVal) {
      obj[key] = newVal;
    },
  };
}
```

## reactive

先认识下以下 4 个全局存储,使用 weakmap 存储起普通对象和生成的响应式对象，因为很多地方都需要用到判断以及取值。其中 rawToReactive 和 reactiveToRaw 是一组，只不过 key 和 value 互相对调。

```ts
// 防止重复设置响应式对象,建立store存起来
// WeakMaps that store {raw <.> observed} pairs
const rawToReactive = new WeakMap<any, any>(); // 原始object对象:封装的响应式对象
const reactiveToRaw = new WeakMap<any, any>(); // 封装的响应式对象: 原始object对象
// 只读响应式
const rawToReadonly = new WeakMap<any, any>();
const readonlyToRaw = new WeakMap<any, any>();
```

下面是 reactive 入口，如果传入参数是只读响应式，或者是用户设置的只读类型，返回处理。大部分都会走 createReactiveObject()方法:

```ts
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version
  if (readonlyToRaw.has(target)) {
    return target;
  }
  // target is explicitly marked as readonly bu user
  if (readonlyValues.has(target)) {
    return readonly(target);
  }
  // 给普通对象创建响应式对象
  return createReactiveObject(
    target,
    rawToReactive,
    reactiveToRaw,
    mutableHandlers,
    mutableCollectionHandlers
  );
}
function createReactiveObject(
  target: unknown, //原始对象
  toProxy: WeakMap<any, any>, // 全局rawToReactive
  toRaw: WeakMap<any, any>, //全局reactiveToRaw
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  // 重复的对象引用,最终都返回初始的监听对象,这就是创建全局store的原因之一
  // target already has corresponding proxy
  let observed = toProxy.get(target);
  if (observed !== void 0) {
    return observed;
  }
  // target is already a proxy
  if (toRaw.has(target)) return target;
  // vue 对象、vnode对象等不能被创建为响应式
  //  only a whitelist of value types can be observed
  if (!canObserve(target)) return target;

  // 真正的创建代理Proxy对象并返回
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers // [Set, Map, WeakMap, WeakSet]对象走这个handles
    : baseHandlers; // 大部分走baseHandle
  observed = new Proxy(target, handlers);
  // 创建完马上全局缓存
  toProxy.set(target, observed);
  toRaw.set(observed.target);
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map());
  }
  return observed;
}
```

所以还得看代理对象 mutableHandlers 中的处理

```ts
export const mutableHandlers: ProxyHandler<object> = {
  get: createGetter(false),
  set,
  deleteProperty,
  has,
  ownKeys,
};
```

get、has、deleteProperty、ownKeys 代理方法中，都调用了 track 函数，用来收集依赖的；而 set 调用了 trigger 函数，当响应式数据变化时，手机的以来被执行回调。从原理看，这跟 vue2.x 是一致的

get 中除常规边界处理外，最重要的是根据代理值的类型，**对 object 类型进行递归调用 reactive。**

```ts
function createGetter(isReadonly: boolean) {
  return function get(target: object, key: string | symbol, receiver: object) {
    // 获取到代理的值
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) && builtInSymbols.has(key)) {
      return res;
    }
    // 如果是ref包裹的对象，直接返回解包后的值
    if (isRef(res)) {
      return res.value;
    }
    // track 是逻辑和视图变化最重要的一块
    track(target, OperationTypes.Get, key);
    // 值类型，直接返回值；对象类型，递归响应式
    return isObject(res) ? (isReadonly ? readonly(res) : reactive(res)) : res;
  };
}
```

set 函数里除了代理 set 方法外,最重要的莫过于当值改变时,触发 trigger 方法。

```ts
function set(
  target: object,
  key: string | symbol,
  value: unknown,
  receiver: object
) {
  value = toRaw(value);
  const oldValue = (target as any)[key];
  if (isRef(oldValue) && !isRef(value)) {
    olaValue.value = value;
    return true;
  }
  const hadKey = hasOwn(target, key); // 是否target本来就有key属性，等价于key in target
  const result = Reflect.set(target, key, value, receiver);
  if (target === toRaw(receiver)) {
    if (!hasKey) {
      trigger(target, OperationTypes.ADD, key);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, OperationType.SET, key);
    }
    return result;
  }
}
```

## track/trigger

- track 用来收集依赖 deps(依赖一般手机 effect/computed/watch 的回调函数)
- trigger 用于通知 deps, 通知依赖这一状态的对象更新

### 举个例子

使用 effect 和 computed api 时,里面使用了 count.num,意味着这个 effect 依赖于 count.num。当 count.num set 改变值时,需要通知该 effect 去执行。那什么时候 count.num 收集到 effect 这个依赖呢？答案是创建 effect 时的回调函数。如果回调函数中用到响应式数据（意味着会去执行 get 函数），则同步这个 effect 到响应式数据（这里是 count.num）的依赖集中。

其流程是(重点):

1. effect/computed 函数执行
2. 代码有书写响应式数据,调用到 get，依赖收集
3. 当有 set 时，依赖集更新

```ts
const count = reactive({ num: 0 });
// effect默认没带lazy参数，先会执行effect
effect(() => {
  // effect用到对应响应式数据时, count.num get就已经收集好了该effect依赖
  // 同理,使用computed api 时
  console.log(count.num);
});
// computed依赖于count.num，意味着该computed是count.num的依赖项
const computedNum = computed(() => 2 * count.num);
count.num = 7;
```

### 对应源码解释

先挑 effect 实现过程，再来看依赖收集 track 函数和执行函数 trigger。effect api 主要用 effect 包装了回调函数 fn，并默认执行回调函数，最终执行 `run(effect, fn, args)`。

```ts
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) fn = fn.raw;
  // 回调fn函数,包装成effect
  const effect = createReactiveEffect(fn, options);
  // 默认不是懒加载,lazy=false,执行effect函数
  if ((!options, lazy)) {
    effect();
  }
  return effect;
}

function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(...args: unknown[]) {
    return run(effect, fn, args); // 创建effect时,执行run
  } as ReactiveEffect;
  effect._isEffect = true; // 判断是effect
  effect.active = true; // effect支持手动stop, 此时active会被设置为false
  effect.raw = fn;
  effect.scheduler = options.scheduler;
  effect.onTrack = options.oonTrack;
  effect.onTrigger = options.onTrigger;
  effect.onStop = options.onStop;
  effect.computed = options.computed;
  effect.deps = [];
  return effect;
}
```

再看 run 函数内容。其实就是执行回调函数时，先对 effect 入栈，使得 effectStack 有值。这个就非常巧妙，当执行 fn 回调时，回调函数的代码中又会去访问响应式数据（reactive），这样又会执行响应数据的 get()方法，get 方法又会去执行后文讲的 track 方法，track 进行依赖收集。

依赖收集哪些东西呢？就是收集当前的 effect 回调函数。这个回调函数（被 effect 包装）不就是刚被储存在 effectStack 么，所以在后续 track 函数中可以看到使用 effectStack 栈。当执行完回调函数，再进行出栈。

**通过使用栈数据结构，以及对代码执行的时机，非常巧妙的就把当前 effect 传递过去，最终被响应式数据收集到依赖集中。**

```ts
function run(effect: ReactiveEffect, fn: Function, args: unknown[]): unknown {
  if (!effect.active) {
    return fn(...args);
  }
  // 通常都是走这里,执行回调,同时不同时机effect入栈/出栈
  if (!effectStack.includes(effect)) {
    cleanup(effect);
    // 这里的try finally很巧妙
    // 入栈=>回调函数执行(使用栈,相当于把effect传递进入了)=>出栈
    try {
      effectStack.push(effect);
      return fn(...args);
    } finally {
      effectStack.pop();
    }
  }
}
```

再来看看依赖收集 track/trigger 具体实现细节

先来看几个存储变量,主要是依赖收集时用到的

```ts
// the main WeakMap that stores {target=>key=>dep} connections
// Conceptually, It's easier to think of a dependency as a Dep class
// witch maintains a Set of subscribers,but we simply store them as
// raw Sets to reduce memory overhead
export type Dep = Set<ReactiveEffect>;
export type KeyToDepMap = Map<any, Dep>;
// 原始对象: new Map({key1:new Set([effect1,effect2])},{key2:Set2}...)
// key 是原始对象里的属性,值为该key改变后会触发的一系列的函数,比如渲染、computed
export const targetMap = new WeakMap<any, KeyToDepMap>();
```

**track 函数进行数据依赖采集**，以便于后面数据更改能够触发对应的函数。

```ts
// 收集target key的依赖
// get: track(target, OperationTypes.GET, key)
export function track(target: object, type: OperationTypes, key?: unknown) {
  // 定义的computed、effect api都会推入effectStack栈中
  if (!shouldTrack || effectStack.length === 0) {
    return;
  }
  // 调用effect/computed api时，能拿到effect对象（即依赖的回调函数）
  const effect = effectStack[effectStack.length - 1];
  if (type === OperationTypes.ITERATE) {
    key = ITERATE_KEY;
  }
  // targetMap = {target:deps={key1:[],key2:[] }}
  // 初始化target
  let depsMap = targetMap.get(target);
  if (depsMap === void 0) {
    targetMap.set(target, (depsMap = new Map()));
  }
  // 初始化target.key, 键是target.key，值是依赖effect数组，是个集合
  let dep = depMaps.get(key);
  if (dep === void 0) {
    depsMap.set(key!, (dep = new Set()));
  }
  // 依赖收集
  if (!dep.has(effect)) {
    dep.add(effect);
    effect.deps.push(dep);
  }
}
```

trigger，将 track 收集到的 effect 函数集合，添加到 runners 中（二选一放进 effects 或 computedRunners 中），并通过 scheduleRun 执行 effect：

```ts
// set: trigger(target, OperationTypes.SET, key)
export function trigger(
  target: object,
  type: OperationTypes,
  key?: unknown,
  extraInfo?: DebuggerEventExtraInfo
) {
  const depsMap = targetMap.get(target);
  if (depsMap === void 0) {
    // never been tracked
    return;
  }
  // 把拿到的 depsMap.get(key), 二选一放进effects 或 computedRunners 中
  const effects = new Set<ReactiveEffect>(),
    computedRunners = new Set<ReactiveEffect>();
  // 根据不同的OperationTypes, 把effect = depsMap.get(key)放进runners中
  if (type === OperationTypes.CLEAR) {
    // collection being cleared, trigger all effect for target
    depsMap.forEach((dep) => addRunners(effects, computedRunners, dep));
  } else {
    // schedule runs for SET| ADD | DELETE
    if (key !== void 0) {
      addRunners(effects, computedRunners, depsMap.get(key));
    }
    // also run for iteration key on ADD | DELETE
    if (type === OperationType.ADD || type === OperationTypes.DELETE) {
      const iterationKey = Array.isArray(target) ? "length" : ITERATE_KEY;
      addRunners(effects, computedRunners, depMap.get(iterationKey));
    }
  }
  // 执行runners,即执行effects
  const run = (effect: ReactiveEffect) => {
    scheduleRun(effect, target, type, key, extraInfo);
  };
  // Important: computed effects must be run first so that computed getters
  // can be invalidated before any normal effects that depend on them are run.
  computedRunners.forEach(run);
  effects.forEach(run);
}

// 添加runner时，二选一
function addRunners(
  effects: Set<ReactiveEffect>,
  computedRunners: Set<ReactiveEffect>,
  effectsToAdd: Set<ReactiveEffect> | undefined
) {
  if (effectsToAdd !== void 0) {
    effectsToAdd.forEach((effect) => {
      if (effect.computed) {
        computedRunners.add(effect);
      } else {
        effects.add(effect);
      }
    });
  }
}
```

## 总结

响应式数据，就是当数据对象改变时（set），有用到数据对象的地方，都会自动执行响应的逻辑。比如 effect/computed/watch 等 js api 用到数据对象，则执行对应的回调函数。而视图 view 用到数据对象时，则重新 vnode diff，最后自动进行 dom 更新（即视图更新）。

而 Vue3 响应式源码跟 Vue2.x 源码流程基本一致，依然是利用在使用响应式数据时，执行数据的 get 方法，收集相关的依赖（依赖可以是回调函数，如 effect/computed，也可以是视图自动更新）；在数据进行变化的时候，执行数据的 set 方法，把收集的依赖都依次执行。

## 站在巨人肩上

- [Vue3 响应式原理 - Ref/Reactive/Effect 源码分析](https://lq782655835.github.io/blogs/vue/vue3-code-2.reactive.html)
