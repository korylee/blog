---
title: webpack打包提速
date: 2020-05-20
tags:
  - JavaScript
  - webpack
categories:
  - frontEnd
---

## 1. 分析打包速度

优化 webpack 构建速度的第一步是知道精力集中在哪里。我们可以通过`speed-measure-webpack-plugin`测量 webpack 构建期间各个阶段花费的时间

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
```

## 2. 分析影响打包速度细节

1. 获取所有的依赖模块
2. 解析所有的依赖模块(解析成浏览器可以运行的代码)
3. 将所有的依赖模块打包到一个文件
    1. 压缩 JS=>AST 语法树=>JS
4. 二次打包

## 3.优化解析时间—开启多进程打包

### 1. thread-loader

把这个 loader 放置到其他 loader 之前, 放置这个 loader 就会在一个单独的 loader 就会在一个单独的[worker pool]池里运行, 一个 worker 就是一个 node.js
进程[node.js process]，这个单独进程处理时间上限为 600ms，各个进程的数据交换也会限制在这个时间内

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 创建一个js worker池
                user: ["thread-worker", "babel-loader"],
            },
            {
                test: /\.s?css$/,
                exclude: /node_modules/,
                // 创建一个js worker池
                user: [
                    "babel-loader",
                    "thread-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIndentName: "[name]__[local]--[hash:base64:5]",
                            importLoaders: 1,
                        },
                    },
                    "postcss-loader",
                ],
            },
        ],
    },
};
```

- 注意
    - thread-loader 放在了 style-loader 之后，只是因为 thread-loader 后的 loader 没法存取文件也没法获取 webpack 的选项设置。
    - 为了防止 worker 的高延迟，提供了对 worker 池的优化： 预热

```js
const threadLoader = require("thread-loader");
const jsWorkerPool = {
    // 产生的worker数量,默认是(cpu核心数 - 1)
    // 当require('os').cpus()是undefined时,则为1
    workers: 2,
    // 闲置时定时删除worker进程
    // 默认为500ms
    // 可以设置为无穷大,这样在监视模式(--watch)可以保证worker可以持续存在
    poolTimeout: 2000,
};
module.exports = {
    module: {
        // ...
    },
};
```

## 合理利用缓存

使用 cache-loader 缓存的方法有几种, 例如使用`cache-loader`,`HardSourceWebpackPlugin`或`babel-loader`的`cacheDirectory`
标志.所有这些缓存方法都有启动的开销.重新开始运行期间在本地节省的时间很大,但是初始(冷)运行实际上会更慢

1. cache-loader

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.ext$/,
                use: ["cache-loader", ...loaders],
                include: path.resolve("src"),
            },
        ],
    },
};
```

请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用。

2. HardSourceWebpackPlugin

- 第一次构建将花费正常时间
- 第二次构建将显著加快(大概提升 90%的构建速度)

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const clientWebpackConfig = {
    plugin: [
        new HardSourceWebpackPlugin({
            // cacheDirectory是在告诉缓存写入。默认情况下，将缓存储存在node_modules下的目录下
            // node_modules/cache/hard-source/[confighash]
            cacheDirectory: path.join(__dirname, './lib/.cache/hard-source/[confighash]'),
            // configHash在启动webpack实例时转换webpack配置
            // 并用于cacheDirectory为不同的webpack购置不同的缓存
            configHash: function (webpackConfig) {
                // node-object-hash on npm can be used to build this
                return require('node-object-hash')({sort: false}).hash(webpackConfig)
            },
            // 当加载器、插件、其他构建是脚本或其他动态依赖性发生改变时
            // hard-source需要替换缓存以确保输出正确
            // environmentHash被用来确认这一点，如果散列与先前的构建不同，则将使用新的缓存
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ['package-lock.json', 'yarn-lock']
            },
            info: {
                // none or test
                mode: 'none',
                // debug, log, info, warn, ro error
                level: 'debug'
            },
            cachePrune: {
                // Caches younger than `maxAge` are not considered for deletion. They must
                // be at least this (default: 2 days) old in milliseconds.
                maxAge: 2 * 24 * 60 * 60 * 1000,
                // All caches together must be larger than `sizeThreshold` before any
                // caches will be deleted. Together they must be at least this
                // (default: 50 MB) big in bytes.
                sizeThreshold: 50 * 1024 * 1024
            },
        }),
        new HardSourceWebpackPlugin.ExcludeModulePlugin([
            {
                test: /.*\.DS_Store/
            }
        ]),
    ]
}
```

## 优化压缩时间

1. webpack4 webpack4 对 webpack.optimize.UglifyJsPlugin 已被废弃 webpack 默认内置使用`terser-webpack-plugin`插件优化代码,而该插件使用 terser
   来缩小 JS

### terser 是什么

> 用于 ES6+的 JavaScript 解析器、mangler/compressor(压缩器)工具包
> webpack 不在维护 uglify-es,并且 uglify-js 不支持 ES6
> terser 是 uglify 的一个分支,主要保留了与 uglify-es 和 uglify-js@3 的 API 和 CLI 兼容性

### terser 启动多进程 <badge text="推荐"/>

使用多进程并行运行来提高构建速度。并发运行的默认数量为`os.cpus().length-1`

```js
module.export = {
    optimization: {
        minimizer: [new TerserPlugin({parllel: true})],
    },
};
```

## 优化搜索时间--缩小文件搜索范围,减小不必要的工作

webpack 打包时,会从配置的 entry 触发,解析入口文件的导入语句,再递归解析时,在遇到导入语句时 webpack 会做两件事情

- 根据导入语句去寻找对应的要导入的文件。例如`require('react')`导入语句对应的文件是`./node_modules/react/react.js`，`require('./util')`对应的文件是`./util.js`
- 根据找到的要导入的文件的后续，使用配置中的 Loader 去处理文件，例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 去处理

1. 优化 loader 配置 使用 Loader 时可以通过`test`、`include`、`exclude`三个配置项来命中 Loader 要应用规则的文件
2. `优化 resolve.module` 配置
   `resolve.modules` 用于配置 webpack 去哪些目录下寻找第三方模块, `resolve.modules`的默认值是`['node_modules]`，含义是先去当前目录下的`./node_modules`,
   然后去上一级逐层寻找
3. 优化`resolve.alias`
   `resolve.alias`配置项通过别名来把原导入路径映射成一个新的路径，减少好事的递归操作
4. 优化`resolve.extension`配置 在导入语句没带文件后缀时，webpack 会根据 resolve.extension 自动带上后缀去尝试访问文件是否存在，所以在配置时应当注意
    - `resolve.extension`列表尽可能小，不要把项目中不可能存在的情况写到后缀尝试列表中
    - 频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程
    - 在源码中写入导入语句时，要尽可能的带入后缀，从而可以避免寻找过程
5. 优化`resolve.mainFields`配置 有些第三方模块会针对不同的环境提供几份代码，例如分别提供采用 ES5 与 ES6 的 2 份代码，这两份代码的位置写在`package.json`文件里，如下：
   ```json5
   {
     "jsnext:main": "es/index.js", // 采用ES6语法的代码入口文件
     "main": "lib/index.js" // ES5
   }
   ```
   webpack 会根据`mainFields`的配置去决定优先采用哪份代码，`mainFields`默认如下
   ```js
   mainFields: ["browser", "main"];
   ```
6. 优化 module.noParse 配置 此配置可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。原因是 jQuery、ChartJS，他们庞大有没有采用模块化标准，让 webpack
   去解析这些文件耗时有没有意义。
7. 详细配置

```js
module.exports = {
    module: {
        // 项目中使用的jQuery没有采用模块化标准，
        noParse: /jquery/,
        rules: [
            {
                // 这里编译js、jsx
                // 注意：如果项目源码中没有jsx文件就不要写/\.jsx?$/, 提升正则表达式性能
                test: /\.(js|jsx)$/,
                // babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
                use: ["babel-loader?cacheDirectory"],
                // 排除node_modules目录下的文件
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        // 设置模块导入规则，import/require时会直接在这些目录寻找文件
        // 可以指明存放第三方模块的绝对路径，以减少寻找
        modules: [
            path.resolve(`${project}/cliect/components`),
            path.resolve("h5_commonr/components"),
            "node_modules",
        ],
        // import时省略后缀
        // 注意： 尽可能较少后缀尝试的可能性
        extension: [".js", ".jsx", ".react.js", ".css", ".json"],
        alias: {"@components": path.resolve(`${project}/components`)},
    },
};
```
