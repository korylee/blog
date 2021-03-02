---
title: Typescript vue 使用
date: 2020-11-20
tags:
  - vue
  - TypeScript
categories:
  - frontEnd
---

## 3. TypeScript Vue 使用

TS 除了类型系统以及 IDE 提示外，最重要的特性之一就是可以使用装饰器。使用装饰器可以用极简的代码代替以前冗长的代码。

### 3.1 vue-class-component

[vue-class-component](https://github.com/vuejs/vue-class-component)是官方维护的 TypeScript 装饰器，他是基于类的 API，Vue 对其做到完美兼容。

- Component 官方提供的 Component 装饰器
- mixins
- createDecorator 官方提供的创建装饰器函数，vue-component-decorator/vuex-class 库中的各个属性/方法装饰器底层都是调用该函数

```ts
import vue from "vue";
import Component from "vue-class-component";
@Component({
  props: { propMessage: String },
  component: {},
  filter: {},
  directive: {},
})
export default class App extends Vue {
  name: string = "Simon Zhang";
  helloMsg = "hello," + this.propMessage;
  // computed
  get MyName(): string {
    return `my name is ${this.name}`;
  }
  mounted() {
    this.sayHello();
  }
  // methods
  sayHello() {
    alert(`Hello ${this.name}`);
  }
}
```

### 3.2 vue-property-decorator

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)完全基于 vue-class-component，但它扩展了很多的特性，极大的方便了 Vue 的写法，它包括 7 个装饰器以及 1 个函数

- @Prop
- @Watch
- @Component(provide by vue-class-component)
- @Emit
- @Model
- @inject
- @provide
- @Mixins(the helper function named mixins provided by vue-class-component)

```ts
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component
export default class YourComponent extends Vue {
  @Prop(Number) propA!: number;
  @Prop({ default: "default value" }) propB!: string;
  @Prop([string, boolean]) propC!: string | boolean;
  @Watch('person',{immediate:true,deep:true})
  onPersonChanged(val:Person.oldValue:person){}
  /**
   * equal
   * watch:{
   * 'person':[{handler:'onpPersonChanged', immediate:true, deep:true}]}
  */
 @Emit()
 returnValue(){
   return 10
 }
 /**equal
  * return Value(){
  * this.$emits('return-value',10)}
 */
}
```

### 3.3 Vuex-class

[vuex-class](https://github.com/ktsn/vuex-class)是基于 vue-class-component 对 vuex 提供的装饰器

- @State
- @Getter
- @Mutation
- @Action
- namespace

```ts
import Vue from "vue";
import Component from "vue-class-component";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
const someModule = namespace("path/to/module");
@Component
export class MyComp extends Vue {
  @State("foo") stateFoo;
  @State((state) => state.bar) stateBar;
  @Getter("foo") getterFoo;
  @Action("foo") actionFoo;
  @Mutation("foo") mutationFoo;
  @someModule.Getter("foo") moduleGetterFoo;

  // If the argument is omitted, use the property name
  // for each state/getter/action/mutation type
  @State foo;
  @Getter bar;
  @Action baz;
  @Mutation qux;

  created() {
    this.stateFoo; // -> store.state.foo
    this.stateBar; // -> store.state.bar
    this.getterFoo; // -> store.getters.foo
    this.actionFoo({ value: true }); // -> store.dispatch('foo', { value: true })
    this.mutationFoo({ value: true }); // -> store.commit('foo', { value: true })
    this.moduleGetterFoo; // -> store.getters['path/to/module/foo']
  }
}
```

::: warning 注意
使用 vuex-class 等库时，需要再 tsconfig.json 配置中打开 TypeScript 装饰器。建议再工程目录中设置如下三个配置：`experimentalDecorator`、`strictFunctionTypes`、`strictPropertyInitialization`

```json
{
  "compilerOptions": {
    // 启用装饰器，需要在vue-class-component及vuex-class需要开启此选项
    "experimentalDecorator": true,
    // 启用vuex-class 需要关闭此选项
    "strictFunctionTypes": false,
    // 是否必须要有初始值。vuex-class最好开启此项，不然所有的@state等装饰器都需要设置初始值。设置值为false
    "strictPropertyInitialization": false
  }
}
```
