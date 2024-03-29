---
title: HTTP请求过程
date: 2020-06-18
tags:
  - HTTP
categories:
  - frontEnd
---

## 一. HTTP 请求和响应步骤

![理解 HTTP 请求与响应](/img/06/HTTP.webp)

## 二. TCP/IP 协议

TCP/IP 协议模型(Transmission Control Protocol/Internet Protocol),包含了一系列构成互联网基础的网络协议,是 Internet 的核心协议。
TCP/IP 协议簇是一组不同层次上的多个协议的组合，通常被认为是一个四层协议系统，与 OSI 的七层模型相对应

HTTP 协议就是基于 TCP/IP 协议模型来传输信息的

![img](/img/06/TCP_IP协议.webp)

1. 链路层
   - 也称作数据链路层或网络接口层，通常包括操作系统中的设备驱动程序和计算机中对应的网络接口卡。他们一起处理与电缆（或其他任何传输媒介）的物理接口细节。ARP（地址解析协议）和 RARP（逆地址解析协议）是某些网络接口使用的特殊协议，用来转换 IP 层和网络接口层使用的地址
2. 网络层
   - 处理分组在网络中的活动，例如分组的选路。在 TCP/IP 协议族中，网络层协议包括 IP 协议（网际层协议），ICMP 协议（internet 互联网控制报文协议），以及 IGMP 协议（Internet 组管理协议）
   - IP 是一种网络层协议，提供的是一种不可靠的服务，它只是尽可能快地把分组从源节点送到目标节点，但不提供任何可靠性保证。同时被 TCP 和 UDP 使用。TCP 和 UDP 的每组数据都通过端系统和每个中间路由器中的 IP 层在互联网中进行传输
   - ICMP 是 IP 协议的附属协议。IP 层用它来与其他主机或路由器交换错误报文和其他重要信息。
   - IGMP 是 Internet 组管理协议。它用来把一个 UDP 数据报多播到多个主机。
3. 传输层
   - 主要为两台主机上的应用程序提供端对端的数据通信。在 TCP/CP 协议族中，有两个互不相同的传输协议：TCP（传输控制协议）和 UDP（用户数据报协议）
   - TCP 为两台主机提供高可靠性的数据通信，它所做的工作包括把应用程序交给它的数据分成合适的小块交给下面的网络层，确认接受到的分组，设置发送最后确认分组的超时时钟等。由于运输车提供了高可靠性的端到端的通信，因此应用层可以忽略所有这些细节。为了提高可靠的服务，TCP 采取了超时重传、发送和接受端到端的确认分组等机制
   - UDP 则为应用层提供一种非常简单的服务。他只是把称作数据报的分组从一台主机传送到另一台主机，但并不保证该数据报能到达另一端。一个数据包是指从发送方传输到接收方的一个信息单元。UDP 协议任何必须的可靠性必须由应用层来提供
4. 应用层
   - 应用层决定了像用于提供应用服务时贴心的活动。TCP/IP 协议族内预存了各类通用的应用服务。包括 HTTP，FTP（File Transfer Protocol，文件传输协议），DNS（Domain Name System，域名系统）服务

![TCP](/img/06/TCP.png)

当应用程序用 TCP 传送数据时，数据被送入协议栈中，然后逐个通过每一层直到被当作一串比特流送入网络。其中每一层对收到的数据都要增加一些首部信息。

当目的主机收到一个以太网数据帧时，数据就开始从协议栈中由底向上升，同时去掉各层协议加上的报文首部。每层协议盒都要去检查报文首部中的协议标识，以确定接受数据的上层协议。这个过程称作分用（Demultiplexing）。协议是通过目的端口号、源 IP 地址和源端口号进行解包的

![HTTP请求与访问](/img/06/HTTP请求与响应.webp)

## 三、TCP 三次握手

TCP 是面向连接的，无论哪一方面向另一方发送数据之前，都必须现在双方之间建立一个链接。在 TCP/IP 协议中，TCP 协议提供可靠的连接服务，连接是通过三次握手进行初始化的。三次握手的目的是同步连接双方的序列号和确认号并交换 TCP 窗口大小信息

![三次握手](/img/06/TCP三次握手.webp)

1. 第一次握手：建立连接。客户端发送连接请求报文段，将 SYN 位置为 1，Sequence Number 为 x；然后客户端进入 SYN_SEND 状态，等待服务器的确认
2. 第二次握手：服务器接收到 SYN 报文段。然后对这个 SYN 报文段进行确认，设置 Acknowledgment Number 为 x+1（Sequence Number + 1）；同时，自己还要发送 SYN 请求信息，将 SYN 位置为 1，Sequence Number 为 y；服务器将上述所有信息放到一个报文段（即 SYN+ACK 报文段）中，一并发送给客户端，此时服务器进入 SYN_RECV 状态
3. 第三次握手：客户端接收到服务器的 SYN+ACK 报文段。然后将 Acknowledgment Number 设置为 y+1，向服务器发送 ACK 报文段，这个报文段发送完毕之后，客户端和服务端都进入 ESTABLISHED 状态，完成 TCP 握手。

:::tip 为什么要三次握手
为了防止已失效的连接请求报文段突然有传送到了服务器，因而产生错误。

其次，在实际的通信中，序号并不是从 1 开始的，而是需要随机数计算出一个初始值，这是因为如果序列号都从 1 开始，通信过程就会非常容易预测，有人会利用这一点来发动攻击

:::

## 四、HTTP 协议

通俗的讲，他就是计算机通过网络进行通信的规则，是一个基于**请求与响应**、**无状态的**、**应用层**的协议，常基于**TCP/IP**此协议传输数据。

四个基于：

- 请求与响应：客户端发送数据，服务单响应数据
- 无状态的： 协议对于事务处理没有记忆能力，客户端第一次与服务器建立连接发送请求时需要进行一系列的安全认证匹配等，因此增加页面等待时间，当客户端向服务器端发送请求，服务端响应完毕后，两者断开连接，也不保存状态。
- 应用层： HTTP 是基于应用层的协议，配合 TCP/IP 使用
- TCP/IP: HTTP 使用 TCP 作为他的支撑运输协议。HTTP 客户机发起一个与服务器的 TCP 连接，一旦建立链接，浏览器（客户机）和服务器进程就可以通过接口访问 TCP

:::tip 针对无状态的一些解决策略
有时需要对用于之前的 HTTP 通信状态进行保存，比如执行一次登陆操作，在 30 分钟内所有的 ing 求都不需要再次登录。于是引入了 Cookie 技术

HTTP/1.1 想出了持久连接（HTTP keep-alive）方法，其特点是，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态，在请求首部字段中的 Connection：keep-alive 即为表明使用了持久连接
:::

## 五、HTTP 请求报文

HTTP 是面向文本的，报文中的每一个字段都是一些 ASCII 码串，各个字段的长度都是不确认的。HTTP 有两类报文：请求报文和响应报文。

由请求行（request line）、请求头部（header）、空行和请求数据 4 个部分组成
![请求报文](/img/06/请求报文.webp)

- 请求方法
  HTTP/1.1 定义的请求方法有 8 种：get、post、put、delete、patch、head、options、trace
- 请求地址
  url： 资源定位符，是一种资源位置的抽象唯一识别方法
  <协议>://<主机>:<端口>/<路径>
- 请求头部
  请求头部为请求报文添加了一些附加信息
  ![请求头部](/img/06/请求头部.webp)

  **请求头部最后会有一个空行，表示请求头部结束，接下来为请求数据，这一步非常重要，必不可少。**

## 六、HTTP 响应报文

![响应报文](/img/06/响应报文.webp)
状态代码

- 1xx：指示信息--表示请求已接收，继续处理。
- 2xx：成功--表示请求已被成功接收、理解、接受。
  - 200 （OK）
  - 201 （Created） 请求已经被实现，并且有一个新的资源已经根据请求的需要而创建
  - 206 (Partial Content)进行范围请求
- 3xx：重定向--要完成请求必须进行更进一步的操作。
  - 301（moved permanently）: 永久重定向，表示资源已被分配到了新的 URL
  - 302 临时重定向，表示资源已呗分配到了新的 URL
  - 303 (see other)：表示资源存在另一个 URL，应用 GET 方法定向获取资源
- 4xx：客户端错误--请求有语法错误或请求无法实现。
  - 400（bad request）：请求报文存在语法错误
  - 401（unauthorized）表示发送请求需要有通过 HTTP 认证的认证信息
  - 403（forbidden）表示对请求资源的访问被服务器拒绝
  - 404（not found）
- 5xx：服务器端错误--服务器未能实现合法的请求。
  - 500（internal server error）表示服务器端在执行请求时发生了错误

响应头部

![响应头部](/img/06/响应头部.webp)

响应数据

数据已经传递完毕，HTTP/1.1 会维持持久连接，但持续一段时间总会有关闭连接的时候，这时候据需要断开 TCP 连接。

## 七、TCP 四次挥手

![四次挥手](/img/06/四次挥手.webp)

- 第一次挥手：主机 1（客户端或服务端），设置 Sequence Number，向主机 2 发送一个 Fin 报文段；此时，主机 1 进入 FIN_WAIT_1 状态
- 第二次挥手：主机 2 收到了主机 1 发送的 FIN 报文段，向主机 1 回一个 ACK 报文段，Acknowledgment Number 为 Sequence Number 加 1；主机 1 进入 FIN_WAIT_2 状态；主机 2 告诉主机 1，我“同意”你的关闭请求；
- 第三次挥手：主机 2 向主机 1 发送 FIN 报文段，请求关闭连接，同时主机 2 进入 LAST_ACK 状态；
- 第四次挥手：主机 1 收到主机 2 发送的 FIN 报文段，向主机 2 发送 ACK 报文段，然后主机 1 进入 TIME_WAIT 状态；主机 2 收到主机 1 的 ACK 报文段以后，就关闭连接；此时，主机 1 等待 2MSL 后依然没有收到回复，则证明 Server 端已正常关闭，那好，主机 1 也可以关闭连接了。

:::tip 为什么要四次挥手
TCP 协议是一种面向连接的、可靠的、基于字节流的运输层通信协议。TCP 是全双工模式，这就意味着，当主机 1 发出 FIN 报文时，只是表示主机 1 没有数据要发送了，主机 1 告诉主机 2，他的数据已经全部发送完毕了；到那时，这个时候主机 1 还是可以接受主机 2 的数据；当主机 2 返回 ACK 报文时，表示他已经知道主机 1 没有数据发送了，但是主机 2 还是可以发送数据到主机 1 的；当主机 2 也发送了 FIN 报文段时，这个时候就表示主机 2 也没有数据要发送了，就会告诉主机 1，我也没有数据要发送了，之后彼此就会愉快的中断这次 TCP 连接。
:::

## 八、TLS 握手：HTTPS 的核心

![TLS](/img/06/TLS.webp)

### 何时发生

1. 每当用户通过 HTTPS 导航到网站并且浏览器首先来时查询网站的原始服务器时，就会进行 TLS 握手
2. 每当其他任何通信使用 HTTPS（包括 API 调用和 HTTPS 查询上的 DNS)时，也会发生 TLS 握手
3. 通过 TCP 握手打开 TCP 连接后，会发生 TLS 握手

![TLS加密](/img/06/TLS握手.webp)

## 输入 URL 背后的技术步骤

> 知识梳理

1. 系统层
   1. 发起 http 请求,解析域名
   2. DNS
      1. Chrome 搜索自身缓存。chrome 输入`chrome://net-internal/#dns`
      2. 搜索操作系统自身 DNS 缓存
      3. 读取本地 host 文件
      4. 以上都查询不到时，浏览器发送一个 DNS 的系统调用，DNS 请求到达宽带运营商服务器。
      5. 宽带运营商服务器查询自身缓存
      6. 没查询时，发起一个迭代（顶级域--次级域名--...）的 DNS 解析请求，直到获取到域名对应的 IP 地址
   3. 拿到域名对应的 IP 并缓存
      1. 宽带运营商服务器缓存 DNS
      2. 结果返回操作系统并缓存 DNS
      3. 结果返回浏览器并缓存 DNS
   4. 得到目标 IP，发起 http“三次握手”，建立起 TCP/IP 连接
      1. 客户端发送一个带有 SYN 标志的数据包给服务器
      2. 服务器回传一个带有 SYN/ACK 标志的数据包
      3. 客户端再回传一个带 ACK 标志的数据包给服务器
   5. 连接成功后,浏览器向服务器发起标准 http 请求
      1. 构建 http 请求报文
         - 请求行
           - 格式: Method Request-URL HTTP-Version CRLF, 如: GET index.html HTTP/1.1
           - Method 可选项:GET, POST, DELETE, OPTION，HEAD
         - 请求报头
           - 允许客户端向服务器传递请求的附加信息
           - 常见的请求报头:Content-Type, Cache-Control, CookieAccept-Encoding, Accept-Language 等
         - 请求正文
           - 当使用 POST, PUT 等方法时,通常需要客户端向服务器传递数据
      2. 通过 TCP 协议，发送到服务器指定端口（HTTP 协议默认 80 端口、http 协议默认 443）
   6. 服务器收到请求后，经过后端处理返回结果。（前后端分离）
      - 响应报文
        - 状态码
          - 1xx: 指示信息--表示请求已接收, 继续处理
          - 2xx: 成功-- 表示请求已被成功接收、理解、接受
          - 3xx：重定向--要完成请求必须要更进一步的操作
          - 4xx：客户端错误--请求有语法错误或请求无法实现
          - 5xx：服务器端错误--服务器未能实现合法的请求
        - 响应报头
        - 响应报文
   7. 返回 html 页面等资源，html 包含 css/js 等资源,重复以上 http 请求
2. 渲染层
   1. chrome 浏览器的渲染引擎 Blink(常见的浏览器内核)边接收边解析 HTML 内容，浏览器自上而下逐行解析 HTML 内容，经过词法分析，语法分析，**构建 DOM 树**。HTML 文档被加载和解析完成时（DOM 树构建完成），触发 DOMContentLoaded 事件，此时页面可以渲染展示出内容了。（html 引用的图片可能还在 http 请求加载，当所有资源全部请求完成，触发 load 事件）
      - 当遇到外部 css 链接时，不阻塞而继续构建 DOM 树。
      - 当遇到外部 js 链接时，异步获取资源。js 下载后，V8 引擎会解析、编译 js 内容。由于 js 可能会修改 DOM 树和 CSSOM 树而造成回流和重绘，故 js 会阻塞 DOM 树的构建。
   2. 下载 CSS 后,主线程会在合适时机解析 CSS 内容,`构建CSSOM树`。本来 DOM 树和 CSSOM 树是并行的，互不影响，但当解析到上文提到的 js 时，需要构建完 CSSOM 树后，才能执行 js 代码（DOM 树此时被挂起），因为 js 可以查询、修改任意对象的样式，此时需要 CSSOM 树构建完成。
   3. 浏览器结合 DOM 树和 CSSOM 树构建`Render树`。Render 树和 DOM 树不同，渲染树中并没有 head、display 为 none 等不比显示的节点。
   4. 浏览器渲染（布局+绘制+复合图层话），布局（layout）环节主要负责各元素尺寸、位置的计算，绘制（paint）环节则是绘制页面像素信息，合成（composite）环节是多个复合层的合成，最终合成的页面被用户看到。
      - 回流：DOM 节点中的各个元素都是以盒模型的形式存在，这些都需要浏览器去计算其位置和大小等
      - 重绘：当盒模型的位置、大小及其其他属性，如颜色，字体，等确定下来之后，浏览器便开始绘制内容

![image](/img/06/render树.png)
:::tip note

1. html 内容从上到下解析，浏览器遇到 body 标签开始显示内容。CSS 不会阻塞 DOM 的解析，js 会阻塞 DOM 的解析
2. 当文档加载过程中遇到 js 文件，html 文档会挂起渲染过程，不仅要等到文档中 js 文件加载完毕还要等待解析执行完毕，才会继续 html 的渲染过程
3. 现代浏览器都使用了预加载器，在 js 挂起 DOM 解析时，会继续解析后面的 html，寻找需要下载的资源。预加载器下载这些资源，以减少 js 带来的影响

:::

### 优化

了解以上,就能知道以下这些前端优化点

- **http 请求数减少**，如: 雪碧图、合并 CSS/js 文件、缓存资源等（真对 http1.1）
- **http 请求体积减小**，如：启用 gzip 压缩、减少 cookie、按需加载等
- **CSS 放在 head 中**。由于同时具有 DOM 和 CSSOM 才能构建渲染树，所以 html 和 CSS 都是阻塞渲染的资源，所以尽量精简 CSS 也是优化的方式之一
- **js 放在 body 底部**，减少白屏时间。因为 js 会阻止浏览器解析
- **减少回流与重绘**
