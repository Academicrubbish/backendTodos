
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 7788;

// 使用 express.json() 中间件来解析请求体中的 JSON 数据
app.use(express.json());

// 配置数据库连接
// const sequelize = new Sequelize('mysql://user:password@localhost:3306/todo_db'); 连接本地数据库  user:账号 password:密码
const sequelize = new Sequelize('mysql://root:root@localhost:3306/todo_db');

// 定义 TODO 模型
const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false, // 不需要自动生成 createdAt 和 updatedAt 字段
});

// 连接到数据库并同步模型
sequelize.sync().then(() => {
  console.log('Database connected and Todo model synchronized');
});

// 路由：获取所有 TODO
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve todos', error });
  }
});

// 路由：获取指定 ID 的 TODO
app.get('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const todo = await Todo.findByPk(id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve todo', error });
  }
});

// 路由：添加一个 TODO
app.post('/todos', async (req, res) => {
  try {
    const { text, completed } = req.body;
    if (typeof text !== 'string') {
      return res.status(400).json({ message: 'Text is required' });
    }
    const newTodo = await Todo.create({ text, completed });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error });
  }
});

// 路由：删除 TODO
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await Todo.destroy({ where: { id } });
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error });
  }
});

// 启动服务器，并监听指定的端口号
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
