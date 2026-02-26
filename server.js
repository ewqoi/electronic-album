const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const libraryRoutes = require('./routes/library');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(__dirname));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/libraries', libraryRoutes);

// 根路径重定向到home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // 初始化数据库
  db.sequelize.sync({ force: false }).then(() => {
    console.log('Database synchronized');
  });
});
