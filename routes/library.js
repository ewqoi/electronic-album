const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Library = require('../db').Library;
const LibraryVersion = require('../db').LibraryVersion;

// 中间件：验证token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: '无效的token' });
  }
};

// 获取用户的所有画册
router.get('/', authenticateToken, async (req, res) => {
  try {
    const libraries = await Library.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(libraries);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个画册详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });

    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 获取版本历史
    const versions = await LibraryVersion.findAll({ where: { library_id: id } });

    res.status(200).json({ library, versions });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建新画册
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, cover, category, tags } = req.body;

    // 创建画册
    const library = await Library.create({
      user_id: req.user.id,
      name,
      description,
      cover,
      category,
      tags: JSON.stringify(tags || []),
      status: 'draft',
      access: 'public'
    });

    // 创建初始版本
    await LibraryVersion.create({
      library_id: library.id,
      version: 1,
      description: '初始版本'
    });

    res.status(201).json({ message: '画册创建成功', library });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新画册信息
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cover, category, tags, access, password } = req.body;

    // 查找画册
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });
    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 更新版本号
    const newVersion = library.version + 1;

    // 更新画册
    await library.update({
      name,
      description,
      cover,
      category,
      tags: JSON.stringify(tags || []),
      access,
      password,
      version: newVersion,
      updated_at: new Date()
    });

    // 创建新版本
    await LibraryVersion.create({
      library_id: library.id,
      version: newVersion,
      description: '更新版本'
    });

    res.status(200).json({ message: '画册更新成功', library });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除画册
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 查找画册
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });
    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 删除版本历史
    await LibraryVersion.destroy({ where: { library_id: id } });

    // 删除画册
    await library.destroy();

    res.status(200).json({ message: '画册删除成功' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 发布画册
router.put('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 查找画册
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });
    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 更新状态
    await library.update({
      status: 'published',
      published_at: new Date(),
      updated_at: new Date()
    });

    res.status(200).json({ message: '画册发布成功', library });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 下架画册
router.put('/:id/offline', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 查找画册
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });
    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 更新状态
    await library.update({
      status: 'offline',
      updated_at: new Date()
    });

    res.status(200).json({ message: '画册下架成功', library });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取画册的所有版本
router.get('/:id/versions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查画册是否属于用户
    const library = await Library.findOne({ where: { id, user_id: req.user.id } });
    if (!library) {
      return res.status(404).json({ error: '画册不存在' });
    }

    // 获取版本历史
    const versions = await LibraryVersion.findAll({ where: { library_id: id } });

    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
