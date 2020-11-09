---
title: Vue项目TypeScript指南
date: 2020-11-08
tags:
  - TypeScript
categories:
  - frontEnd
---

## 1. TypeScript 优势

- Javascript 的超集，完美兼容 js
  - 从核心语法方面和类概念方面对 JavaScript 对象模型进行扩展
  - 扩展了 js 的语法，相较于 ES6，他多了装饰器、私有属性、getter/setter、抽象类
- 强类型语言（最重要的特性之一）已于重构和理解
  - 类型系统
  - 编译时的静态类型检查
- 强大的 IDE 支持，VSCode 前端必备

## 2. TypeScript 类型

- 原始类型
  - boolean
  - number
  - string
- 特殊类型
  - any 类型检查器不检查
  - void 通常见于函数没有返回值时
  - null
  - undefined
  - object 除 number，string，boolean，symbol，null 或 undefined 之外的的类型
- 数组
  - T[]
  - `Array<T>`泛型写法
- 补充

  - 联合类型 属性为多种类型之一

  ```ts
  let name: string | number = 123;
  let names: (string | number)[] = [123, "123"];
  let names: Array<string | number> = [123, "123"];
  let funcs: Array<() => string> = [() => "123"];
  ```

  - 元组类型
  - 枚举 enum 对 JavaScript 标准数据类型的一个补充
  - 接口 interface
    - ?:可选属性
    - readonly 只读属性
    - 额外的属性检查
    - 内联类型注解 `let name:{first:string;second:string;}`
  - 函数
  - 类（和 ES6 类似，但早于 ES6）

### 2.1 Interface & type

两者基本没什么差别，平时开发能用 interface 尽量用
type(类型别名)会给类型起一个新的名字，type 可以作用于原始值（基本类型） ，联合类型，元组以及其他任何你需要手写的类型

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}
type Person = {
  name: string;
  age: number;
};
type Animal = Person | string;
```

### 2.2 联合声明

```ts
interface Person {
  name: string;
  age: number | string;
}
```

### 2.3 数组声明

```ts
interface Person {
  name: string;
  age: number;
  schools: string[];
}
```

### 2.4 元组

```ts
let tom: [string, number] = ["tom", 123];
```

### 2.5 可选类型

```ts
interface Person {
  name: string;
  age?: number;
}
```

### 2.6 任意类型

```ts
interface Person {
  name: string;
  age: number;
  [key: string]: string;
}
```

### 2.7 简写类型

```ts
interface Person {
  name: string;
  age: number;
  attr: { label: string; value: string; color?: string; tips?: string };
}
```

### 2.8 泛型

```ts
export interface PagingResponseMsg<T>{
  code: number;
  message: string;
  data:T;
  totalCount?:number；
  pageNow?: number;
  pageSize?: number;
  pageCount?:number
}
```

### 2.9 keyof

```ts
const todo = {
  id: 1,
  name: "james",
};
type K = keyof todo; //'id' | 'name

// K是T返回的union类型中的一种
// 并且返回值为K[T]类型
function prop<T, K extends keyof T>(obj:T,key: K){
  return obj[key];
}
prop(todo, 'name)
```

### 2.10 `key in keyof T`

```ts
interface iPoint {
  x: number;
  y: number;
}
type Name<T> = { [P in keyof T]: T[P] };
type real = Name<iPoint>;
```

## 3. TypeScript Vue 使用

TS 除了类型系统以及 IDE 提示外，最重要的特性之一就是可以使用装饰器。使用装饰器可以用极简的代码代替以前冗长的代码。

### 3.1 vue-class-component

![vue-class-component](https://github.com/vuejs/vue-class-component)是官方维护的 TypeScript 装饰器，他是基于类的 API，Vue 对其做到完美兼容。

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

![vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)完全基于 vue-class-component，但它扩展了很多的特性，极大的方便了 Vue 的写法，它包括 7 个装饰器以及 1 个函数

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

:::

## 4. TypeScript 描述文件

typescript 的描述文件，以 d.ts 结尾的文件名。大部分编辑器能识别 d.ts 文件，当你写 js 代码的时候给你智能提示。declare 全局提示，是的 ts 可以找到并识别出

在我们尝试给一个 npm 包创建声明文件之前，需要先看看他的声明文件是否存在。一般来说，npm 包的声明文件可能存在于两个地方：

- 与该 npm 包绑定在一起。判断依据时 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以自己在创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起
- 发布到@types 里。我们只需要安装以下对应的@types 包就知道是否存在该声明文件。这种模式一般是 i 由于 npm 包的维护者没有提供声明文件，所以只能由其他人将生命文件发布到@types 里了

### 4.1 全局变量 - 应用端补充

针对的是在应用端，`无import写法 + 补充npm包的全局变量`，(通过`<script>`标签引入第三方库，注入全局变量)

```ts
declare var aaa: number | string;
// ?表示非必须，!?表示一定要有值
declare function getName(id?: number | string): string;
declare function render(callback?: () => void): string;
declare class Person {
  static maxAge: number;
  constructor(name: string, age: number);
}
```

### 4.2 npm 包 - 应用端补充

针对的是在应用端，`import写法 + 补充npm包的变量`
核心：`只有在声明文件中使用export导出，然后再使用import导入后，才会用到这些类型声明`

#### 方法一： 文件位置随意，源码中指定`declare module xxx`

```ts
declare module "abcd" {
  export let a: number;
  export function b(): number;
  export namespace c {
    let cd: string;
  }
}
let aaa = require("abcd");
aaa.b();
```

```ts
declare module "app" {
  // 导出是文件本身
  function aaa(some: number): number;
  export = aaa;
}
// 调用
let app = app();
app(1);
```

### 方法二：源码直接 export，但文件位置有要求

指定到对应的`@types/moduleName/index.d.ts`文件，自动去除该文件找出 export，此时就不需要`declare module 'moduleName'`了

```ts
// types/abcd/index.d.ts
export let a: number;
export function b(): number;
```

::: tips 总结
d.ts 文件(A.d.ts)文件放到哪个目录里，如果是模块化的话就放到和源码（A.js）文件的同一个目录下，如果是全局变量的话理论上放到哪都可以。
----以上说的是未在 tsconfig.json 文件里面特殊配置过
:::

### 4.3 扩展 npm 包 - 应用端补充

有时通过 import 导入一个插件模板，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模板没有类型声明文件（最常见的定义是`Vue.prototype.$xxx`），就会导致类型不完整，缺少部分的类型。
ts 提供了一个语法`declare module`，它可以用来扩展原有模块的类型

```ts
// 如果是需要扩展原有模块的话，需要类型声明文件中先引用原有模块，再使用declare module扩展原有模块
import Vue from "vue";
declare module "vue/types/vue" {
  interface Vue {
    $openDialog: Function;
    $closeDialog: Function;
  }
}
```

::: warning
在全局变量的声明文件中，是不允许出现 import,export 关键字。一旦出现了，那么他就会被视为一个 npm 库或 UMD 库，就不再是全局变量的声明文件了
:::

### 4.4 发布 npm 包-npm 源码端补充

1. [自动生成声明文件](https://ts.xcatliu.com/basics/declaration-files.html#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6)

   如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，添加 declaration 选项，那么可以同时叶生成 d.ts 文件了。此时每个 ts 文件都会生成 d.ts 文件，使用方可以单独 import 每个 ts 子文件

2. [发布声明文件](https://ts.xcatliu.com/basics/declaration-files.html#%E5%8F%91%E5%B8%83%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6)
   1. 如果声明文件是`通过tsc自动生成`的，那么无需做任何其他配置，只需要把编译好的文件也发布到 npm 上，使用方就可以获取到类型提示了（因为每一个 ts 文件都有对应的.d.ts 文件）。
   2. 如果是`手动写的声明文件`，那么需要满足以下条件之一，才能被正确的识别：
      1. 给 package.json 中的 types 或 typings 字段指定一个类型声明文件地址
      2. 在项目根目录，编写一个`index.d.ts`文件
      3. 针对入口文件（package.json 中的 main 字段指定的入口文件），编写一个同命不同后缀的.d.ts 文件

使用 ts 书写后缀时，自动生成同时，也可以手动设置 d.ts 文件

```ts
declare module "xxx";
export * from "../lib";
```

## 5 tsconfig.json
