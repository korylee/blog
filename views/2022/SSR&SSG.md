---
title: SSR（同构）原理脉络梳理
date: 2022-06-30
tags:
  - React
categories:
  - frontEnd
---

## 前言

**客户端渲染**：页面初始化加载的 HTML 页面中无网页展示内容，需要加载执行 Javascript 文件中的 React 代码，通过 javascript 渲染生产页面，同时，JavaScript 代码会完成页面交互事件的绑定。
![CSR](https://pic4.zhimg.com/80/v2-721ab4c7d9e55d6b22da5109787a6617_720w.jpg)

**服务器渲染**： 用户请求服务器，服务器直接生成 HTML 给浏览器。服务器端渲染来，页面的内容是 server 端生成的。一般来说，服务端渲染的页面交互能力有限，如果要实现复杂交互，还是要通过引入 Javascript 来辅助实现。服务端渲染这个概念，适用于任何后端语言。
![服务器渲染](https://pic4.zhimg.com/80/v2-8fa23eb7918b58d1436e9aaffe3cc25b_720w.jpg)
**同构**：同构这个概念存在于 Vue，React 这些新型的前端框架中，同构实际上是客户端渲染和服务端渲染的一个整合。把页面的展示和交互写在一起，让代码执行两次。在服务器端执行一次，用于实现服务端渲染，在客户端在执行一次，用于接管页面交互。
![SSR](https://pic2.zhimg.com/80/v2-221bc777b5190dbdcf86db3d4870691d_720w.jpg)
**静态页面生成**：在构建的时候直接把结果页面输出 HTML 到磁盘，每次访问直接把 HTML 返回给客户端，相当于一个静态资源

## 使用 SSR 技术的主要因素

1. CSR 项目项目的 TTFP(time to first page)事件比较长，参考之前的图例，在 CSR 的页面渲染流程中，首先要加载 HTML 文件，之后要下载页面所需的 Javascript 文件，然后 JavaScript 渲染生成页面。在这个渲染过程中至少涉及到两个 HTTP 生命周期，所以会有一定的耗时，这也是为什么访问 React 或 Vue 应用时，初始页面会有出现白屏的原因。
2. CSR 项目的 SEO 能力极弱。

SSR 的产生，主要就是为了解决上面的两个问题。在 React 中使用 SSR 技术，我们让 React 代码在服务端先执行一次，是的用户下载的 HTML 已经包含了所有的页面展示内容，这样，页面展示过程只需要经历一个 HTTP 请求周期，TFTFP 时间得到一倍以上的缩减
![架构图](https://pic2.zhimg.com/80/v2-744285853e079518979f68f981c5c821_720w.jpg)

## SSR 之所以能实现，本质上时因为虚拟 DOM 存在

SSR 的工程中，React 代码会在客户端和浏览器各执行一次。但在 Node 环境下，是没有 DOM 这个概念的，这些代码在 Node 环境下是会报错的。
好在 React 框架中引入了一个概念叫做虚拟 DOM，虚拟 DOM 是真实 DOM 的一个 JavaScript 对象映射，React 在做页面操作时，实际上不是直接操作 DOM，而是操作虚拟 DOM，也就是操作普通的 JavaScript 对象，这就使得 SSR 成为了可能。在服务器，我可以操作 JavaScript 对象，并把虚拟 DOM 映射成字符串输出；在客户端，也可以直接操作 JavaScript 对象，并把虚拟 DOM 映射成真实 DOM 加载。

## SSR 中客户端渲染与服务端渲染路由代码的差异

实现 React 的 SSR 架构，我们需要让相同的 React 代码在客户端和服务端各执行一次。
在同构中，只有组件的代码是可以公用的，而路由这样的代码是没有办法公用的。
在服务器端通过请求路径，找到路由组件，而在客户端需通过浏览器中的网址，找到路由组件，是完全不同的两套机制，所以在同构中，只有组件的代码是可以公用的，而路由这样的代码是没有办法公用的。

**App.tsx**

```ts
export default function App() {
  return (
    <>
      <nav>
        <ul>
          {routes.map(({ path, name }) => (
            <li key={path}>
              <Link to={path}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        {routes.map(({ path, component: RouteComp }) => (
          <Route key={path} path={path} element={<RouteComp />} />
        ))}
      </Routes>
    </>
  );
}
```

**客户端路由：**

```tsx
hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
```

**服务器端路由代码：**

```tsx
export function render(url: string, context: any) {
  return renderToString(
    <Context.Provider value={context}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Context.Provider>
  );
}
```

服务端路由代码相对复杂一点，需要把 location 传递给 StaticRouter 组件，这样 StaticRouter 才能根据路径分析出当前所需要的组件是谁。

通过 BrowserRouter 我们能够匹配到浏览器即将显示的路由组件，对浏览器来说，我们需要把组件转化成 DOM，所以需要我们使用 ReactDom.render 方法来进行 DOM 的挂载。而 StaticRouter 能够在服务器端匹配到将要显示的组件，对服务器端来说，我们要把组件转化成字符串，这时我们只需要调用 ReactDom 提供的 renderToString 方法，就可以得到 App 组件对应的 HTML 字符串。

## 服务端代码和客户端代码的打包差异

这里是用 vite 搭的

```ts
const isTest = process.env.NODE_ENV === "test";

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const app = express();

  let vite;
  if (!isProd) {
    vite = await createViteServer({
      root,
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(compression());
    app.use((await import("serve-static")).default(resolve("dist/client"), { index: false }));
  }
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      let template, render;
      if (!isProd) {
        template = readFileSync(resolve("index.html"), "utf-8");
        template = await vite?.transformIndexHtml(url, template);
        render = (await vite?.ssrLoadModule("/src/entry-server.tsx"))?.render;
      } else {
        template = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");
        render = (await import("../dist/server/entry-server.cjs")).render;
      }

      const context = {};
      const appHtml = render(url, context);
      // if (context.url) {
      //   return res.redirect(301, context.url);
      // }
      const html = template?.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      !isProd && vite?.ssrFixStacktrace(error);
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });
  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log(`http://localhost:5173`);
    })
  );
}
```

## node 只是一个中间层

上一部分我们说到了获取数据的问题，在 SSR 架构中，一般 Node 只是个中间层，用来做 React 代码的服务端渲染，而 Node 需要的数据通常由 API 服务器单独提供。

这样做一是为了工程解耦，二是为了规避 node 服务器的一些计算性能问题

服务器渲染时，直接请求 api 服务器的接口获取数据没有任何问题。但在客户端，就有可能存在跨域的问题了，所以，这个时候，我们需要在服务器端搭建 Proxy 代理功能，客户端不直接请求 API 服务器，而是请求 Node 服务器，经过代理转发，拿到 API 服务器的数据

这里可以通过 express-http-proxy 这样的工具快速搭建 Proxy 代理功能，但是配置的时候，要让代理服务器不仅仅帮你转发请求，还要把 cookie 带上，满足权限校验上的一些问题。
