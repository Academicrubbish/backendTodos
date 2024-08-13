// 此情可待成追忆，只是当时已惘然。

// 直到实现将数据存储到本地JSON文件的这一刻，
// 突然感觉自己像是回到22年大三下那个在学校中区
// 图书馆的手撸第一版nosingle小程序时的自己。那
// 个时候自己还没有接触后端、云开发，也不会数据
// 库，傻乎乎的想一周解决数据存储问题。由于自己
// 不会数据库，所以想到的解决办法就是存在本地文
// 件里。只是当时自己基础薄弱能力有限，研究到
// python的Django框架便研究不下去了。最后选择
// 了云开发。现在做到这一步，突然有一种茅塞顿开
// 的感觉，心里的石头被搬开。原来当年困住那个青
// 年的巨大问题，在两年后被30min的视频被解开。如
// 果人生中所有的遗憾都能像此刻一样，如果当时的
// 自己就选择nodeJS的experss框架，会不会未来的
// 路会不一样，会不会很多遗憾都会烟消云散呢？多
// 年后再回头看当时，会发现很多东西和问题都是如
// 此的简单，只是自己身处其中。为什么成长路上总
// 是充满遗憾呢？

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 7788;

// 使用 express.json() 中间件来解析请求体中的 JSON 数据
app.use(express.json());

// 定义文件路径
const filePath = path.join(__dirname, 'todos.json');

// 从文件中加载 TODO 项目
let todos = [];
let nextId = 1;

function loadTodos() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    todos = JSON.parse(data);
    if (todos.length > 0) {
      nextId = todos[todos.length - 1].id + 1;
    }
  }
}

// 保存 TODO 项目到文件
function saveTodos() {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), 'utf8');
}

// 初始化 TODO 项目
loadTodos();

// 路由：获取所有 TODO
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 路由：获取指定 ID 的 TODO
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// 路由：添加一个 TODO
app.post('/todos', (req, res) => {
  const { text, completed } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ message: 'Text is required' });
  }
  const newTodo = {
    id: nextId++,
    text,
    completed: completed || false
  };
  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

// 路由：删除 TODO
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// 启动服务器，并监听指定的端口号
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
