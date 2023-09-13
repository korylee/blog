---
title: Vue3.x入手
date: 2021-02-28
tags:
  - vue
categories:
  - frontEnd
# publish: false
---

此文针对有一些经验的 vue2 开发者

## Vue3 的优点

- 首次渲染更快
- diff 算法更快
- 内存占用更少
- 打包体积更小
- 更好的 Typescript 支持
- `Composition API` 组合 API

# 破坏性改动

## 全局 API

Vue 2.x 有许多全局 API 和配置，它们可以全局改变 Vue 的行为。
从技术上讲，Vue2 没有“app”的概念，从同一个 Vue 构造函数创建的每个根实例共享相同的全局配置。

```js
// 这会影响到所有的根实例
Vue.mixin({
  /** */
}).component(/** */);

const app1 = new Vue({ el: "#app-1" });
const app2 = new Vue({ el: "#app-2" });
```

### 一个全新的全局 API：`createApp`

| 2.x 全局 API               | 3.x 实例 API (app)                         |
| -------------------------- | ------------------------------------------ |
| Vue.config                 | app.config                                 |
| Vue.config.productionTip   | 移除                                       |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement |
| Vue.component              | app.component                              |
| Vue.directive              | app.directive                              |
| Vue.mixin                  | app.mixin                                  |
| Vue.use                    | app.use                                    |
| Vue.prototype              | app.config.globalProperties                |
| Vue.extend                 | 移除                                       |

### 全局 API Tree shaking

#### 2.x 语法

```js
import Vue from "vue";
Vue.nextTick(() => {
  /**something */
});
```

无论你是否使用过`nextTick`，它都会被包含在客户端上下文中，那么它(`nextTick`)就会变成死代码。
webpack 和 Rollup (Vite 基于它) 这样的模块打包工具支持 tree-shaking（消除死代码）。

#### 3.x 语法

vue3 提供了 tree-shaking 的支持。(仅对于 ES 模块构建版本来说)

```js
import { nextTick } from "vue";
nextTick(() => {
  /**something */
});
```

## 模板指令

### v-model

- **非兼容**：用于自定义组件时，`v-model`prop 和事件默认名称已更改：
  - prop：value -> `modelValue`;
  - 事件：input -> `update:modelValue`;
- **非兼容**：`v-bind`的`.sync`修饰符和组件的`model`选项已移除，可在`v-model`上加一个参数代替
- **新增**：先择可以在同一个组件上使用多个`v-model`绑定
- **新增**：现在可以自定义 v-model 修饰符。

#### 2.x 语法

```html
<!-- ParentComponent.vue -->
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

如果想要更改 prop 或事件名称，则需要在 ChildComponent 组件中添加 model 选项：

```js
// ChildComponent.vue
export default {
  model: {
    prop: "title",
    event: "change",
  },
  props: {
    // 这将允许 `value` 属性用于其他用途
    value: String,
    title: {
      type: String,
      default: "",
    },
  },
};
```

`v-model` 是以下的简写

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

`title.sync`是以下的简写

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

#### 3.x 语法

```html
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent :modelValue="pageTitle" @update:modelValue="pageTitle = $event" />
```

### key 使用改变

- 新增：对于 `v-if`/`v-else`/`v-else-if` 的各分支项 key 将不再是必须的，因为现在 Vue 会自动生成唯一的 key。
  - 非兼容：如果你手动提供 key，那么每个分支必须使用唯一的 key。你将不再能通过故意使用相同的 key 来强制重用分支。
- 非兼容：`<template v-for>` 的 key 应该设置在 `<template>` 标签上 (而不是设置在它的子节点上)。

### v-if 与 v-for 的优先级对比

- 非兼容: `v-for`/`v-if`两者作用于同一个元素上时，`v-if`会拥有比`v-for`更高的优先级

```html
<p v-if="isShow" v-for="item in list">{{ item.name }}</p>
```

编译后代码区别

```js
/** 2.x*/
_l(list, function (item) {
  return isShow ? _c("p", [_v(_s(item.name) + "\n")]) : _e();
});

/** 3.x*/
isShow
  ? _l(list, function (item) {
      return _c("p", [_v(_s(item.name))]);
    })
  : _e();
```

这也意味着`v-if`无法访问到`v-for`作用域内定义的别名

```html
<!-- 这会抛出一个错误，因为属性 item 此时没有在该实例上定义 -->
<p v-if="!item.done" v-for="item in list">{{item.name}}</p>
```

### v-bind 合并行为

- 不兼容：`v-bind` 的绑定顺序会影响渲染结果。

#### 2.x 语法

独立 attribute 总是会覆盖 object 中的绑定

```html
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="red"></div>
```

#### 3.x 语法

绑定的声明顺序将决定它们如何被合并

```html
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<!-- 模板 -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- 结果 -->
<div id="red"></div>
```

### 移除 `v-on.native` 修饰符

- 不兼容：`v-on` 的 `.native` 修饰符已被移除。

#### 2.x 语法

将原生 DOM 监听器添加到子组件的根元素中，可以使用 .native 修饰符

```html
<my-component @close="handleComponentEvent" @click.native="handleNativeClickEvent" />
```

#### 3.x 语法

新增的 emits 选项允许子组件定义真正会被触发的事件。
因此，对于子组件中未被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 `inheritAttrs: false`)。

```html
<my-component @close="handleComponentEvent" @click.native="handleNativeClickEvent" />
```

`MyComponent.vue`

```html
<script>
  export default {
    emits: ["close"],
  };
</script>
```

## 组件

### 函数式组件

- 非兼容：`functional` atrribute 已从单文件组件（SFC）的`template`中移除
- 非兼容：`{ functional: true }` 选项已从通过函数创建的组件中移除

#### 介绍

在 Vue2 中，函数式组件主要是有两个应用场景

- 作为性能优化，因为他们的初始化速度比有状态组件快得多（无生命周期，无响应式状态）
- 返回多个根节点

然而，在 Vue3 中，有状态组件的性能已经提高到他们之间的区别可以忽略不计的程度。此外，有状态组件现在也支持返回多个根节点

#### 2.x 语法

```html
<template>
  <div>
    <maybe-popup :maybe="popup">
      <div>1</div>
      <div>2</div>
    </maybe-poup>
  </div>
</template>
<script>
  function createMaybeComponent(...args) {
    const [name, component] = args.length === 1 ? ["MaybeComponent", args[0]] : args;
    return {
      name,
      props: { maybe: Boolean },
      functional: true,
      render: (h, { data, props, children }) =>
        props.maybe ? h(component, data, children) : children,
    };
  }

  const MaybePopup = createMaybeComponent(Popup);

  export default {
    components: { MaybePopup },
    props: { popup: Boolean }
  };
</script>
```

通过函数式组件，实现是否被 popup 组件包裹

#### 3.x 语法

现在，在 Vue3 中，所有的函数式组件都是普通函数创建的。
他们将接受两个参数：`props`和`context`。`context`参数是一个对象，包含组件的`attrs`、`slots`和`emit` 等等 property
此外，`h`现在时全局导入的，而不是在`render` 函数中隐形提供。

以上面的`createMaybeComponent`为例，下面是它现在的样子

```js
import { h } from "vue";

function createMaybeComponent(component) {
  const MayComponent = (props, context) =>
    props.maybe ? h(component, context.attrs, context.slots) : context.slots;
  MayComponent.props = ["maybe"];
  return MayComponent;
}
```

### 异步组件

- 新的`defineAsyncComponent`助手方法，用于显示地定义异步组件
- `component` 选项被重命名为 loader
- Loader 函数本身不再接受`resolve`和`reject`参数，且必须返回一个 Promise

#### 2.x 语法

```js
const AsyncModal = () => import("./Modal.vue");
```

或者接受`resolve`和`reject`参数

```js
const AsyncModal = (resolve, reject) => {
  /**... */
};
```

或者，对待有选项的更高阶的组件语法:

```js
const AsyncModal = {
  component: () => import("./Modal.vue"),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent,
};
```

#### 3.x 语法

在 Vue 3 中，由于函数式组件被定义为纯函数，因此异步组件需要通过将其包裹在新的 `defineAsyncComponent` 助手方法中来显式地定义：

```js
import { defineAsyncComponent } from "vue";
import ErrorComponent from "./components/ErrorComponent.vue";
import LoadingComponent from "./components/LoadingComponent.vue";

// 不带选项的异步组件
const AsyncModal = defineAsyncComponent(() => import("./Modal.vue"));

// 返回Promise
const AsyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /**... */
    })
);

// 带选项的异步组件
const AsyncModalWithOptions = defineAsyncComponent({
  loader: () => import("./Modal.vue"),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent,
});
```

> Vue Router 支持一个类似的机制来异步加载路由组件，也就是俗称的懒加载。尽管类似，但是这个功能和 Vue 所支持的异步组件是不同的。当用 Vue Router 配置路由组件时，你不应该使用 defineAsyncComponent。你可以在 Vue Router 文档的[懒加载路由](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)章节阅读更多相关内容。

### `emits`选项

Vue3 现在提供一个 emits 选项，和现有的`props`类似、这个选项可以用来定义一个组件可以向其父组件触发的事件。

#### 2.x 的行为

在 vue2，你可以定义组件可接收的 prop，但无法声明它可以触发哪些事件：

```html
<template>
  <button v-on:click="$emit('accepted')">{{text}}</button>
</template>
<script>
  export default {
    props: ["text"],
  };
</script>
```

#### 3.x 的行为

```html
<template>
  <button v-on:click="$emit('accepted')">{{text}}</button>
</template>
<script>
  export default {
    props: ["text"],
    emits: ['accepted']
  };
```

#### 迁移策略

**强烈建议**使用 `emits` 记录每个组件所触发的所有事件。

因为移除了`.native`修饰符。任何未在`emits`中声明的事件监听器都会被算入组建的`attrs`，并将默认绑定到组件的根节点上。

##### 示例

对于 向其父组件透传原生事件的组件来说，这会导致有两个事件被触发：

```js
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // 不声明事件
}
</script>
```

当一个父级组件拥有`click`事件的监听器时：

```js
<my-button v-on:click="handleClick"></my-button>
```

这个事件现在会被触发两次：

- 一次来自`$emit()`。
- 另一次来自应用在根元素上的原生事件监听器。

#### props 与 emits

个人理解：`emits` 是 另一种 `props`。

##### 示例

```js
// 子组件内
const emits = defineEmits(['opened', 'click-overlay'])
const onClickOverlay = () => {
  emits('opened')
  emits('click-overlay')
}

defineProps({
  onClosed: Function
})

// 父组件
<child-component
  :on-opened="() => popupOpened(1)"// 不会执行
  @opened="popupOpened(2)"// 会执行
  :onOpened="() => popupOpened(3)"// 会执行

  @click-overlay="popupOpened(4)"// 会执行
  @clickOverlay="popupOpened(5)"// 会执行
  :on-click-overlay="popupOpened(6)"// 不会执行
  :onClickOverlay="popupOpened(7)"// 会执行

  @closed="popupOpened(8)" // 会执行
  :onClosed="() => popupOpened(9)"// 会执行
  :on-closed="() => popupOpened(10)"// 会执行
/>
```

## 渲染函数

### 渲染函数 API

- `h`全局导入，而不是作为参数传递给渲染函数
- 更改渲染函数参数，使其在有状态组件和函数组件的表现更加一致。
- VNode 的 prop 是一个扁平的结构

#### 渲染函数参数

##### 2.x 语法

在 2.x 中，`render` 函数会自动接收`h`函数 （它时`createElement`的惯用名）作为参数:

```js
export default {
  render(h) {
    return h("div");
  },
};
```

##### 3.x 语法

在 3.x 中,`h`函数现在是全局导入的，而不是作为参数自动传递。

```js
import { h } from "vue";

export default {
  render(h) {
    return h("div");
  },
};
```

#### VNode prop 格式化

##### 2.x 语法

在 2.x 中，`domProps` 包含 VNode prop 中的嵌套列表：

```js
{
  staticClass: "button",
  class: { "is-outlined": isOutlined },
  staticStyle: { color: "#fff" },
  style: { backgroundColor: buttonColor },
  attrs: { id: "submit" },
  domProps: { innerHTML: "" },
  on: { click: submitForm },
  key: "submit-button",
};
```

##### 3.x 语法

```js
{
  class: ["button", { "is-outlined": isOutlined }],
  style: [{ color: "#34495E" }, { backgroundColor: buttonColor }],
  id: "submit",
  innerHTML: "",
  onClick: submitForm,
  key: "submit-button",
};
```

##### 注册组件

###### 2.x 语法

在 2.x 中，注册一个组件后，把组件名作为字符串传递给渲染函数的第一个参数，它可以正常地工作：

```js
Vue.component("button-counter", {
  data: () => ({ count: 0 }),
  render(h) {
    const onClick = () => {
      this.count++;
    };
    return h(
      "button",
      {
        on: { click: onClick },
      },
      ["Clicked " + this.count + " times"]
    );
  },
});

export default {
  render(h) {
    return h("button-counter");
  },
};
```

###### 3.x 语法

在 3.x 中，由于 VNode 是上下文无关的，不能再用字符串 ID 隐式查找已注册的组件。取而代之的需要使用一个导入的`resolveComponent`方法：

```js
import { h, resolveComponent } from "vue";

export default {
  render() {
    const ButtonCounter = resolveComponent("button-counter");
    return h(ButtonCounter);
  },
};
```

### 插槽统一

- `this.$slots`将插槽作为函数公开
- 移除`this.$scopedSlots`

#### 2.x 语法

```js
// 父组件
h(
  LayoutComponent,
  {
    scopedSlots: {
      header: (data) => h("div", data.title), // => <template #header="{title}"><div>{{title}}</div></template> 模板语法
      content: () => h("div", "DemoContent"), // => <template #content><div>DemoContent</div></template> 模板语法
    },
  },
  [
    h("div", { slot: "footer" }, ["DemoFooter"]), // => <div slot="footer">DemoFooter</div> 模板语法
  ]
);
```

此外，可以通过以下语法引用插槽

```js
// 子组件
this.$scopedSlots.header?.({ title: "DemoInner" }); // 作用域插槽
this.$scopedSlots.content?.(); // "作用域"插槽
this.$slots.footer; // 具名插槽
```

> 注 模板语法旧写法 `<div slot="footer">DemoFooter</div>`会被编译成
> VNode props: `{ $scopedSlots: {footer: () => [VNode]}, $slots: {footer: [VNode]}}`

#### 3.x 语法

```js
h(
  LayoutComponent,
  {},
  {
    header: ({ title }) => h("div", title), // header 作用域插槽
    content: () => h("div", this.content), // content 具名插槽
  }
);
```

以 js 对象引用插槽时，他们现在被统一到`$slots`选项中了。

```js
this.$slots.header({ title: "test" });
this.$slots.content();
```

### 移除`$listeners`

时间监听器现在是`$attrs`的一部分

#### 2.x 语法

在 vue2 中，你可以通过`$attrs`访问传递给组件的 attribute，通过`$listeners`访问传递给组件的事件监听器。结合`inheritAttrs: false`，开发者可以将这些 attribute 和监听器应用到根元素之外的其他元素：

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" v-on="$listeners" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false,
  };
</script>
```

#### 3.x 语法

在 Vue 3 的虚拟 DOM 中，事件监听器现在只是以 on 为前缀的 attribute，这样它就成为了 `$attrs` 对象的一部分，因此 `$listeners` 被移除了。

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false,
  };
</script>
```

如果这个组件接收一个`id` attribute 和一个`v-on:close`监听器，那么`$attrs`对象现在将如下所示：

```js
{
  id: 'my-input',
  onClose: () => console.log('close 事件被触发')
}
```

### `$attrs` 包含 `class` & `style`

#### 2.x 行为

Vue2 的虚拟 Dom 实现对`class`和`style` attribute 有一些特殊处理。因此，没有被包含在`$attrs`中。
上述行为在使用`inheritAttrs: false`时回产生副作用

- `$attrs` 中的 attribute 将不再被自动添加到根元素中，而是由开发者决定在哪添加
- 但是 `class` 和 `style` 不属于`$attrs`，他们仍然会被应用到组件的根元素中：

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false,
  };
</script>
```

像这样使用时：

```html
<my-component id="my-id" class="my-class" />
```

将生成以下 HTML：

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

#### 3.x 行为

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## 与自定义元素的互操作性

- 非兼容：检测并确定哪些标签应该被视为自定义元素的过程，现在会在模板编译期间执行，且应该通过编译器选项而不是运行时配置来配置。
- 非兼容：特殊的 `is` attribute 的使用被严格限制在保留的 `<component>` 标签中。
- 新增：为了支持 2.x 在原生元素上使用 `is` 的用例来处理原生 HTML 解析限制，我们用 vue: 前缀来解析一个 Vue 组件。

### 自主定制元素

如果想要在 Vue 外部定义添加自定义元素（例如使用 Web Components Api），则需要“指示”Vue 将其视为自定义元素。

#### 2.x 语法

```js
// 这将使Vue 忽略在其外部定义的自定义元素
Vue.config.ignoredElementes = ["plastic-button"];
```

#### 3.x 语法

在 Vue 3.0 中，此检查在模板编译期间执行。要指示编译器将`<plastic-button>`视为自定义元素。

- 如果使用预构建：给 Vue 模板编译器传入`isCustomElement`。

  ```js
  // webpack 配置
  rules: [
    {
      test: /\.vue$/,
      use: "vue-loader",
      options: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "plastic-button",
        },
      },
    },
  ];
  ```

- 如果使用动态模板编译。
  ```js
  const app = Vue.createApp({});
  app.config.compilerOptions.isCustomElement = (tag) => tag === "plastic-button";
  ```

### 定制内置元素

自定义元素规范提供了一种将自定义元素作为[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)的方法，方法是像内置元素添加 attribute：

```js
<button is="plastic-button">点击我!</button>
```

在原生 attribute 与浏览器中普遍可用之前，Vue 对`is`这个特殊 attribute 的使用就已经在模拟其行为。但是，在 2.x 中，它将被解释为渲染一个名为`plastic-button`的 Vue 组件，这将阻碍上面所提到的自定义内置元素的原生用法。

- 在保留的`<component >` 标签上使用时，它的行为将与 2.x 中完全相同；
- 在普通组件上使用时，它的行为将类似于普通 attribute：
  ```html
  <foo is="bar" />
  ```
  - 2.x 的行为：渲染`bar`组件
  - 3.x 的行为：渲染`foo`组件，并将`is` attribute 传递给他
- 在普通元素上使用时，它将作为`is`attibute 传递给`createElement`调用，并作为原生 attribute 渲染。它支持了自定义内置元素的用法。
  ```html
  <button is="plastic-button">click</button>
  ```
  - 2.x 的行为：渲染`plastic-button`组件
  - 3.x 的行为：通过调用以下函数渲染原生的 button
  ```js
  document.createElement("button", { id: "plastic-button" });
  ```

### 使用`vue:`前缀来解决 DOM 内模板解析问题

#### 2.x 语法

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

#### 3.x 语法

随着 `is`的行为发生变化，现在将元素解析为 Vue 组件需要添加一个`vue:`前缀：

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

## 移除的 APIs

### 按键修饰符

- 不再支持使用数字（即键码）作为`v-on`修饰符
- 不再支持`config.keyCodes`

#### 2.x 语法

```html
<!-- 键码版本 -->
<input v-on:keyup.13="submit" />

<!-- 别名版本 -->
<input v-on:keyup.enter="submit" />
```

此外，也可以通过全局的`config.keyCodes`选项定义自己的别名。

```js
Vue.config.keyCodes = { f1: 112 };
```

```html
<!-- 键码版本 -->
<input v-on:keyup.112="showHelpText" />

<!-- 自定义别名版本 -->
<input v-on:keyup.f1="showHelpText" />
```

#### 3.x 语法

[`KeybordEvent.keyCode`**已被废弃**](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode)，建议使用 kebab-cased(短横线)名称作为修饰符的键。

```html
<!-- Vue 3 在 v-on 上使用按键修饰符 -->
<input v-on:keyup.page-down="nextPage" />

<!-- 同时匹配 q 和 Q -->
<input v-on:keypress.q="quit" />
```

### 事件 API

`$on`, `$off`, `$once`实例方法已被移除，组件实例不再实现事件触发窗口。

#### 2.x 语法

```js
export default {
  created() {
    let scrollParent;
    const onScroll = () => {};
    this.$on("hook:mounted", () => {
      scrollParent = getScrollParent();
      scrollParent?.addEventListener("scroll", onScroll);
    });
    this.$on("hook:beforeDestroy", () => {
      scrollParent?.removeEventListener("scroll", onScroll);
    });
  },
};
```

#### 3.x 更新

在 Vue 3 中，借助这些 API 从一个组件内部监听其自身触发的事件已经不再可能了

### 过滤器

#### 2.x 语法

在 2.x 中，开发者可以使用过滤器来处理通用文本格式

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountBalance | currencyUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true,
      },
    },
    filters: {
      currencyUSD(value) {
        return "$" + value;
      },
    },
  };
</script>
```

### $children

`$children` 实例 property 已从 Vue 3.x 中移除，不再支持。

#### 2.x 语法

在 2.x 中，开发者可以使用`$children`访问当前实例的直接子组件：

```html
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <my-button>Change logo</my-button>
  </div>
</template>

<script>
  import MyButton from "./MyButton";

  export default {
    components: {
      MyButton,
    },
    mounted() {
      console.log(this.$children); // [VueComponent]
    },
  };
</script>
```

### propsData

propsData 选项之前用于在创建 Vue 实例的过程中传入 prop，现在它被移除了

#### 2.x 语法

```js
const Comp = Vue.extend({
  props: ["username"],
  template: "<div @click="$emit('click', $event)">{{ username }}</div>",
});

new Comp({
  propsData: {
    username: "Evan",
    on: {
      click: () => {
        console.log("click");
      },
    },
  },
});
```

#### 3.x 语法

```js
const app = createApp(
  {
    props: ["username"],
    emits: ['click'],
    template: "<div @click="$emit('click', $event)">{{ username }}</div>",
  },
  {
    username: "Evan",
    onClick: () => {
      console.log("test");
    },
  }
);
```

# 生命周期

对于生命周期来说，整体上变化不大，功能上是类似的

| vue2          | vue3(选项式 options API) | vue3(组合式 composition API) | 说明                                      |
| ------------- | ------------------------ | ---------------------------- | ----------------------------------------- |
| beforeCreate  | beforeCreate             | setup                        | 组件创建之前，执行初始化任务              |
| created       | created                  | setup                        | 组件创建完成                              |
| beforeMount   | beforeMount              | onBeforeMount                | 组件挂载之前                              |
| mounted       | mounted                  | onMounted                    | 组件挂载完成。                            |
| beforeUpdate  | beforeUpdate             | onBeforeUpdate               | 即将因为响应式状态变更而更新其 DOM 树之前 |
| updated       | updated                  | onUpdated                    | 响应式状态变更而更新其 DOM 树之后         |
| beforeDestroy | beforeUnmount            | onBeforeUnmount              | 组件销毁之前                              |
| destroyed     | unmounted                | onUnmounted                  | 组件销毁之后                              |

> tips: setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地去定义。

# Hooks

hook：直译 是 钩子，它并不仅是 react 或 vue，甚至不仅是前端界的专用术语，而是整个行业所熟知的用语。通常指：系统运行到某一时期时，会调用被注册到该时机的回调函数。

在 “react@16.x” 之前，当我们谈论 hooks 时，我们可能谈论的是“组件的生命周期”。
但是现在，hooks 有了全新的含义。
以 react 为例，hooks 是：一系列以 “use” 作为开头的方法，它们提供了让你可以完全避开 `class` 式写法，在函数式组件中完成生命周期、状态管理、逻辑复用等几乎全部组件开发工作的能力。

简化一下：一系列方法，提供了在**函数式组件中**完成开发工作的能力。

而在 Vue 中，hooks 的定义可能更模糊，
在 vue 组合式 API 里，以 “use” 作为开头的，一系列提供了组件复用、状态管理等开发能力的方法。

## composition Api

### 概述

Hooks 是一种**基于闭包**的函数式编程产物，所以通常我们会在**函数式风格**的框架或组件中使用 Hook。
Hooks 在 vue2 所使用的“Options API”中也不是不可以使用，毕竟 Hook 本质只是一个函数，只要 hook 内部所使用的 api 能够得到支持，我们可以在任何地方使用它们，只是可能需要额外的支持以及效果没有函数式组件中那么好，因为仍会被选项分割。

![options-to-composition-api](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d05799744a6341fd908ec03e5916d7b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![composables](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4146605abc9c4b638863e9a3f2f1b001~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```js
/**
 *@type {Vue} vm
 *@type {Element} root
 *@type {(event: Event) => void}
 */
export function useScrollParentScroller(vm, root, onScroll) {
  let scroller;
  const add = () => {
    root = typeof root === 'function' ? root() : root
    scroller = getParentScroller(root);
    scroller.addEventListener("scroll", onScroll, { passive: true });
  };
  const remove = () => {
    scroller && scroller.removeEventListener("scroll", onScroll);
  };
  this.$on("hook:activated", add);
  this.$on("hook:mounted", add);
  this.$on("hook:beforeDestory", remove);
  this.$on("hook:deactivated", remove);
}

// 组件内使用
created(){
  useScrollParentScroller(this, () => this.$refs.root, this.onScroll)
}
```

vue3 为开发者带来了全新的 Composition API 即组合式 API。它是通过一种通过函数来描述组件逻辑的开发模式。组合式 API 为开发者带来了更好的逻辑复用能力，通过**组合函数**来实现更加简洁高效的逻辑复用。

### 为啥要使用 Hooks

在以往 Vue2 的选项式 API 中，主要通过 Mixin 或是 Class 继承来实现逻辑复用，但这种方式有三个明显的**短板**：

- 不清晰的数据来源：当使用了多个 mixin/class 时，哪个数据是哪个模块提供的将变得难以追寻，将提升维护难度。
- 命名空间冲突：来自多个 class/mixin 的开发者可能会注册同样的属性名，造成冲突。
- 隐性的跨模块交流：不同的 mixin/class 之间可能存在某种相互作用，产生位置的后果。

以上三种主要的缺点导致在大型项目的开发中，多 mixin/class 的组合将导致逻辑的混乱及维护难度的提升，因而在 Vue3 的官方文档中不再推荐使用，保留 mixin 也只是为了迁移的需求或方便 vue2 用户熟悉。

而 Hooks 带来的好处则是

- 暴露给模板的属性具有明确的来源，因为它们是从 Hook 函数返回的值。
- Hook 函数返回的值可以任意命名，因此不会发生名称空间冲突。
- 没有创建仅用于逻辑重用的不必要的组件实例。

当然，这种模式也存在一些缺点，比如 ref 带来的心智负担

### API

#### setup 函数

`setup()`是在组件中使用组合式 API 的入口，通常只在以下情况下使用：

1. 需要在非单文件组件中使用组合式 API 时
2. 需要基于选项式 API 的组件中集成基于组合式 API 的代码时。

> 如果是单文件组件，推荐使用`<script setup>`

```html
<script>
  import { ref } from "vue";
  export default {
    setyp() {
      const count = ref(0);
      return { count };
    },
    mounted() {
      console.log(this.count);
    },
  };
</script>
<template>
  <button @click="count++">{{count}}</button>
</template>
```

在模板中访问从 setup 返回的 ref 时，它会[自动浅层解包](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#deep-reactivity)，因此无需再在模板中为它写`.value`。

`setup()`自身并不含对组件实例的访问权，即在`setup()`中访问会是`undefined`

`setup()`应该*同步地*返回一个对象。唯一可以使用`async setup()`的情况是，该组件是 Suspense 的后裔。

##### setup 入参

setup 函数接收两个参数：props 和 context

- props 是一个响应式对象，不能使用 ES6 解构，会消除 prop 的响应特性，此时需要借用 toRef 或 toRefs 取值，使用它还有另外一个好处，可以遵循 props 单向数据流，修改 props 值。
- context：非响应式的上下文对象，可以解构，属性有`attrs`，`slots`，`emit`，`expose`
  - `attrs`是一个**非响应式**对象，主要接收 no-props 属性，经常用来传递一些样式，等价于`$attrs`。是有状态的对象，会随着组件自身的更新而更新，尽量不要解构。
  - `slots`是一个包含了所有的插槽的对象，等价于`$slots`。是有状态的对象，会随着组件自身的更新而更新，尽量不要解构。
  - `emit`由于 setup 内不存在`this`，所以`emit`用来替换之前`this.$emit`的，用于子传父时，触发自定义事件。
  - `expose`控制组件暴露的属性和方法，当父组件通过模板引用访问该组件的实例时，将仅能访问`expose`函数暴露出的内容

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    //让组件实例处于 “关闭状态”, 即不向父组件暴露任何东西
    expose();

    const publicCount = ref(0);
    // 有选择的暴露局部状态
    expose({ count: publicCount });
  },
};
```

`setup` 也可以返回一个渲染函数，此时在渲染函数中可以直接使用在同一作用域下声明的响应式状态：

```js
import { h, ref } from "vue";

export default {
  setup() {
    const count = ref(0);
    return () => h("div", count.value);
  },
};
```

#### 响应式 核心

##### ref()

- 作用：定义一个**响应式**的数据
- 语法:
  - 创建一个包含引用式数据的引用对象(reference 对象，简称`ref`对象)
  - js 中操作数据: `xxx.value`
  - 模板中读取数据：不需要`.value`, 直接`<div>{{xxx}}</div>`
- 备注：
  - 接收的数据可以是：基本类型，也可以是对象类型
  - 基本类型的数据：响应式依靠的是类上的`getter`与`setter`完成的
  - 对象类型的数据：内部“求助”了 Vue3.0 中一个新的函数--`reative`函数，这个对象将被转为具体深层次响应式的对象。这意味着如果对象中包含了嵌套的 ref，他们将被深层的解包。若要避免这种深层次的转换，请使用`shallowRef()`来代替。

###### 类型

```ts
function ref<T>(value: T): Ref<UnwrapRef<T>>;

interface Ref<T> {
  value: T;
}
```

###### 详情

```ts
export function ref<T extends Ref>(value: T): T;
export function ref<T>(value: T): Ref<UnwrapRef<T>>;
export function ref<T = any>(): Ref<T | undefined>;
export function ref(value?: unknown) {
  return createRef(value, false);
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;

  public dep?: Dep = undefined;
  public readonly __v_isRef = true;

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }
}
```

##### reactive 函数

- 作用：定义一个**对象类型**的响应式数据（基本类型使用`ref`函数）
- 语法：`const 代理对象 = reactive(源对象)`接收一个对象（或数组），返回一个代理对象（`Proxy`的实例对象，简称`proxy`对象）
- `reactive` 定义的响应数据是"深层次的": 它会影响到所有嵌套的属性。一个响应式对象也将深层地解包任何 ref 属性，同时保持响应性(除响应式数组或`Map`这样的原生集合类型的 ref 元素)
- 内部基于 ES6 的`Proxy`实现，通过代理对象操作元对象内部数据进行操作。因此**不等于**源对象。

###### 类型

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
```

###### 示例

ref 的解包

```ts
const count = ref(1);
const obj = reactive({ count });

// ref 会被解包
console.log(obj.count === count.value); // true

// 会更新 `obj.count`
count.value++;
console.log(count.value); // 2
console.log(obj.count); // 2

// 也会更新 `count` ref
obj.count++;
console.log(obj.count); // 3
console.log(count.value); // 3
```

注意访问到某个响应式数组或`Map`这样的原生集合类型中的 ref 元素中，**不会**执行 ref 的解包：

```ts
const books = reactive([ref("Vue 3")]);
// 这里需要.value
console.log(books[0].value);

const map = reactive(new Map([["count", ref(0)]]));
// 这里需要 .value
console.log(map.get("count").value);
```

将一个 ref 赋值给一个 reactive 属性时，该 ref 会被自动解包：

```ts
const count = ref(1);
const obj = reactive({});

obj.count = count;

console.log(obj.count);
obj.count++;
console.log(obj.count === count.value);
```

##### `computed()`

- 作用：接受一个 getter 函数，返回一个只读的响应式 ref 对象。
- 备注
  - 该 ref 通过`.value`暴露 getter 函数的返回值。它也可以带有一个`get`和`set`函数的对象来创建一个可写的 ref 对象。

###### 类型

```ts
// 只读
function computed<T>(
  getter: () => T,
  // 查看下方的 "计算属性调试" 链接
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>;

// 可写的
function computed<T>(
  options: {
    get: () => T;
    set: (value: T) => void;
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>;
```

###### 示例

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    debugger;
  },
  onTrigger(e) {
    debugger;
  },
});
```

##### `readonly()`

- 作用：接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。
- 备注：
  - 只读代理时深层的：对任何嵌套属性的访问都将是只读的。它的 ref 解包行为与 reactive() 相同，但解包得到的值是只读的。

###### 示例

```js
const original = reactive({ count: 0 });

const copy = readonly(original);

watchEffect(() => {
  // 用来做响应性追踪
  console.log(copy.count);
});

// 更改源属性会触发其依赖的侦听器
original.count++;

// 更改该只读副本将会失败，并会得到一个警告
copy.count++; // warning!
```

##### `watchEffect()`

- 作用：立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
- 语法：
  - 第一个参数是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来清理回调。
    - 清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用。
  - 第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖。
    - `flush: post`（默认），侦听器将在组件渲染**之前**执行。这意味着侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
    - `flush: post`: 将使侦听器延迟到组件渲染**之后**再执行
    - `flush: sync`: 在响应式依赖发生**改变时**立即触发侦听器(谨慎使用，多个属性同时更新会导致一些性能和数据一致性的问题)
  - 返回值是一个用来停止该副作用的函数

###### 类型

```ts
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): StopHandle;

type OnCleanup = (cleanupFn: () => void) => void;

interface WatchEffectOptions {
  flush?: "pre" | "post" | "sync"; // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void;
  onTrigger?: (event: DebuggerEvent) => void;
}

type StopHandle = () => void;
```

###### 示例

```js
const stop = watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value);
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前
  // 未完成的请求
  onCleanup(cancel);
  data.value = await response;
});

// 当不再需要此侦听器时
stop();
```

##### `watch()`

- 作用：侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。默认是懒监听的，即尽在侦听源发生变化时才执行回调函数。
- 语法：
  - 第一个参数是侦听器的源，来源可以是：一个函数，一个 ref，一个响应式对象，或是由以上类型的值组合成的数组
  - 第二个参数是发生变化时要调用的回调函数。
    - 这个回调函数接受三个参数：新值、旧值，以及一个用于注册副作用清理的回调函数。该回调函数会在副作用下一次重新执行前调用，可用来清除无效的副作用，例如等待中的异步请求。
    - 当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值。
  - 第三个可选的参数是一个对象，
    - immediate：在侦听器创建时立即触发回调。第一次调用时的旧值是`undefined`
    - deep: 如果源是对象，强制深度遍历，以便在深层级变更时触发回调。
    - flush：调整回调函数的刷新时机。参考[`watchEffect()`](#watcheffect)
    - onTrack/onTrigger：调试侦听器的依赖。
- 备注：
  - 与`watchEffect()`相比，`watch()`可以：
    - 懒执行副作用
    - 更加明确是应该由哪个状态触发侦听器重写执行；
    - 可以访问所侦听状态的前一个值和当前值。

###### 类型

```ts
// 侦听单个来源
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): StopHandle;

// 侦听多个来源
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): StopHandle;

type WatchCallback<T> = (value: T, oldValue: T, onCleanup: (cleanupFn: () => void) => void) => void;

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object
  ? T
  : never; // 响应式对象

interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean; // 默认：false
  deep?: boolean; // 默认：false
  flush?: "pre" | "post" | "sync"; // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void;
  onTrigger?: (event: DebuggerEvent) => void;
}
```

###### 示例

侦听一个 getter 函数：

```js
const state = reactive({ count: 0 });
watch(
  () => state.count,
  (count, prevCount) => {}
);
```

侦听一个 ref：

```js
const count = ref(0);
watch(count, (count, prevCount) => {});
```

当侦听多个来源时：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
});
```

当使用 `getter` 作为源时，回调只在此函数的返回值变化时才会触发。如果你想让回调在深层级变更时也能触发，你需要使用`{deep: true}`强制侦听器进入深层级模式。在深层级模式时，如果回调函数由于深层及的变更而被触发，那么新值与旧值是同一个对象。

```js
const state = reactive({ count: 0 });
watch(
  () => state,
  (newValue, oldValue) => {
    console.log(newValue === oldValue); // true
  },
  { deep: true }
);
```

当直接侦听一个响应式对象时，侦听器会自动启用深层模式

```js
const state = reactive({ count: 0 });
watch(state, () => {
  /* 深层级变更状态所触发的回调 */
});
```

停止侦听器:

```js
const stop = watch(source, callback);

// 当已不再需要该侦听器时：
stop();
```

副作用清理:

```js
watch(id, async (newId, oldId, onCleanup) => {
  const { response, cancel } = doAsyncWork(newId);
  // 当 `id` 变化时，`cancel` 将被调用，
  // 取消之前的未完成的请求
  onCleanup(cancel);
  data.value = await response;
});
```

`watch()`和`watchEffet()`享有相同的刷新时机和调试选项

```js
watch(source, callback, {
  flush: "post",
  onTrack(e) {
    debugger;
  },
  onTrigger(e) {
    debugger;
  },
});
```

##### 最佳实践

将[此处](#概述)用 composition api 重写

```js
export function useScrollParent(el, root = window) {
  const scrollParent = ref();
  watch(el, (value) => {
    scrollParent.value = getScrollParent(value, root);
  });
  return scrollParent;
}

export function useScrollParentScroller(el, onScroll) {
  const scrollParent = useScrollParent(el);
  const add = (scroller) => {
    scroller?.addEventListener("scroll", onScroll, { passive: true });
  };
  const remove = (scroller) => {
    scroller?.removeEventListener("scroll", onScroll);
  };
  watch(scrollParent, (val, oldVal) => {
    remove(oldVal);
    add(val);
  });
  onMounted(() => {
    add(scrollParent.value);
  });
  onUnmounted(() => {
    remove(scrollParent.value);
  });
}
```

## React Hook 和 Vue Hook 对比

其实 React Hook 的限制非常多，比如官方文档中专门有个[章节](https://zh-hans.legacy.reactjs.org/docs/hooks-rules.html)介绍：

- 不要在循环，条件或嵌套函数中调用 Hook
- 确保总是在你的 React 函数的最顶层调用他们
- 只在 React 函数中调用 Hook，不要再普通的函数中调用 Hook

而 Vue 带来的不同在于：

- 与 React Hooks 相同级别的逻辑组合功能，但有一些重要的区别。与 React Hook 不同，setup 函数仅被调用一次，这在性能上比较占优。
- 对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数，产生的 GC 压力比较小。
- 不必考虑几乎总是需要 useCallback 的问题，以防止传递`函数prop`给子组件的引用变化，导致务必要的重写渲染。
- React Hook 有臭名昭著的闭包陷阱问题，如果用户忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量，这不受此问题的影响。Vue 的自动依赖关系跟踪确保观察者和计算值始终正确无误。

React Hook 的心智负担真的很严重，感兴趣请参考：
[使用 react hooks 带来的收益抵得过使用它的成本吗?](https://www.zhihu.com/question/350523308)

## `<script setup>`

`<script setup>` 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。

### 基本语法

要启用该语法，需要在`<script>`代码块上添加`setup`attribute：

```js
<script setup>console.log('hello script setup')</script>
```

里面的代码会被自动编译成组件`setup()`函数的内容。这意味着与普通的`<script>`只在组件被首次引入的时候执行一次不同，`<script setup>`中会在**每次组件实例被创建的时候执行**。

#### 顶层的的绑定会被暴露给模板

当使用`<script setup>`的时候，任何在`<script setup>`声明的顶层的绑定（包括变量，函数声明，以及 import 导入的内容）都能在模板中直接使用：

```html
<script setup>
  // 变量
  const msg = "Hello!";

  // 函数
  function log() {
    console.log(msg);
  }
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

imports 导入的内容也会以同样的方式暴露。这意味着我们可以在模板表达式中直接使用导入的 helper 函数，而不需要通过`methods`选项来暴露它：

```html
<script setup>
  import { capitalize } from "./helpers";
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

#### 使用组件

`<script setup>` 范围里的值也能被直接作为自定义组件的标签名使用：

```html
<script setup>
  import MyComponent from "./MyComponent.vue";
</script>

<template>
  <MyComponent />
</template>
```

##### 动态组件

由于组件是通过变量引用而不是基于字符串组件名注册的，在 `<script setup>` 中要使用动态组件的时候，应该使用动态的 `:is` 来绑定：

```html
<script setup>
  import Foo from "./Foo.vue";
  import Bar from "./Bar.vue";
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

### 使用自定义指令

全局注册的自定义指令将正常工作。本地的自定义指令在 `<script setup>` 中不需要显式注册，但他们必须遵循 `vNameOfDirective` 这样的命名规范：

```html
<script setup>
  const vMyDirective = {
    beforeMount: (el) => {
      // 在元素上做些操作
    },
  };
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

### defineProps() 和 defineEmits()

为了在声明 `props` 和 `emits` 选项时获得完整的类型推导支持，我们可以使用 `defineProps` 和 `defineEmits` API，它们将自动地在 `<script setup>`中可用：

```html
<script setup>
  const props = defineProps({
    foo: String,
  });

  const emit = defineEmits(["change", "delete"]);
  // setup 代码
</script>
```

- `defineProps` 和 `defineEmits`都是只能在`<script setup>`中使用的**编译器宏**。他俩不需要导入，且会随着`<script setup>`的处理过程被一同编译掉。
- `defineProps`接收与`props`选项相同的值，`defineEmits`接受与`emits`选项相同的值。
- `defineProps`和`defineEmits`在选项传入后，会提供恰当的类型推导。
- 传入到`defineProps` 和`defineEmits`的选项会从 setup 中提升到模块的作用域。因此，传入的选项不能饮用在 setup 作用域中声明的局部变量。这样做会引起编译错误。

#### 针对类型的 props/emit 声明

props 和 emit 也可以通过给`defineProps`和`defineEmits`传递纯类型参数的方式来声明：

```ts
const props = defineProps<{
  foo: string;
  bar?: number;
}>();

const emit = defineEmits<{
  (e: "change", id: number): void;
  (e: "update", value: string): void;
}>();

// 3.3+：另一种更简洁的语法
const emit = defineEmits<{
  change: [id: number]; // 具名元组语法
  update: [value: string];
}>();
```

- `defineProps`或`defineEmits`要么使用运行时声明，要么使用类型声明。同时使用两种方式会导致编译报错。
- 使用类型声明的时候，静态分析会自动生成等效的运行时声明，从而在避免双重声明的前提下确保正确的运行时行为。
  - 在开发模式下，编译器会试着从类型来推导对应的运行时验证。例如这里从`foo: string`类型中推断出`foo :String`。
  - 在生产模式下，编译器会生成数组格式的声明来减少打包体积（这里的 props 会被编译成`['foo', 'bar']`）

#### 使用类型声明时的默认 props 值

针对类型的 `defineProps` 声明的不足之处在于，它没有可以给 props 提供默认值的方式。为了解决这个问题，我们还提供了 `withDefaults` 编译器宏：

```ts
export interface Props {
  msg?: string;
  labels?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  msg: "hello",
  labels: () => ["one", "two"],
});
```

上面代码会被编译为等价的运行时 props 的 `default` 选项。此外，`withDefaults` 辅助函数提供了对默认值的类型检查，并确保返回的 `props` 的类型删除了已声明默认值的属性的可选标志。

### `defineExpose()`

使用`<script setup>`的组件是**默认关闭**的--即通过模板引用或者`$parent`链获取到的组件公开实例，**不会**暴露任何在`<script setup>`中声明的绑定。

可以通过`defineExpose`编译宏来显式指定在`<script setup>` 组件中要暴露出去的属性：

```html
<script setup>
  defineExpose({ a: 1 });
</script>
```

### `defineOptions()` Vue3.3+

```html
<script setup>
  defineOptions({
    inheritAttrs: false,
    customOptions: {
      /* ... */
    },
  });
</script>
```

### `defineSlots()` Vue3.3+

这个宏可以用于为 IDE 提供插槽名称和 props 类型检查的类型提示。

```html
<script setup lang="ts">
  const slots = defineSlots<{
    default(props: { msg: string }): any;
  }>();
</script>
```

### `useSlots()` 和 `useAttrs()`

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数：

```html
<script setup>
  import { useSlots, useAttrs } from "vue";

  const slots = useSlots();
  const attrs = useAttrs();
</script>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数，它的返回与 `setupContext.slots` 和 `setupContext.attrs` 等价。它们同样也能在普通的组合式 API 中使用。

### `defineModel` Vue3.3 beta+

- [RFC](https://github.com/vuejs/rfcs/discussions/503)

#### 动机

这个宏是一个纯粹的语法糖。在 Vue 3.3 之前，如果我们要定义一个双向绑定的 prop，是一件挺麻烦的事情。

```html
<script setup lang="ts">
  const props = defineProps<{
    modelValue: number;
  }>();

  const emit = defineEmits<{
    (evt: "update:modelValue", value: number): void;
  }>();

  // 更新值
  emit("update:modelValue", props.modelValue + 1);
</script>
```

而现在：

```html
<script setup>
  const modelValue = defineModel();
  modelValue.value++;
</script>
```

# 响应式原理

响应式是 Vue.js 的核心思想之一，它的本质是当数据变化后会自动执行某个函数。

响应式的实现基本是靠数据劫持，在 Vue 2.x 中，是通过`Object.defineProperty`API 劫持数据的变化，在数据被访问的时候收集依赖，然后在数据被修改的时候通知依赖更新。

而到了 Vue.js3.x，基本思路与 Vue2.x 是一样的，但使用`Proxy`API 来劫持数据，并重写了响应式部分。

## `Proxy` vs `Object.defineProperty`

那么，`Proxy`和`Object.defineProperty`有哪些区别呢？
从 API 上来看，`Proxy` 劫持的是整个对象，那么对于对象属性的新增、删除、修改自然都可以劫持到；而 `Object.defineProperty API 劫持的对象某一个属性的访问和修改，因此它不能监听对象属性新增和删除。`

从兼容性上来看，`Object.defineProperty` 支持所有主流浏览器，并兼容 IE9+，而 `Proxy` 仅支持现代主流浏览器（IOS>=10, Webview android>=49, Chrome android >= 49）,且不支持 polifill。

从性能上看，Proxy 比 `Object.defineProperty` 要慢。详情查看[Thoughts on ES6 Proxies Performance](https://thecodebarbarian.com/thoughts-on-es6-proxies-performance)这篇文章，译文 [ES6 Proxy 性能之我见](https://www.cnblogs.com/zmj97/p/10954968.html)；[测试 demo](https://github.com/ustbhuangyi/Proxy-vs-DefineProperty)，感兴趣的同学可以 clone 下来跑一下。

### 性能差异

既然`Proxy`比`Object.defineProperty`慢，那么为何说 Vue.js3.x 的响应式 API 实现和 Vue.js2.x 相比性能要好呢？

因为 `Proxy` 解决了以下的问题

1. 在 Vue2.x 中，受限于`Object.defineProperty`，收集依赖只能通过`getter`，触发依赖只能通过 `setter`。新增属性，删除属性都无法触发响应式。
2. 同样的原因，我们无法让`Map`、`Set`这类数据类型转变为响应式，`Proxy`可以。
3. Vue2.x 中，为了性能的考量，**数组通过劫持原生方法的方式实现的响应式**，但是通过 `Proxy` 我们不再去考虑数组的空位导致的 empty 问题

### Proxy 并不是深层代理

对于深层的对象，proxy 只会代理第一层，并不会递归的将对象的每一层都代理到。

```js
const origin = { data: { a: 1, b: 2 }, msg: "message" };

const handler = {
  get(target, key, reciver) {
    console.log("代理");
    return Reflect.get(target, key, reciver);
  },
};

proxy.msg; // print 代理
const data = proxy.data; // print 代理

data.a; // 无 print
```

所以 Vue3.x+中`reactive`的实现，其实是递归的将对象全部都代理一边。但它并**不会在初始阶段递归响应式，而是在对象被访问的时候才递归**

```js
// reactive  使用proxy代理对象时handler.get
{
  get(target, key, receiver){
    /**... */
    const res = Reflect.get(target, key, reciver);
    /**... */
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }
    /**... */
  }
}


```

而 Vue 2.x 内部把某个对象变成响应式的时候，如果遇到对象的某个属性的值仍然是对象的时候，会递归把子对象也变成响应式。

## Vue3.x 的响应式

Vue3.x 中用到了`monorepo`，将响应式进行解耦，作为单独的`reactivity`模块。

在 Vue3.2 的更新中，有一些重大的性能改进：

- [更高效的 ref 实现（约 260% 的读取速度/约 50% 的写入速度）](https://github.com/vuejs/vue-next/pull/3995)
- [约 40% 更快的依赖跟踪](https://github.com/vuejs/vue-next/pull/4017)
- [内存使用量减少约 17%](https://github.com/vuejs/vue-next/pull/4001)

这简直是一个叼炸天的优化，而且这个优化还是一个社区大佬[@basvanmeurs](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbasvanmeurs)实现的。

接下来我们简单分析一下 Vue3.2 之前的版本（依赖收集和派发通知的实现）。

### 响应式实现原理

![流程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0f9355f8264475e9b4d662eb8380b48~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 依赖收集

核心就是在访问响应式数据的时候，触发`getter`函数，进而执行`track`函数收集依赖：

```js
let shouldTrack = true;
// 当前激活的effect
let activeEffect;
// 原始数据对象map
const targetMap = new WeakMap();
// target 表示原始数据；type 表示这次依赖收集的类型；key 表示访问的属性。
function track(target, type, key) {
  if (!should || activeEffect === undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    // 每个key对应一个dep集合
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    // 收集当前激活的effect作为依赖
    dep.add(activeEffect);
    // 当前激活的 effect 收集 dep 集合作为依赖
    activeEffect.deps.push(dep);
  }
}
```

![track](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0df1a9ca4b9459ca0287c613d9e9b04~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

因此每次执行`track`函数，就是把当前激活的副作用函数`activeEffect`作为依赖，然后收集到`target`相关的`depsMap`对应`key`的依赖集合`dep`中。

#### 派发通知

派发通知发生在数据更新的阶段，核心就是在修改响应式数据时，触发`setter`函数，

```js
function trigger(target, type, key) {
  // 拿到target对应的依赖集合
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    // 没有依赖，直接返回
    return;
  }
  // 创建运行的effects集合
  const effects = new Set();
  // 添加effects的函数
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        effects.add(effect);
      });
    }
  };
  // SET | ADD | DELETE 操作之一，添加对应的 effects
  if (key !== void 0) {
    add(depsMap.get(key));
  }
  const run = (effect) => {
    // 调度执行
    if (effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      // 直接执行
      effect();
    }
  };
  // 遍历执行effects
  effects.forEach(run);
}
```

`trigger`函数主要做了四件事情：

- 从`targetMap`中拿到`target`对应的依赖集合`depsMap`;
- 创建运行的`effects`集合
- 根据`key`从`depsMap`中找到对应的`effect`添加到`effects`集合
- 遍历`effects`执行相关的副作用函数。

因此每次执行`trigger`函数，就是根据`target`和`key`，从`targetMap`中找到相关的副作用函数遍历执行一遍。

#### 副作用函数

上面也提到了 effect，其实就是**副影响函数**

```js
import { reactive, effect } from "@vue/reactivity";
const counter = reactive({ num: 0 });

const fn = () => console.log(counter.num);

effect(fn); // print 0

counter.num++; // print 1
```

看了这个例子，其实通俗点可以说 effect 是‘**搭桥**’的，让**响应数据**`counter`和使用了**响应数据的函数**`fn`，互相建立联系。

下面是它的实现：

```js
// 全局effect栈
const effectStack = [];
// 当前激活的effect
let activeEffect;

function effect(fn, options = {}) {
  if (isEffect(fn)) {
    // 如果fn已经是一个effect函数了，则指向原始函数
    fn = fn.raw;
  }
  // 创建一个wrapper，它是一个响应式的副作用函数
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    // lazy配置，计算属性会用到，非lazy则直接执行一次
    effect();
  }
  return effect;
}

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effect.active) {
      // 非激活状态，则判断如果非调度执行，则直接执行原始函数。
      return options.scheduler ? undefined : fn();
    }
    if (!effectStack.includes(effect)) {
      // 清空effect引用的依赖
      cleanup(effect);
      try {
        // 开启全局shouldTrack，允许依赖收集
        enableTracking();
        // 压栈
        effectStack.push(effect);
        activeEffect = effect;
        // 执行原始函数
        return fn();
      } finally {
        // 出栈
        effectStack.pop();
        // 恢复shouldTrack开启之前的状态
        resetTracking();
        // 指向栈最后一个effect
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid++;
  // 标识是一个effect函数
  effect._isEffect = true;
  // effect 自身的状态
  effect.active = true;
  // 包装的原始函数
  effect.raw = fn;
  // effect 对应的依赖，双向指针，依赖包含对effect的引用，effect也包含对依赖的引用
  effect.deps = [];
  // effect 的相关配置
  effect.options = options;
  return effect;
}
function cleanup(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
```

- `reactiveEffect`函数就是响应式的副作用函数，当执行`trigger`过程派发通知的时候，执行的`effect`就是它。
- `effectStack`: 栈用来保存当前正在执行的 `effect`，因为 `effect` 之间经常会存在层叠的调用。
- `activeEffect`: 当前正在执行的栈顶的那个 `effect`，好让 `ReactiveData` 更加精准的收集到这个依赖
- `cleanup`: 清空`reactiveEffect`函数对应的依赖。在执行`track`函数的时候，除了收集当前激活的`effect`作为依赖，还通过`activeEffect.deps.push(dep)`把`dep`作为`activeEffect`的依赖，这样在`cleanup`的时候就可以找到`effect`对应的`dep`了，然后把`effect`从这些`dep`中删除。

那为什么需要`cleanup`呢？如果遇到这种场景：

```html
<template>
  <div v-if="state.showMsg">{{ state.msg }}</div>
  <div v-else>{{ Math.random()}}</div>
  <button @click="toggle">toggle</button>
  <button @click="switchView">switch</button>
</template>
<script setup>
  const state = reactive({
    msg: "Hello World",
    showMsg: true,
  });
  const toggle = () => {
    state.msg = state.msg === "Hello World" ? "Hello Vue" : "Hello World";
  };
  const switchView = () => {
    state.showMsg = !state.showMsg;
  };
</script>
```

如果没有 `cleanup` 的时候，在第一次渲染模板的时候，`activeEffect`是组件的副作用渲染函数，因为模板 `render` 的时候访问了 `state.msg`。然后点击`Swtich`按钮，试图切换为显示随机数，此时再点击 Toggle 按钮，由于修改了 `state.msg` 就会派发通知，又触发了组件的重新渲染。

这样的行为不符合逾期，所以 `cleanup` 就是为了**避免上一次收集到的依赖，本次不需要去收集的情况所导致的依赖收集错误**。

#### 哪里可以优化

可以优化的地方就在于这个 `cleanup`，每当 effect 再次执行的时候，都要先将上一次收集过的清空掉，重新进行收集。这个过程牵涉到大量对`Set`集合的添加和删除操作。

但是大部分场景中依赖的变动其实相对较小，并不需要如此大刀阔斧的进行全部清空，再次收集。

我们可以通过**提前标记旧的依赖**，当执行完 `effect` 之后，**再标记新的依赖**，通过新旧对比，来判断依赖是否需要进行清理和保留

### Vue3.2 是如何优化的

#### 依赖收集的优化

先通过给依赖集合`dep`添加两个属性，标识每个依赖集合的状态（新收集的，还是已经被收集过的）

```js
export const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
```

其中`w`表示是否已经被收集，`n`表示是否新收集。

然后设计几个全局变量，`effectTrackDepth`、`trackOpBit`、`maxMarkerBits`。

其中 `effectTrackDepth` 表示递归嵌套执行 effect 函数的深度；`trackOpBit` 用于标识依赖收集的状态；`maxMarkerBits`表示最大标记的位数。

```js
function effect(fn, options) {
  if (fn.effect) {
    fn = fn.effect.fn;
  }
  // 创建 _effect 实例
  const _effect = new ReactiveEffect(fn);
  if (options) {
    // 拷贝 options 中的属性到 _effect 中
    extend(_effect, options);
    if (options.scope)
      // effectScope 相关处理逻辑
      recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    // 立即执行
    _effect.run();
  }
  // 绑定 run 函数，作为 effect runner
  const runner = _effect.run.bind(_effect);
  // runner 中保留对 _effect 的引用
  runner.effect = _effect;
  return runner;
}

class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    // effect 存储相关的 deps 依赖
    this.deps = [];
    // effectScope 相关处理逻辑
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    if (!effectStack.includes(this)) {
      try {
        // 压栈
        effectStack.push((activeEffect = this));
        enableTracking();
        // 根据递归的深度记录位数
        trackOpBit = 1 << ++effectTrackDepth;
        // 超过 maxMarkerBits 则 trackOpBit 的计算会超过最大整形的位数，降级为 cleanupEffect
        if (effectTrackDepth <= maxMarkerBits) {
          // 给依赖打标记
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          // 完成依赖标记
          finalizeDepMarkers(this);
        }
        // 恢复到上一级
        trackOpBit = 1 << --effectTrackDepth;
        resetTracking();
        // 出栈
        effectStack.pop();
        const n = effectStack.length;
        // 指向栈最后一个 effect
        activeEffect = n > 0 ? effectStack[n - 1] : undefined;
      }
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
```

当`run`函数执行的时候，我们注意到`cleanup`函数不再默认执行，在封装的函数`fn`执行前，首先执行 `trackOpBit = 1 << +effectTrackDepth` 记录 `trackOpBit`，然后对比递归深度是否超过了`maxMarkerBits`，如果超过（通常情况下不会）则仍然执行老的 cleanup 逻辑，如果没超过则执行 `initDepMarkers` 给依赖打标记：

```js
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
```

`initDepMarkers` 函数实现很简单，遍历`_effect`实例中的`deps`属性，给每个`dep`的`w`属性标记为`trackOpBit`的值。

接下来会执行`fn`函数，就是副作用函数封装的函数；

当 `fn` 函数执行的时候，会访问到响应式数据，就会触发他们的 `getter`，进而执行 `track` 函数执行依赖收集。相应的，依赖收集的过程也做了一些调整：

```js
function track(target, type, key) {
  if (!shouldTrack || !activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 每个 target 对应一个 depsMap
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    // 每个 key 对应一个 dep 集合
    depsMap.set(key, (dep = createDep()));
  }
  const eventInfo =
    process.env.NODE_ENV !== "production" ? { effect: activeEffect, target, type, key } : undefined;
  trackEffects(dep, eventInfo);
};

function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      // 标记为新依赖
      dep.n |= trackOpBit;
      // 如果依赖已经被收集，则不需要再次收集
      shouldTrack = !wasTracked(dep);
    }
  } else {
    // cleanup 模式
    shouldTrack = !dep.has(activeEffect);
  }
  if (shouldTrack) {
    // 收集当前激活的 effect 作为依赖
    dep.add(activeEffect);
    // 当前激活的 effect 收集 dep 集合作为依赖
    activeEffect.deps.push(dep);
    if (process.env.NODE_ENV !== "production" && activeEffect.onTrack) {
      activeEffect.onTrack(
        Object.assign(
          {
            effect: activeEffect,
          },
          debuggerEventExtraInfo
        );
      );
    }
  }
}
```

fn 执行完后：

```js
finally {
  if (effectTrackDepth <= maxMarkerBits) {
    // 完成依赖标记
    finalizeDepMarkers(this)
  }
  // 恢复到上一级
  trackOpBit = 1 << --effectTrackDepth
  resetTracking()
  // 出栈
  effectStack.pop()
  const n = effectStack.length
  // 指向栈最后一个 effect
  activeEffect = n > 0 ? effectStack[n - 1] : undefined
}


```

在满足依赖标记的条件下，需要执行`finalizeDepMarkers`完成依赖标记：

```js
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      // 曾经被收集过但不是新的依赖，需要删除
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      // 清空状态
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
```

`finalizeDepMarkers` 主要做的事情就是找到那些曾经被收集过但是新的一轮依赖收集没有被收集的依赖，从 `deps` 中移除。这其实就是解决前面举的需要 `cleanup` 的场景：在新的组件渲染过程中没有访问到的响应式对象，那么它的变化不应该触发组件的重新渲染。
以上就实现了依赖收集部分的优化，可以看到相比于之前每次执行 effect 函数都需要先清空依赖，再添加依赖的过程，现在的实现会在每次执行 effect 包裹的函数前标记依赖的状态，过程中对于已经收集的依赖不会重复收集，执行完 `effect` 函数还会移除掉已被收集但是新的一轮依赖收集中没有被收集的依赖。
优化后对于 `dep` 依赖集合的操作就减少了，自然也就优化了性能。

#### trackOpBit 的设计

细心的你可能会发现，标记依赖的 `trackOpBit`，在每次计算时采用了左移的运算符 `trackOpBit = 1 << ++effectTrackDepth`；并且在赋值的时候，使用了或运算：

```js
deps[i].w |= trackOpBit;
dep.n |= trackOpBit;
```

那么为什么这么设计呢？因为 `effect` 的执行可能会有递归的情况，通过这种方式就可以记录每个层级的依赖标记情况。

在判断某个 dep 是否已经被依赖收集的时候，使用了 wasTracked 函数：

```js
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
```

通过与运算的结果是否大于`0`来判断，这就要求依赖被收集时嵌套的层级要匹配。

举个例子，假如此时`dep.w` 的值是 `2`，说明它是在第一层执行 `effect` 函数时创建的，但是这时候已经执行了嵌套在第二层`effect`函数，`trackOpBit`左移两位变成了`4`，`2 & 4` 的值是 `0`，那么 `wasTracked` 函数返回值为 `false`，说明需要收集这个依赖。显然，这个需求是合理的。
