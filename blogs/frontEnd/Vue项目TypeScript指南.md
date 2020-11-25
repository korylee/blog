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

### 2.11 交叉类型

在 JavaScript 中,`extend`是一种非常常见的模式,在这种模式中,你可以从两个对象中创建一个新对象,新对象拥有着两个对象的所有功能。

交叉类型可以让你安全的使用此种模式：

```ts
function extend<T extends object, U extends object>(
  first: T,
  second: U
): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result[id]) = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) (<U>result)[id] = second[id];
  }
  return result;
}

const x = extend({ a: "hello" }, { b: 42 });
const a = x.a;
const b = x.b;
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

### 1. experimentalDecorators

`是否启用实验性的ES装饰器`。Boolean 类型，默认 false，[官方解释](https://www.typescriptlang.org/docs/handbook/decorators.html)

TypeScript 和 ES6 引入了 Class 的概念，同时在[stage 2 proposal](https://github.com/tc39/proposal-decorators)提出了 java 等服务端语言早就有的装饰器模式，能极大简化书写代码，把一些通用逻辑封装到装饰器中。很多库都有用到该特性，比如 vue-class-component 和 vuex-class。_当你使用这些库时，必须开启 experimentalDecorators_.

```ts
function f() {
  console.log("f();evaluated");
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("fn() called");
  };
}
```

> 启用 vuex-class 它是需要设置`strictFunctionTypes`选项为 false

### 2. strictPropertyInitialization

`是否类的undefined属性已经在构造函数里初始化`.boolean 类型,默认值:false
直白点,就是所有的属性值,都需要赋有初始值.建议把 strictPropertyInitialization 设置为 false,这样就不需要定义一个变量就必须附有初始值.对使用 vuex-class 的同学,建议把这个值设为 false,绝对能省很多事。

```ts
export default class Home extends Vue {
  jobId: string;
  method1(): void {
    console.log(this.jobId);
  }
}
```

> 如果设置该选项为 true,需要同时启用--strictNullChecks 或启用 --strict

### 3. noImplicitAny

`有隐含的any类型时报错`。boolean 值,默认值为 false

### 4. target

`指定编译的ECMAScript目标版本`.枚举值"ES3","ES5","ES6/2015","ES2016","ES2017","ESNext"。默认值“ES3”

typescript 是 ES6 的超集，所以你可以使用 ES6 来编写 ts 代码（通常我们也的确这么做）。然而，当编译 ts 代码时，可以把 ts 转为 ES5 或更早的 js 代码。所以需要选择一个编译的目标版本。vue-cli3 的 typescript 模板，设置为“ESNext”，因为现代大部分应用项目都会使用 webpack 进行打包,webpack 会把你的代码转换成在所有浏览器中可以运行的代码

### 5. module

`指定生成哪个模块系统代码`.枚举值:"None","CommonJS","AMD","System","UMD","ES6","ES2015","ESNext"。默认值会根据--target 选项不同而不同，当 target 设置为 ES6 时，默认 module 为“ES6”,否则为"commonjs"

通常使用 ES6 的模块系统来写代码,然而在 2015 年 1 月以前,基本上没有浏览器原生支持 ES6 的模块系统,所以需要转换为不同的模块的模块系统,如:CommonJS,AMD,SystemJS 等,而 module 选项就是指定编译使用对应的模块系统

### 6. lib

`编译过程需要引入的库文件的列表`,string 类型，可选的值有很多，常用的有 ES5，ES6，ESNext，DOM，DOM.iterable，WebWorker，ScriptHost 等。该值默认值是根据--target 选项不同而不同。当 target 为 ES5 时，默认值为['DOM','ES5','ScriptHost'];当 target 为 ES6 时,默认值为['DOM','ES6','DOM.iterable','ScriptHost']

为了在 ts 代码中使用 ES6 中的类,比如 Array.from、Set、Reflect 等，需要设置 lib 选项，在编译过程中把这些标准库引入。这样在编译过程中，如果遇到属于这些标准库的 class 或 api 时，ts 编译器不会报错

### 7. moduleResolution

`决定如何处理模块`.string 类型,"node 或者 classic",默认值"classic".[官方解释](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

也就是遇到`import {AAA} from './aaa`该如何去找对应文件模块.对于工程项目, 建议使用 node(vue-cli3 ts 模板默认设置为 node 策略),因为这个更符合平时的书写习惯和认知

::: tip
//在源文件/root/src/A.ts 中 import {b} from "./moduleB"
// 两种解析方式查找方式不同'

classic 解析方式

1. /root/src/moduleB.ts
2. /root/src/moduleB.d.ts

node 模块解析方式

1. /root/src/moduleB.ts
2. /root/src/moduleB.tsx
3. /root/src/moduleB.d.ts
4. /root/src/moduleB.package.json(if it specifies a "types" property)
5. /root/src/moduleB/index.ts
6. /root/src/moduleB/index.tsx
7. /root/src/moduleB/index.d.ts

:::

### 8. paths

`模块名或路径映射的列表`。Object 值

这是一个非常有用的选项，比如我们经常使用`@/utils/help`来代替`../src/utils/help`

```json
{
  "baseUrl": ".", //注意:baseUrl必不可少
  "path": { "@/*": ["src/*"] } //映射列表
}
```

### 9. strictNullChecks

`是否开启严格的null检查模式`。boolean 值，默认值 false

未处理的 null 和 undefined 经常会导致 bug 产生，所以 typescript 包含了 strictNullChecks 选项来帮助我们减少对这种情况的担忧。当启用了 strictNullChecks，null 和 undefined 获得了他们自己各自的类型 null 和 undefined。开启该模式有助于发现并处理可能为 undefined 的赋值。
:::warning 注意
启用--strict 相当于启用

--noImplicitAny，--noImplicitThis，--alwaysStrict，--strictNullChecks，--StrictFunctionTypes 和 --strictPropertyInitialization
:::

### 10. noUnusedLocals

`有未使用的变量时，是否抛出错误`。boolean 值，默认值：false

### 11. noUnUsedParameters

`有未使用的参数时,是否抛出错误`。boolean 值，默认值：false

### 12. allowJS

`是否允许编译 js 文件`。 boolean 值，默认值：false

### 13.typeRoots 和 types

默认所有可见的"@types"包含在编译过程中被包含进来。如果指定了 typeRoots，只有 typeRoots 下面的包才会被包含进来。

> 可以指定“types”：[]来禁用自动引入@types 包

### 14. files、include 和 exclude

`编译文件包含哪些文件以及排除哪些文件`

未设置 include 时，编译器默认包含当前目录和子目录下所有的 Typescript 文件（.ts , .d.ts 和.tsx）。如果 allowJs 被设置为 true，JS 文件（js 和 jsx）也被包含进来。exclude 排除那些不需要编译的文件或文件夹

```json
{
  "compilerOptions": {},
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 15. tsconfig.json 全解析

```json
{
  "compilerOptions": {
    /*基本选项*/
    "target": "ES5", //指定ECMAScript目标版本:"ES3"(default),"ES5","ES2015","ES2016","ES2017" or "ESNext"("ESNext"表示最新的ES语法,包括还处在stage x阶段)
    "module": "commonjs", // 指定使用模块:"commonjs","amd","system","umd"or"es2015"
    "lib": [], // 指定要包含在编译中的库文件
    "allowjs": true, // 允许编译javascript文件
    "checkjs": true, // 报告javascript文件中的错误
    "jsx": "preserve", // 指定jsx代码的生成:"preserve","react-native",or"react"
    "declaration": true, // 生成相应的".d.ts"文件
    "sourceMap": true, // 生成相应的".map"文件
    "outFile": "./", // 将输出文件合并为一个文件
    "outDir": "./", // 指定输出目录
    "rootDir": "./", // 用来控制输出目录结构 --outDir
    "removeComments": true, //删除编译后的所有注释
    "noEmit": true, // 不生成输出文件
    "importHelpers": true, // 从tslib导入扶住工具函数
    "isolatedModules": true, // 将每个文件作为单独的模块(与'ts.transpileModule类似)

    /*严格的类型检查选项*/
    "strict": true, // 其用所有的严格类型的检查选项
    "noImplicitAny": true, //在表达式和声明上有隐含的any类型时报错
    "strictNullChecks": true,
    "noImplicitThis": true, // 当this的表达式为any类型的时候,生成一个错误
    "alwaysStrict": true, //以严格的检查每个模块,并在每个文件里加入"use strict"
    /*额外的检查*/
    "noUnusedLocals": true, // 有未使用的变量时,抛出错误
    "noUnUsedParameters": true, // 有未使用的参数时,抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告switch语句中的fallthrough错误（即，不允许switch的case语句贯穿）

    /*模块解析选项*/
    "moduleResolution": "node", //选择模块解析策略:'node' or 'classic'(TypeScript pre-1.6),默认是'classic'
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {}, // 模块名到基于baseUrl的路径映射列表
    "rootDirs": [], // 更稳健夹列表,其组合内容表示项目运行时的结构内容
    "typeRoots": [], //包含类型声明的文件夹列表
    "types": [], //需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true, //允许从没有设置默认导出的模块中默认导入

    /* Source Map Options*/
    "sourceRoot": "./", //指定调试器应该找到TypeScript文件而不是源文件的位置
    "mapRoot": "./", //指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true, //生成单个sourcemaps文件,而不是将sourcemaps生成不同的文件
    "inlineSources": true, //将代码与sourcemaps生成到一个文件中,要求同时设置了 --inlineSourceMap或--sourceMap属性

    /* 其他选项*/
    "experimentalDecorators": true, //启用装饰器
    "emitDecoratorMetadata": true, // 为装饰器提供元数据的支持
    "strictFunctionTypes": false // 禁用函数参数双向协变检查
  },
  /*指定编译文件或排除其他编译文件*/
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"],
  "files": ["core.ts", "sys.ts"],
  "extends": "./config/base", // 从另一个配置文件里继承配置

  //让IDE在保存文件时根据tsconfig.json重新生成文件
  "compileOnSave": true // 支持这个特性需要Visual Studio 2015,TypeScript1.8.1以上并且安装atom-typescript插件
}
```

## 站在巨人肩膀上

- [springleo's blog](https://lq782655835.github.io/blogs/project/ts-tsconfig.html)
