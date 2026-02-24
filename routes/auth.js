const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').User;

// 注册
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 生成JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    // 生成JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({
      message: '登录成功',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }

    // 验证token
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: '无效的token' });
  }
});

module.exports = router;
