// 小试牛刀

// 引入 express 模块
const express = require('express');

// 创建一个 express 应用实例
const app = express();

// 定义服务器运行的端口号
const port = 7788;

// 定义一个路由处理器，处理对根路径 ('/') 的 GET 请求
app.get('/', (req, res) => {
  // // 向客户端发送 'Hello, World!' 字符串作为响应
  // res.send('Hello, World!');
  // 创建一个对象，包含我们想要发送的请求数据
  const requestData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    ip: req.ip,
    body: req.body,
    params: req.params,
    cookies: req.cookies,
    files: req.files,
    file: req.file,
    queryString: req.queryString,
    protocol: req.protocol,
    secure: req.secure,
    xhr: req.xhr
  }
  res.json({
    message: 'hello world',
    data: requestData
  });
});

app.get('/a/b', (req, res) => {
  // 向客户端发送 'Hello, World!' 字符串作为响应
  res.send('Hello, 123!');
});

// 启动服务器，并监听指定的端口号
app.listen(port, () => {
  // 当服务器成功启动时，控制台会输出以下信息
  console.log(`Server running at http://localhost:${port}/`);
});
