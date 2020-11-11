---
title: vue-next(vue3.0)上手
date: 2020-04-28
tags:
  - vue
categories:
  - frontEnd
# publish: false
---

## Example

:::details Rocket game by vue3.0

<iframe height="980" style="width: 100%;" scrolling="no" title="Rocket game By vue3.0" src="https://codepen.io/kory-lee/embed/bGVvxNX?height=265&theme-id=dark&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/kory-lee/pen/bGVvxNX'>Rocket game By vue3.0</a> by Kory-lee
  (<a href='https://codepen.io/kory-lee'>@kory-lee</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
:::
- [在codepen编辑](https://codepen.io/kory-lee/pen/bGVvxNX)

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

### 类型推导

> TS 还在学...

## `setup()`函数

`setup()`函数会在`beforeCreate`之后、`created`之前

### state

#### 基础类型

使用`ref`这个 api 来声明

在 JavaScript 中,原始类型如`string`和`number`是只有值,没有引用的，是无法追踪原始变量后续的变化的。因此，包装对象的意义就在于提供一个让我们能够在函数之间以应用的方式传递任意类型值的容器。

有了这样的容器，就可以在封装了逻辑的组合函数中将状态以应用的方式传给组件。组件负责展示（追踪依赖），组合函数负责管理状态（触发更新）

```js
setup(props, context){
    // x,y 可能被 useMouse() 内部的代码修改从而触发更新
    const {x,y} = useMouse();
    return { x, y }
}
```

包装对象也可以包装非原始类型的数据，被包装的对象中嵌套的属性都会被响应式的追踪。

被包装的数组或对象并不是没有意义的：它可以让我们对整个对象的值进行替换--比如用一个`filter`去替换原数组

```js
const numbers = ref([1, 2, 3]);
// 替换原数组，但引用不变
number.value = number.value.filter((n) => n > 2);
```

:::warning 注意
包装对象暴露给模板上下文，或是被嵌套在另一个响应式对象的时候，他会被自动展开为内部的值
:::

#### 引用类型

除了使用`ref`外,也可以直接使用`reactive`来声明

##### 接收 props 数据

- 在 props 中定义当前组件允许外界传递过来的参数名称
- 通过`setup`函数的第一个形参,接收`props`数据

```js
props:{
  age:Number
}
setup(props){
  console.log('props.age',props.age)
  watch(()=>props.age,(value,oldValue)=> console.log(`form ${oldValue} to ${value}`))
}
```

除此之外,还可以直接通过 watch 方法来观察某个`prop`的变动,这是为什么呢? 因为 props 本身在源码中,也是一个被`reactive`包裹后的对象,因此也具有响应性,所以在`watch`方法中的回调函数会自动收集依赖,之后但`age`变动的时候,会自动调用这些回调逻辑

##### context

`setup`函数的第二个参数是一个上下文对象,这个对象包含了一些有用的属性,这些属性在 vue2.x 中需要通过`this`才能访问到,而在 vue3.0 中,**`setup()`函数访问不到`this`**,则要通过:

```js
setup(props,context){
  context.attrs
  context.slots
  context.parent
  context.root
  context.emit
  context.refs
}
```

## Reactivity APIs

### `reactive()`函数

`reactive()`函数接受一个普通对象,返回一个响应式的函数对象

#### 基本语法

等价于`vue2.x`中的`Vue.observable()`函数,`vue 3.0`中提供了`reactive`函数,用来创建响应式的数据对象

```js
const state = reactive({ name: 'kory' });
```

#### 定义响应式数据供 template 使用

```js
// 1. 按需导入 reactive 函数

// 2. 在`setup()`函数中调用`reactive`函数,创建响应式数据对象
const {reactive} = vue
setup(props,context){
  const state= reactive({name: 'kory'})
  return state
};
// 3. 在`template`中访问响应式数据
template: `<button>名字是: {{name}}</button>`
```

### `ref()`函数

`ref()`函数用来根据给定的值创建一个响应式的数据对象,ref 函数调用的返回值是一个对象,这个对象只包含一个`.value`属性

#### 基本语法

```js
const age = ref(3);
age.value++;
console.log(age.value);
```

#### 在 template 中访问 ref 创建的响应式数据

```js
setup(){
  const age = ref(3)
  return {
    age,
    name: ref('mi')
  }
}
// 在template中访问响应式数据
template: `<p>名字是:{{name}},年龄是: {{age}}</p>`
```

#### 在 reactive 对象中访问 ref 创建的响应式数据

把`ref()`创建的响应式对象,挂载在`reactive()`上时,会自动把响应式数据对象展开为原始的值,不需要通过`.value`就可以访问

```js
// 当一个包装对象被作为另一个响应式对象的属性引用的时候也会被自动展开
const age = ref(3);
const state = reactive({ age });
state.age++;
console.log(state.age); // 4
```

在实际使用中,**只有以变量的形式引用一个包装对象的时候才会需要用`.value`去取它内部的值**----在模板中甚至不需要知道它们的存在

:::warning 注意
新的 ref 会覆盖旧的 ref，
:::

```js
// 创建 ref 并挂载到 reactive 中
const c1 = ref(0);
const state = reactive({
  c1,
});

// 再次创建 ref，命名为 c2
const c2 = ref(9);
// 将 旧 ref c1 替换为 新 ref c2
state.c1 = c2;
state.c1++;

console.log(state.c1); // 输出 10
console.log(c2.value); // 输出 10
console.log(c1.value); // 输出 0
```

#### `isRef()`函数

`isRef`用来判断某个值是否为`ref()`创建出来的对象,

#### `unref()`

如果参数是 ref,则返回内部值,否则返回参数本身。

```js
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
```

#### `toRef`

可用将 `reactive` 对象上的属性转换为 `Ref` 对象,并保留其响应式链接

```js
const state = reactive({
  foo: 1,
  bar: 2,
});
const fooRef = toRef(state, 'foo');
fooRef.value++;
console.log(state.foo); //2
state.foo++;
console.log(fooRef.value); //3
```

`toRef`可以将 props 的 ref 传递给 composition 函数

```js
setup(props){
  useSomeFeature(toRef(props,'foo'))
}
```

##### 源码

```js
function toRef(object, key) {
  return {
    _isRef: true,
    get value() {
      return object[key];
    },
    set value(newVal) {
      object[key] = newVal;
    },
  };
}
```

#### `toRefs()`函数

将 reactive 对象转换成普通对象, 它的每一个属性都是一个 ref 对象,并指向源对象的相应属性

> **原文:**Convert a reactive object to a plain object, where each property on the resulting object is a ref pointing to the corresponding property in the original object.
> 怎么翻译都好像差点意思,英语水平太差了,淦

```js
const state = reactive({ foo: 1, bar: 2 });
const stateAsRefs = toRefs(state);
/*
{
  foo: Ref<number>,
  bar: Ref<number>
}
*/
// The ref and the original property is "linked"
state.foo++;
console.log(stateAsRefs.foo); // 2

stateAsRefs.foo.value++;
console.log(state.foo); // **3**
```

`toRefs`从组合函数返回响应式对象时很有用,以便于组件解构赋值时而不会失去响应性

> toRefs is useful when returning a reactive object from a composition function so that the consuming component can destructure / spread the returned object without losing reactivity:

```js
function useFeatureX() {
  const state = reactive({ foo: 1, bar: 2 });
  // 返回时转换成refs
  return toRefs(state);
}

export default {
  setup() {
    // 解构赋值不丢失响应性
    const { foo, bar } = useFeatureX();

    return {
      foo,
      bar,
    };
  },
};
```

或者可以直接这样:

```js
setup(){
  const state = reactive({age:3})
  return{
    ...toRefs(state)
  }
}
```

##### 源码

```js
function toRefs(object) {
  const ret = {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
```

### `computed()`函数

在调用`computed()`函数期间,传入一个包含`get`和`set`函数的对象,可以得到一个可读可写的计算属性

```js
const count = ref(1);
// 利用computed创建一个  响应式的计算属性
// 会根据依赖的ref自动计算并返回一个新的ref
const plusOne = computed({
  // 取值函数
  get: () => count.value + 1,
  // 赋值函数
  set: (val) => {
    count.value = val - 1;
  },
});

// 为计算属性赋值的操作，会触发 set 函数
plusOne.value = 9;
// 触发 set 函数后，count 的值会被更新
console.log(count.value); // 输出 8
```

- Typing
  ```ts
  function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>;
  function computed<T>(option: { get: () => T; set: (value) => void }): Ref<T>;
  ```

#### readonly

接收一个对象或一个 ref,得到一个只读对象。只读的代理是深度的：任何被访问的嵌套的属性都是只读的

```js
const original = reactive({ count: 0 });
const copy = readonly(original);

watchEffect(() => {
  // works for reactivity tracking
  console.log(copy.count);
});

// mutating original will trigger watchers relying on the copy
original.count++;
// mutating the copy will fail and result in a warning
copy.count++; // warning!
```

### `watch()`函数

用于监视某些数据项的变化，从而触发某些指定的操作

```js
const state = reactive({ name: 'kory' });
// 监视`reactive`类型的数据源
watch(
  () => state.name,
  (value, oldValue) => console.log(`from ${oldValue} to ${value}`)
);
const count = ref(0);
watch(count, (value, oldValue) => console.log(`from ${oldValue} to ${value}`));
```
#### 监视多个数据源

```js
const state = reactive({ name: 'ming', age: 13 });
watch(
  [() => state.name, () => state.age],
  ([age, name], [prevAge, prevName]) => console.log(`from ${prevName}:${prevAge} to ${Name}: ${age}`),
  { lazy: true } // watch被创建的时候,不执行回调代码
);
setTimeout(() => {
  state.name = 'Ning';
  state.age = 18;
});
```

#### 清除监视

在`setup()`函数内创建的`watch`监视,会在当前组件被销毁的时候停止。如果想要明确的停止某个监视，可以调用`watch`函数的返回值即可

```js
// 创建监视，并得到停止函数
const stop = watch(() => {});
// 调用停止函数，清除对应监视
stop();
```

#### 在 watch 中清除无效的异步任务

有时候，当`watch`监视的值发生变化时，或`watch`本身被`stop`之后,我们期望能够清除那些无效的异步任务,此时,`watch`回调函数中提供一个`cleanup registration function`来执行清楚的工作.这个清除函数会在以下情况下被调用

- watch 被重复执行了
- watch 被强制 stop 了

```html
<input type="text" v-model="keywords" />
```

```js
const keywords = ref('');
const asyncPrint = (val) => {
  // 延迟1秒后打印
  return setTimeout(() => console.log(val), 1000);
};
watch(
  keywords,
  (keywords, preKeywords, onCleanup) => {
    const timeId = asyncPrint(keywords);
    // keywords发生了变化,或是watcher即将被停止
    // 取消还未完成的异步操作
    // 如果watch被重复执行了,则会先清除上次未完成的异步任务
    onCleanup(() => clearTimeout(timeId));
  },
  { lazy: true }
);
return { keywords };
```

之所以要用传入的注册函数来清理函数，而不是像 React 的`useEffect`那样直接返回一个清理函数,是因为`watch`回调的返回值在异步场景下有特殊作用。我们经常需要在`watch`的回调中用`async function`来执行异步操作

```js
const data = ref(null);
watch(getId, async (id) => {
  data.value = await fetchData(id);
});
```

我们知道`async function`隐形的返回一个 Promise，这样的情况下，我们还是无法返回一个需要立即被注册的清理函数的。除此之外。除此之外，回调返回的 Promise 还会被 Vue 用于内部的异步错误处理

#### Debugging

- 在 `reactive` 或 `ref` 作为依赖项被跟踪时，将调用`onTrack`
- 在依赖项发生变化时触发回调函数，调用 `onTrigger`

:::warning
`onTrack`和`onTrigger`仅仅在开发模式中运行
:::

```js
watchEffect(() => {}, {
  onTrigger(e) {
    debugger;
  },
});
```

### watchEffect

立即执行函数,同时动态地跟踪它的依赖项,并在依赖项发生改变时重新运行它

#### 源码

```js
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
```

:::warning watch 不同于 watchEffect 的地方
`watch`多传入一个回调函数, `doWatch()`源码详情见 watch 部分

- 惰性的
- 更详细地说明触发 watcher 程序重新运行的状态
- 访问被监视状态地先前值和当前值

:::

#### 副作用失效

有时 watchEffect 会执行异步副作用，当其无效时需要对其进行清理（即在完成效果之前更改状态）。 效果函数接收一个 onInvalidate 函数，该函数可用于注册无效回调。

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value);
  invalidate(() => {
    // id改变或stop()时
    // 使以前挂起的回调失效
    token.cancel();
  });
});
```

#### Effect flush timing

Vue 的反应系统缓冲无效，并异步刷新它们，以避免在同一“tick”中发生许多 state 突变时不必要的重复调用。 在内部，组件的更新功能也是受监视的效果。 当用户效果排队时，总是在所有组件更新效果后调用它

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
  export default {
    setup() {
      const count = ref(0);
      watchEffect(() => {
        console.log(count.value);
      });
      return {
        count,
      };
    },
  };
</script>
```

- 在初始时同步记录步数
- 当`count`变化时,将在组件更新后调用回调

:::tip Note
第一次执行实在挂载组件时执行的,因此,如果希望在 watchEffect 中访问 DOM(模板 refs),请在挂载的钩子中执行

```js
onMounted(() => {
  watchEffect(() => {
    // 访问DOM或模板refs
  });
});
```

:::
如果需要同步(`sync`)运行 watchEffect 或在组件更新之前(`pre`)重新运行, 可以传递带有`flush`选项的附加 option 对象(默认`post`)

- type

```ts
function watchEffect(effect: (onInvalidate: InvalidateCbRegistrator) => void, options?: WatchEffectOptions): StopHandle;

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync';
  onTrack?: (event: DebuggerEvent) => void;
  onTrigger?: (event: DebuggerEvent) => void;
}

interface DebuggerEvent {
  effect: ReactiveEffect;
  target: any;
  type: OperationTypes;
  key: string | symbol | undefined;
}

type InvalidateCbRegistrator = (invalidate: () => void) => void;
type StopHandle = () => void;
```

## LifeCycle Hooks 生命周期函数

所有现有的生命周期钩子都有对应的 onXXX 函数(只能在 `setup()`中使用)

```js
const {onMounted, onUpdated, onUnmounted} = Vue
setup(){
  onMounted(()=> console.log('mounted))
  onUpdated(()=> console.log('on updated))
  onUnmounted(()=> console.log('unmounted))
}
```

`vue2.x`的生命周期函数与新版的`composition API`直接关系

- beforeCreate -> setup()
- created -> setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured
  新增 debug hooks
- onRenderTracked
- onRenderTriggered
  功能与 watch 提供地 onTrack 和 onTrigger 类似

```js
export default {
  onRenderTriggered(e) {
    debugger;
    // 检查哪个依赖导致组件重新re-render
  },
};
```

## Advanced Reactivity APIs

### `customRef()`

创建一个能显式地控制依赖项跟踪和更新触发的自定义 ref。它接受一个工厂函数，这个工厂函数接受`track`和`trigger`函数为参数, 并返回带有`get`和`set`的对象

#### example

[在 codepen 中编辑](https://codepen.io/kory-lee/pen/XWmYPWb)

```html
<input v-model="text/>
```

```js
function useDebounceRef(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
export default {
  setup() {
    return {
      text: useDebounceRef('hello'),
    };
  },
};
```

#### 源码

```js
function customRef(factory) {
  const { get, set } = factory(
    () => track(r, 'get' /* GET */, 'value'),
    () => trigger(r, 'set' /* SET */, 'value')
  );
  const r = {
    _isRef: true,
    get value() {
      return get();
    },
    set value(v) {
      set(v);
    },
  };
  return r;
}
```

### `markRaw`

标记一个对象,使它不会转化为 proxy,返回这个对象

- 用于某些不应该被激活的值,比如复杂的第三方实例或 Vue 组件对象
- 对不可变数据源的大型列表时, 跳过性能转换可以提高性能

```js
const foo = markRaw({});
console.log(isReactive(reactive(foo))); // false

// 当嵌套在其他响应式对象时也可以工作
const bar = reactive({ foo });
console.log(isReactive(bar.foo)); // false
```

::: danger
**raw 的 opt-out 只是在根级别**。你仍可以将 raw 对象的嵌套对象设置为一个响应式对象。

- 这可能会导致**身份污染**(identity hazards)--即同时使用同一对象的`proxy`版本与`raw`版本

```js
const foo = markRaw({ nested: {} });
const bar = reactive({
  // 虽然foo被标记为raw,但是foo.nested并不是
  nested: foo.nested,
});
```

要正确地使用这些 api，同时安全地避免 identity hazards，需要对响应式性系统的工作原理有一个深刻的理解。
:::

### `shallowReactive`

```js
const state = shallowReactive({ foo: 1, nested: { bar: 2 } });
// 响应式
state.foo++;
// 不转换嵌套对象
isReactive(state.nested); // false
state.nested.bar++; // non-reactive
```

### `shallowReadonly`

```js
const state = shallowReadonly({ foo: 1, nested: { bar: 2 } });
// fail 不可写
state.foo++;
// 不转换嵌套对象
isReadonly(state.nested); // false
state.nested.bar++; // works可写
```

### `shallowRef`

创建一个 ref 来跟踪其自身的`.value`突变，但不会使其值具有响应性。

```js
const foo = shallowRef({});
// mutating the ref's value is reactive
foo.value = {};
// but the value will not be converted.
isReactive(foo.value); // false
```

### `toRaw()`

返回`reactive`或`readonly`proxy 的 raw、原始对象，这是个转义口，可用于临时读取而不会产生代理访问、跟踪开销

> 原文: Return the raw, original object of a `reactive` or `readonly` proxy. This is an escape hatch that can be used to temporarily read without incurring proxy access / tracking overhead or write without triggering changes. It is not recommended to hold a persistent reference to the original object. Use with caution

```js
const foo = {};
const reactiveFoo = reactive(foo);
console.log(toRaw(reactiveFoo === foo));
```

## provide & inject

provide 和 inject 可以实现嵌套组件之间的数据传递。这两个函数只能在 setup()函数中使用。父组件中使用`provide()`函数向下传递；子级组件使用`inject()`获取上层传递过来的数据

### 源码

```js
function provide(key, value) {
  if (!currentInstance) {
    {
      warn(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    // 默认情况下会继承其父对象的Provide对象,
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.provides;
    if (key in provides) {
      // TS doesn't allow symbol as index type
      return provides[key];
    } else if (arguments.length > 1) {
      return defaultValue;
    } else {
      warn(`injection "${String(key)}" not found.`);
    }
  } else {
    warn(`inject() can only be used inside setup() or functional components.`);
  }
}
```

### 共享普通数据

App.vue 根组件:

```vue
<template>
  <div id="app">
    <h1>App根组件</h1>
    <hr />
    <levelOne />
  </div>
</template>
<script>
  import LevelOne from './component/LevelOne';
  import { provide } from 'vue';
  export default {
    name: 'app',
    setup() {
      // 根组件作为父级组件，通过provide函数向子组件共享数据（不限层级）
      // provide('要共享的数据名称'，被共享的数据)
      provide('globalColor', 'red');
    },
    component: {
      LevelOne,
    },
  };
</script>
```

LevelOne.vue 组件：

```vue
<template>
  <div>
    <h3 :style="{ color: themeColor }">Level</h3>
    <hr />
    <levelTwo />
  </div>
</template>
<script>
  import LevelTwo from './LevelTwo';
  import { inject } from 'vue';
  export default {
    setup() {
      //调用inject函数时，通过指定的数据名称，获取到父级共享的数据
      const themeColor = inject('globalColor');
      return {
        themeColor,
      };
    },
    component: {
      LevelTwo,
    },
  };
</script>
```

LevelTwo.vue 组件：

```vue
<template>
  <div>
    <h5 :style="{ color: themeColor }">Level Two</h5>
  </div>
</template>
<script>
  import { inject } from 'vue';
  export default {
    setup() {
      const themeColor = inject('globalColor');
      return {
        themeColor,
      };
    },
  };
</script>
```

### 共享 ref 响应式数据

如下代码实现了点按钮切换主题颜色的功能，App.vue:

```vue
<template>
  <div id="app">
    <h1>App 根组件</h1>

    <!-- 点击 App.vue 中的按钮，切换子组件中文字的颜色 -->
    <button @click="themeColor = 'red'">红色</button>
    <button @click="themeColor = 'blue'">蓝色</button>
    <button @click="themeColor = 'orange'">橘黄色</button>

    <hr />
    <LevelOne />
  </div>
</template>

<script>
  import LevelOne from './components/LevelOne';
  import { provide, ref } from 'vue';

  export default {
    name: 'app',
    setup() {
      // 定义 ref 响应式数据
      const themeColor = ref('red');

      // 把 ref 数据通过 provide 提供的子组件使用
      provide('globalColor', themeColor);

      // setup 中 return 数据供当前组件的 Template 使用
      return {
        themeColor,
      };
    },
    components: {
      LevelOne,
    },
  };
</script>
```

## template refs

通过`ref()`还可以引用页面上的元素或组件

### 元素的引用

```vue
<template>
  <div>
    <h3 ref="h3ref">templateRefOne</h3>
  </div>
</template>
<script>
  import {ref, onMounted} from Vue
  export default{
    setup(){
      const h3ref = ref(null)
      onMounted(()=> h3ref.value.style.color = 'red')
      return {h3ref}
    }
  }
</script>
```

### 组件的引用

TemplateRefOne.vue

```vue
<template>
  <div>
    <h3>template Ref One</h3>
    <button @click="showNumber">获取templateRefTwo中的count值</button>
    <hr />
    <templateRefTwo ref="comRef">
  </div>
</template>
<script>
  import templateRefTwo from './components/TemplateRefTwo'
  import {ref} from 'vue'
  export default{
    setup(){
      // 创建一个组建的ref引用
      const comRef = ref(null)
      // 展示子组件的count值
      const showNumber =()=> console.log(comRef.value.count)
      return {comRef,showNumber}
    },
    components:{
      templateRefTwo
    }
  }
</script>
```

TemplateRefTwo.vue

```vue
<template>
  <div>
    <h5>template Ref Two ---{{ count }}</h5>
    <button @click="count += 1">+1</button>
  </div>
</template>
<script>
  import { ref } from 'vue';
  export default {
    setup() {
      const count = ref(0);
      return { count };
    },
  };
</script>
```

## createComponent

这个函数不是必须的，除非你想要完美的结合`TypeScript`提供的类型推断来进行项目的开发

这个函数提供了类型推断，方便在结合`TypeScript`属性代码时，能为`setup()`中的`props`提供完整的类型推断

```js
import { createComponent } from 'vue';
export default createComponent({
  props: {
    foo: string,
  },
  setup() {
    props.foo; // <--Type: string
  },
});
```

## 代码复用

### vue2.x

```vue
<template>
  <div class="vue2">
    <el-input type="text" @change="onSearch" v-model="searchValue" />
    <div v-for="name in names" v-show="name.isFixSearch" :key="name.id">
      {{ name.value }}
    </div>
  </div>
</template>
<script>
  // vue2.vue
  import searchMixin from './searchMixin';
  export default {
    mixins: [searchMixin],
    data() {
      return {
        names: [
          { id: 1, isFixSearch: true, value: 'name1' },
          { id: 2, isFixSearch: true, value: 'name2' },
          { id: 3, isFixSearch: true, value: 'name3' },
          { id: 4, isFixSearch: true, value: 'name4' },
          { id: 5, isFixSearch: true, value: 'name5' },
        ],
      };
    },
  };
</script>
<style lang="less">
  .vue2 {
  }
</style>
```

```js
// searchMixin.js
export default {
  data() {
    return {
      searchValue: '',
    };
  },
  /**
   * 命名固定，外面另外命名不容易
   * 应该可以通过 searchMixin.methods.onNewNameSearch =  searchMixin.methods.onSearch
   * 来进行重命名。但是data里面的应该就重命名不了了。
   */
  methods: {
    onSearch() {
      this.names.forEach((name) => (name.isFixSearch = name.value.includes(this.searchValue)));
    },
  },
};
```

缺点：

1. 命名容易冲突，容易覆盖引入`mixin`的页面属性
2. 问题追踪难度大，这个缺点还是由于名称冲突导致的。mixin 多的话容易出现不容易定位的问题。当然也可以通过 namespace 来解决。

### vue 3.0

```vue
<template>
  <div class="vue3">
    <el-input type="text" @change="onSearch" v-model="searchValue" />
    <div v-for="name in names" v-show="name.isFixSearch" :key="name.id">
      {{ name.value }}
    </div>
  </div>
</template>
<script>
  // vue3
  import useSearch from './useSearch';
  export default {
    setup() {
      const originNames = [
        { id: 1, isFixSearch: true, value: 'name1' },
        { id: 2, isFixSearch: true, value: 'name2' },
        { id: 3, isFixSearch: true, value: 'name3' },
        { id: 4, isFixSearch: true, value: 'name4' },
        { id: 5, isFixSearch: true, value: 'name5' },
      ];
      // 	可以很容易重命名
      const { onSearch, data: names, searchValue } = useSearch(originNames);
      return {
        onSearch,
        names,
        searchValue,
      };
    },
  };
</script>
<style lang="less">
  .vue3 {
  }
</style>
```

```js
// useSearch
import { reactive, toRefs } from '@vue/composition-api';
export default function useSearch(names) {
  const state = reactive({
    data: names,
    searchValue: '',
  });
  const onSearch = () => {
    state.data.forEach((name) => (name.isFixSearch = name.value.includes(state.searchValue)));
  };

  return {
    ...toRefs(state),
    onSearch,
  };
}
```

## 参考

- [Vue composition API](https://vue-composition-api-rfc.netlify.app/api.html#setup)

- [Vue3.0-beta](https://unpkg.com/vue@3.0.0-beta.3/dist/vue.global.js)
