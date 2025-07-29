import { Router } from 'express';
import { getDatabase } from '../models/database';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload = multer({ 
  dest: 'uploads/avatars/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传 JPG/PNG 格式的图片'));
    }
  }
});

// 确保上传目录存在
const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 获取所有玩家
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const players = await db.all('SELECT * FROM players ORDER BY created_at DESC');
    
    // 处理头像路径为可访问的URL
    const playersWithAvatarUrl = players.map(player => ({
      ...player,
      avatar_url: player.avatar_path ? `/api/avatars/${path.basename(player.avatar_path)}` : null
    }));
    
    res.json(playersWithAvatarUrl);
  } catch (error) {
    res.status(500).json({ error: '获取玩家列表失败' });
  }
});

// 创建新玩家
router.post('/', async (req, res) => {
  try {
    const { name, type = '全能' } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: '玩家名称不能为空' });
    }

    const db = await getDatabase();
    
    // 检查名称是否已存在
    const existing = await db.get('SELECT id FROM players WHERE name = ?', [name.trim()]);
    if (existing) {
      return res.status(409).json({ error: '该玩家名称已存在' });
    }

    const id = uuidv4();
    const result = await db.run(
      'INSERT INTO players (id, name, type) VALUES (?, ?, ?)',
      [id, name.trim(), type]
    );

    const newPlayer = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: '创建玩家失败' });
  }
});

// 更新玩家信息
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, is_present } = req.body;

    const db = await getDatabase();
    
    // 检查玩家是否存在
    const existing = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: '玩家不存在' });
    }

    // 检查名称是否被其他玩家使用
    if (name && name !== existing.name) {
      const nameExists = await db.get('SELECT id FROM players WHERE name = ? AND id != ?', [name, id]);
      if (nameExists) {
        return res.status(409).json({ error: '该玩家名称已被使用' });
      }
    }

    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name.trim());
    }
    if (type !== undefined) {
      updates.push('type = ?');
      values.push(type);
    }
    if (is_present !== undefined) {
      updates.push('is_present = ?');
      values.push(is_present ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '没有需要更新的字段' });
    }

    values.push(id);
    await db.run(`UPDATE players SET ${updates.join(', ')} WHERE id = ?`, values);

    const updatedPlayer = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: '更新玩家信息失败' });
  }
});

// 上传头像
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: '请上传头像文件' });
    }

    const db = await getDatabase();
    
    // 检查玩家是否存在
    const player = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    if (!player) {
      // 删除上传的文件
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: '玩家不存在' });
    }

    // 删除旧头像
    if (player.avatar_path && fs.existsSync(player.avatar_path)) {
      fs.unlinkSync(player.avatar_path);
    }

    // 移动文件到最终位置
    const fileName = `${id}${path.extname(req.file.originalname)}`;
    const finalPath = path.join(uploadsDir, fileName);
    fs.renameSync(req.file.path, finalPath);

    // 更新数据库
    await db.run('UPDATE players SET avatar_path = ? WHERE id = ?', [finalPath, id]);

    res.json({ 
      avatar_url: `/api/avatars/${fileName}`,
      message: '头像上传成功' 
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: '头像上传失败' });
  }
});

// 删除玩家
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();

    // 检查玩家是否存在
    const player = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    if (!player) {
      return res.status(404).json({ error: '玩家不存在' });
    }

    // 检查是否有相关比赛
    const matchCount = await db.get(
      `SELECT COUNT(*) as count FROM matches 
       WHERE team_a_player1 = ? OR team_a_player2 = ? 
          OR team_b_player1 = ? OR team_b_player2 = ?`,
      [id, id, id, id]
    );

    if (matchCount.count > 0) {
      return res.status(409).json({ error: '该玩家已有比赛记录，无法删除' });
    }

    // 删除头像文件
    if (player.avatar_path && fs.existsSync(player.avatar_path)) {
      fs.unlinkSync(player.avatar_path);
    }

    await db.run('DELETE FROM players WHERE id = ?', [id]);
    res.json({ message: '玩家删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除玩家失败' });
  }
});

// 切换在场状态
router.patch('/:id/present', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_present } = req.body;

    const db = await getDatabase();
    const result = await db.run(
      'UPDATE players SET is_present = ? WHERE id = ?',
      [is_present ? 1 : 0, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: '玩家不存在' });
    }

    const updatedPlayer = await db.get('SELECT * FROM players WHERE id = ?', [id]);
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: '更新状态失败' });
  }
});

export default router;