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
  - 扩展了 js 的语法，相较于 ES6，他多了装饰器、私有属性、`getter`/`setter`、抽象类
- 强类型语言（最重要的特性之一）已于重构和理解
  - 类型系统
  - 编译时的静态类型检查
- 强大的 IDE 支持，VSCode 前端必备

## 基础类型

### `any` 和 `unknown`的区别

- `any`:任意类型
- `unknown`:未知的类型

任何类型都能分配给`unknown`,但`unknown`不能分配给其他基本类型, 而`any`啥都能分配和被分配。

```ts
let foo: unknown;

foo = true;
foo = 123;

foo.toFixed(2); // error
let foo1: string = foo; // error
```

### unknown 的正确用法

我可以用不同的方式将`unknown`类型缩小为更具体的类型范围：

```ts
function getLen(val: unknown): number {
  if (typeof value === 'string') return value.length;
  return 0;
}
```

> 这个过程就是类型收窄（type narrowing）

### never

`never`一般表示无法达到的类型。在新的 typescript3.7 中，下面的代码会报错

```ts
//never 用户控制流分析
function neverReach(): never {
  throw new Error('an error');
}
const x = 2;
neverReach();

x.toFixed(2); // x is unreachable
```

`never`还可以由于联合类型的**幺元**

```ts
type To = string | number | never; // To is string | number
```

## 类型兼容性

typescript 的子类型是基于`结构子类型`的,只要结构兼容,就是子类型(duck type)

```ts
class Point {
  x: number;
}
function getPointX(point: Point) {
  return point.x;
}
class Point2 {
  x: number;
}
let point2 = new Point2();
getPointX(point2);
```

### 对象子类型

子类型中必须包含原类型所有的数学和方法

```ts
function getPointX(point: { x: number }) {
  return point.x;
}
const point = { x: 1, y: '2' };
getPointX(point); // OK
```

::: warning

如果直接传入一个对象字面量是会报错的:

```ts
function getPointX(point: { x: number }) {
  return point.x;
}
getPointX({ x: 1, y: '2' });
```

这里 ts 中的另一个特性,叫做`excess property check`, 当传入的参数是一个对象字面量时,会进行**额外属性检查**。
:::

### 函数子类型

介绍函数子类型前先介绍一下**逆变**与协变的概念，**逆变**与**协变**并不是 TS 中独有的概念，在其他的静态语言中也有相关理念

在介绍之前，先假设一个问题，约定如下标记

- `A ≼ B` 表示 A 是 B 的子类型， A 包含 B 的所有属性和方法
- `A => B` 表示以 A 为参数，B 为返回值的方法。`(param: A) => B`

如果我们现在有两个类型`Animal`、`Dog`、`WangCai`,那么肯定存在下面的关系

```
Wang ≼ Dog ≼ Animal // 即旺财属于狗属于动物
```

**问题**： 以下哪种类型是`Dog => Dog`的子类呢？

- `WangCai => WangCai`
- `WangCai => Animal`
- `Animal => Animal`
- `Animal => WangCai`
  **从代码来看解答**

```ts
class Animal {
  sleep: Function;
}
class Dog extends Animal {
  bark: Function;
}
class WangCai extends Dog {
  dance: Function;
}
function getDogName(cb: (dog: Dog) => Dog) {
  const dog = cb(new Dog());
  dog.bark();
}
// 对于入参来说，WangCai是Dog的子类，Dog类上没有dance方法，产生异常
// 对于出参来说，WangCai类继承了Dog类，肯定会有bark方法
getDogName((wangcai: WangCai) => {
  wangcai.dance();
  return new Animal();
});
// 对于入参来说，Animal类是Dog的父类，Dog类肯定有sleep方法
// 对于出参来说，Animal类上没有bark方法，产生异常
getDogName((wangcai: WangCai) => {
  wangcai.dance();
  return new Animal();
});

// 对于入参来说，Animal 类是 Dog 的父类，Dog 类肯定有 sleep 方法。
// 对于出参来说，WangCai 类继承了 Dog 类，肯定会有 bark 方法
getDogName((animal: Animal) => {
  animal.sleep();
  return new WangCai();
});

// 对于入参来说，Animal 类是 Dog 的父类，Dog 类肯定有 sleep 方法。
// 对于出参来说，Animal 类上没有 bark 方法, 产生异常。
getDogName((animal: Animal) => {
  animal.sleep();
  return new Animal();
});
```

可以看到只有`Animal => WangCai`才是`Dog => Dog`的子类型，可以得到一个结论，对于函数类型来说，函数参数的类型的兼容是相反的，我们称之为`逆变`，返回值的类型兼容是正向的，称之为`协变`。

协变与逆变的例子只说明了函数参数只有一个时的情况,如果函数参数有多个时该如何区分?

其实函数的参数可以转化为`Tuple`的类型兼容性

```ts
type Tuple1 = [string, number];
type Tuple2 = [string, number, boolean];

let tuple1: Tuple1 = ['1', 1];
let tuple2: Tuple2 = ['1', 1, true];
let t1: Tuple1 = tuple2; //ok
let t2: Tuple2 = tuple1; //error
```

可以看到`Tuple1 => Tuple2`,即长度大的时长度小的子类型,再由于函数参数的逆变特性,所以函数参数少的可以赋值给参数多的(参数从前往后需一一对应),从数组的 forEach 方法就可以看出来

```ts
[1, 2].forEach((item, index) => console.log(item));

[1, 2].forEach((item, index, arr, other) => console.log(item));
```

## 高级类型

### 联合类型和交叉类型

联合类型(union type) 表示多种类型的"或"关系

```ts
function genLen(x: string | any[]) {
  return x.length;
}
```

交叉类型表示多种类型的"与"关系

```ts
interface Person {
  name: string;
  age: number;
}
interface Animal {
  name: string;
  color: string;
}
const x: Person & Animal = {
  name: 'x',
  age: 1,
  color: 'red',
};
```

在 JavaScript 中,`extend`是一种非常常见的模式,在这种模式中,你可以从两个对象中创建一个新对象,新对象拥有着两个对象的所有功能。

交叉类型可以让你安全的使用此种模式：

```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result[id]) = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) (<U>result)[id] = second[id];
  }
  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });
const a = x.a;
const b = x.b;
```

#### 使用联合类型表示枚举

```ts
type Position = 'UP' | 'DOWN' | 'LEFT';
const position: Position = 'UP';
```

> 可以避免 enumerate 入侵了运行时

### 类型保护

ts 初学者很容易写出下面的代码:

```ts
function isString(value){
  return Object.prototype.toString.call(value) === '[object String]
}
function f(x:string|number){
  if(isString(x)) return x.length //error 类型string|number 上不存在属性"length"
  ...
}
```

如何让 ts 判断出上下文的类型呢

1. 使用 ts 的`is`关键词

```ts
function isString(value:unknown) :value is string {
  return Object.prototype.toString.call(value) === '[object String]
}
```

2. typeof 关键词
   在 ts 中,**代码实现**中的 typeof 关键词能够帮助 ts 判断出变量的基本类型

   ```ts
   function f(x: string | number) {
     if (typeof x === 'string') return x.length;
   }
   ```

3. instanceof 关键词
   在 ts 中, instanceof 关键词能够帮助 ts 判断出构造函数的类型

4. 针对 null 和 undefined 的类型保护
   在条件判断时,ts 会自动对 null 和 undefined 进行类型保护
   ```ts
   function f(x?: string) {
     if (x) return x.length;
   }
   ```
5. 针对 null 和 undefined 的类型断言
   如果当已经知道的参数不为空,可以用`!`来手动标记
   ```ts
   function f(x?: string) {
     return x!.length;
   }
   ```

### typeof 关键词

`typeof` 关键词除了做类型保护,还可以从**实现**推出**类型**。
::: warning 注意
此时的 `typeof`是一个类型关键词,只可以用在类型语法中
:::

```ts
function fn(x: string) {
  return x.length;
}
const obj = { x: 1, y: '2' };
type T0 = typeof fn; //(x:string) => number
type T1 = typeof obj; // {x:number, y: string}
```

### keyof 关键词

`keyof`也是一个**类型关键词**, 可以用来区的一个对象接口的所有的`key`值:

```ts
interface Person {
  name: string;
  age: number;
}
type PersonAttrs = keyof Person; // 'name'| 'age'
```

### in 关键词

`in`也是一个**类型关键词**, 可以对联合类型进行遍历,也可以只用在`type`关键字下面。

```ts
type Person = { [key in 'name' | 'age']: number }; // {name:number, age:number}
```

### []操作符

使用`[]`操作符可以进行索引访问， 也是一个**类型关键词**

```ts
interface Person {
  name: string;
  age: number;
}
type x = Person['name']; // x is string
```

### 小栗子

写一个类型复制的类型工具

```ts
type Copy<T> = {
  [key in keyof T]: T[key];
};
interface Person {
  name: string;
  age: number;
}
type Person1 = Copy<Person>;
```

## 泛型

泛型相当于一个类型的参数,在 ts 中,泛型可以用在`类`、`接口`、`方法`、`类型`别名等实体中

### 小试牛刀

```ts
function createList<T>(): T[] {
  return [] as T[];
}
```

> 有了泛型的支持,createList 方法可以传入一个类型,返回有类型的数组,而不是一个 any[]

### 泛型约束

如果我们希望 createList 函数只能生成指定的类型数组,可以使用`extends`关键词来约束泛型的范围和形状

```ts
type Lengthwise = { length: number };

function createList<T extends number | Lengthwise>(): T[] {
  return [] as T[];
}
const numberList = createList<number>(); // ok
const stringList = createList<string>(); // ok
const arrayList = createList<any[]>(); //ok
const booList = createList<boolean>(); //error
```

> `any[]` 十一个数组类型,数组类型是有 length 属性的,所以 ok。`string`类型也是有 length 属性的，所以 ok。但是`boolean`就不能通过这个约束了

### 条件控制

`extends`除了做约束类型,还可以做条件控制,相当于与一个三元运算符,只不过针对**类型**的

**表达式**: `T extends U ? X : Y`
**含义**: 如果 T 可以被分配给 U,则返回 X,否则返回 Y。一般条件下，如果 T 是 U 的值类型，则认为 T 可以分配给 U

```ts
type IsNumber<T> = T extends number ? true : false;
type x = IsNumber<string>; // false
```

### 映射类型

映射类型相当于一个**类型的函数**，可以做一些**类型运算**，输入一个类型，输出另一个类型

#### 几个内置的映射类型

```ts
// 用来生成一个属性为K,类型为T的类型集合
type Record<K extends keyof any, T> = {
  [P in T]: T;
};
// 每个属性都变成可选
type Partial<T> = {
  [P in typeof T]?: T[P];
};
// 每个属性都变为必选
type Required<T> = {
  [P in keyof T]-?: T[P];
};
// 每个属性都变成可读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
// 选择对象中的某些属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

typescript 2.8 在`lib.d.ts`中内置了几个映射类型

- `Partial<T>` --将`T`中的所有属性变成可选
- `Readonly<T>` --将`T`中的所有属性变成可读
- `Pick<T,U>` -- 选择`T`中可以赋值给`U`的类型
- `Exclude<T,U>` --从`T`中**剔除**所有包含的`U`属性
- `Extract<T,U>` --从`T`中**提取出**所有包含的 `U` 属性值
- `RenturnType<T>` --获得函数返回值类型
- `InstanceType<T>` -- `获得构造函数类型的实例类型

```ts
interface ApiRes {
  code: string;
  flag: string;
  message: string;
  data: object;
  success: boolean;
  error: boolean;
}
type IApiRes = Pick<ApiRes, 'code' | 'flag' | 'message' | 'data'>;
// {
//   code: string;
//   flag: string;
//   message: string;
//   data: object;
// }
```

#### extends 条件分发

对于`T extends U ? X : Y`来说,还存在一个特性,当 T 是一个联合类型时,会进行条件分发.

```ts
type Union = string | number;

type isNumber<T> = T extends number ? 'isNumber' : 'notNumber';
type UnionType = isNumber<Union>; //'notNumber'| 'isNumber'
```

实际上,extens 运算会变成如下形式

```ts
(string extends number? 'isNumber': 'NotNumber')|(number extends number? 'isNumber': 'NotNumber')
```

`Extract`就是基于此类型,再配合`never`幺元的特性实现的

```ts
type Exclude<T, K> = T extends K ? never : T;
type Extract<T, U> = T extends U ? T : never;
type T1 = Exclude<string | number | boolean, string | boolean>; // number
type T2 = Extract<string | number | boolean, string | boolean>; // string |  boolean
```

#### `infer` 关键词

`infer` 可以对运算中心的类型进行存储,内置的`ReturnType` 就是基于此特性实现的

```ts
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;
```

## TypeScript 描述文件

typescript 的描述文件，以 d.ts 结尾的文件名。大部分编辑器能识别 d.ts 文件，当你写 js 代码的时候给你智能提示。declare 全局提示，是的 ts 可以找到并识别出

在我们尝试给一个 npm 包创建声明文件之前，需要先看看他的声明文件是否存在。一般来说，npm 包的声明文件可能存在于两个地方：

- 与该 npm 包绑定在一起。判断依据时 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以自己在创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起
- 发布到@types 里。我们只需要安装以下对应的@types 包就知道是否存在该声明文件。这种模式一般是 i 由于 npm 包的维护者没有提供声明文件，所以只能由其他人将生命文件发布到@types 里了

### 全局变量 - 应用端补充

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

### npm 包 - 应用端补充

针对的是在应用端，`import写法 + 补充npm包的变量`
核心：`只有在声明文件中使用export导出，然后再使用import导入后，才会用到这些类型声明`

#### 方法一： 文件位置随意，源码中指定`declare module xxx`

```ts
declare module 'abcd' {
  export let a: number;
  export function b(): number;
  export namespace c {
    let cd: string;
  }
}
let aaa = require('abcd');
aaa.b();
```

```ts
declare module 'app' {
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

### 扩展 npm 包 - 应用端补充

有时通过 import 导入一个插件模板，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模板没有类型声明文件（最常见的定义是`Vue.prototype.$xxx`），就会导致类型不完整，缺少部分的类型。
ts 提供了一个语法`declare module`，它可以用来扩展原有模块的类型

```ts
// 如果是需要扩展原有模块的话，需要类型声明文件中先引用原有模块，再使用declare module扩展原有模块
import Vue from 'vue';
declare module 'vue/types/vue' {
  interface Vue {
    $openDialog: Function;
    $closeDialog: Function;
  }
}
```

::: warning
在全局变量的声明文件中，是不允许出现 import,export 关键字。一旦出现了，那么他就会被视为一个 npm 库或 UMD 库，就不再是全局变量的声明文件了
:::

### 发布 npm 包-npm 源码端补充

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
declare module 'xxx';
export * from '../lib';
```

## 5 tsconfig.json

### 1. experimentalDecorators

`是否启用实验性的ES装饰器`。Boolean 类型，默认 false，[官方解释](https://www.typescriptlang.org/docs/handbook/decorators.html)

TypeScript 和 ES6 引入了 Class 的概念，同时在[stage 2 proposal](https://github.com/tc39/proposal-decorators)提出了 java 等服务端语言早就有的装饰器模式，能极大简化书写代码，把一些通用逻辑封装到装饰器中。很多库都有用到该特性，比如 vue-class-component 和 vuex-class。_当你使用这些库时，必须开启 experimentalDecorators_.

```ts
function f() {
  console.log('f();evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('fn() called');
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

### target

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
3. /root/src/moduleB.d.ts /root/src/moduleB.package.json(if it specifies a "types" property)
4. /root/src/moduleB/index.ts
5. /root/src/moduleB/index.tsx
6. /root/src/moduleB/index.d.ts

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

### files、include 和 exclude

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
