import { Router } from 'express';
import { getDatabase } from '../models/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 获取比赛列表
router.get('/', async (req, res) => {
  try {
    const { season, limit = 50, offset = 0 } = req.query;
    const db = await getDatabase();

    let query = `
      SELECT m.*, 
             pa1.name as team_a_player1_name,
             pa2.name as team_a_player2_name,
             pb1.name as team_b_player1_name,
             pb2.name as team_b_player2_name
      FROM matches m
      JOIN players pa1 ON m.team_a_player1 = pa1.id
      JOIN players pa2 ON m.team_a_player2 = pa2.id
      JOIN players pb1 ON m.team_b_player1 = pb1.id
      JOIN players pb2 ON m.team_b_player2 = pb2.id
    `;
    
    const params: any[] = [];
    
    if (season) {
      query += ' WHERE m.season = ?';
      params.push(season);
    }
    
    query += ' ORDER BY m.played_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const matches = await db.all(query, params);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: '获取比赛列表失败' });
  }
});

// 获取指定赛季的比赛
router.get('/season/:season', async (req, res) => {
  try {
    const { season } = req.params;
    const db = await getDatabase();

    const matches = await db.all(`
      SELECT m.*, 
             pa1.name as team_a_player1_name,
             pa2.name as team_a_player2_name,
             pb1.name as team_b_player1_name,
             pb2.name as team_b_player2_name
      FROM matches m
      JOIN players pa1 ON m.team_a_player1 = pa1.id
      JOIN players pa2 ON m.team_a_player2 = pa2.id
      JOIN players pb1 ON m.team_b_player1 = pb1.id
      JOIN players pb2 ON m.team_b_player2 = pb2.id
      WHERE m.season = ?
      ORDER BY m.played_at DESC
    `, [season]);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: '获取赛季比赛失败' });
  }
});

// 创建比赛
router.post('/', async (req, res) => {
  try {
    const { players, score_a = 0, score_b = 0 } = req.body;

    if (!players || !Array.isArray(players) || players.length !== 4) {
      return res.status(400).json({ error: '需要选择4名玩家' });
    }

    const db = await getDatabase();

    // 检查所有玩家是否存在
    const playerChecks = await Promise.all(
      players.map(id => db.get('SELECT id FROM players WHERE id = ?', [id]))
    );

    if (playerChecks.some(p => !p)) {
      return res.status(400).json({ error: '存在无效的玩家ID' });
    }

    // 生成分组
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const teamA = shuffled.slice(0, 2);
    const teamB = shuffled.slice(2, 4);

    // 获取当前赛季
    const now = new Date();
    const season = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const id = uuidv4();
    const winner = score_a > score_b ? 'A' : 'B';

    await db.run(
      `INSERT INTO matches (
        id, season, team_a_player1, team_a_player2, 
        team_b_player1, team_b_player2, score_a, score_b, 
        winner, played_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, season, teamA[0], teamA[1], teamB[0], teamB[1],
        score_a, score_b, winner, now
      ]
    );

    // 重新计算排名
    await recalculateRankings(season);

    const newMatch = await db.get(`
      SELECT m.*, 
             pa1.name as team_a_player1_name,
             pa2.name as team_a_player2_name,
             pb1.name as team_b_player1_name,
             pb2.name as team_b_player2_name
      FROM matches m
      JOIN players pa1 ON m.team_a_player1 = pa1.id
      JOIN players pa2 ON m.team_a_player2 = pa2.id
      JOIN players pb1 ON m.team_b_player1 = pb1.id
      JOIN players pb2 ON m.team_b_player2 = pb2.id
      WHERE m.id = ?
    `, [id]);

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: '创建比赛失败' });
  }
});

// 更新比赛结果
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score_a, score_b } = req.body;

    if (score_a === undefined || score_b === undefined) {
      return res.status(400).json({ error: '比分不能为空' });
    }

    if (score_a === score_b) {
      return res.status(400).json({ error: '比赛不能平局' });
    }

    const db = await getDatabase();

    // 检查比赛是否存在
    const match = await db.get('SELECT * FROM matches WHERE id = ?', [id]);
    if (!match) {
      return res.status(404).json({ error: '比赛不存在' });
    }

    const winner = score_a > score_b ? 'A' : 'B';

    await db.run(
      'UPDATE matches SET score_a = ?, score_b = ?, winner = ? WHERE id = ?',
      [score_a, score_b, winner, id]
    );

    // 重新计算排名
    await recalculateRankings(match.season);

    const updatedMatch = await db.get(`
      SELECT m.*, 
             pa1.name as team_a_player1_name,
             pa2.name as team_a_player2_name,
             pb1.name as team_b_player1_name,
             pb2.name as team_b_player2_name
      FROM matches m
      JOIN players pa1 ON m.team_a_player1 = pa1.id
      JOIN players pa2 ON m.team_a_player2 = pa2.id
      JOIN players pb1 ON m.team_b_player1 = pb1.id
      JOIN players pb2 ON m.team_b_player2 = pb2.id
      WHERE m.id = ?
    `, [id]);

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ error: '更新比赛结果失败' });
  }
});

// 删除比赛
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();

    const match = await db.get('SELECT * FROM matches WHERE id = ?', [id]);
    if (!match) {
      return res.status(404).json({ error: '比赛不存在' });
    }

    await db.run('DELETE FROM matches WHERE id = ?', [id]);

    // 重新计算排名
    await recalculateRankings(match.season);

    res.json({ message: '比赛删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除比赛失败' });
  }
});

// 获取排名数据
router.get('/rankings/:season/players', async (req, res) => {
  try {
    const { season } = req.params;
    const db = await getDatabase();

    const rankings = await db.all(`
      SELECT 
        pr.*,
        p.name as player_name,
        p.type as player_type
      FROM player_rankings pr
      JOIN players p ON pr.player_id = p.id
      WHERE pr.season = ?
      ORDER BY pr.rank ASC
    `, [season]);

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: '获取个人排名失败' });
  }
});

router.get('/rankings/:season/teams', async (req, res) => {
  try {
    const { season } = req.params;
    const db = await getDatabase();

    const rankings = await db.all(`
      SELECT 
        tr.*,
        p1.name as player1_name,
        p2.name as player2_name
      FROM team_rankings tr
      JOIN players p1 ON tr.player1_id = p1.id
      JOIN players p2 ON tr.player2_id = p2.id
      WHERE tr.season = ?
      ORDER BY tr.rank ASC
    `, [season]);

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: '获取组合排名失败' });
  }
});

// 重新计算排名
async function recalculateRankings(season: string) {
  const db = await getDatabase();

  // 清空现有排名
  await db.run('DELETE FROM player_rankings WHERE season = ?', [season]);
  await db.run('DELETE FROM team_rankings WHERE season = ?', [season]);

  // 计算个人排名
  const playerStats = await db.all(`
    SELECT 
      p.id as player_id,
      p.name,
      COUNT(CASE 
        WHEN (m.winner = 'A' AND (m.team_a_player1 = p.id OR m.team_a_player2 = p.id)) OR
             (m.winner = 'B' AND (m.team_b_player1 = p.id OR m.team_b_player2 = p.id))
        THEN 1 
      END) as wins,
      COUNT(*) as total_games,
      CAST(COUNT(CASE 
        WHEN (m.winner = 'A' AND (m.team_a_player1 = p.id OR m.team_a_player2 = p.id)) OR
             (m.winner = 'B' AND (m.team_b_player1 = p.id OR m.team_b_player2 = p.id))
        THEN 1 
      END) AS REAL) / COUNT(*) as win_rate,
      MAX(m.played_at) as last_match_at
    FROM players p
    JOIN matches m ON 
      p.id IN (m.team_a_player1, m.team_a_player2, m.team_b_player1, m.team_b_player2)
    WHERE m.season = ?
    GROUP BY p.id, p.name
    ORDER BY win_rate DESC, wins DESC, total_games ASC, last_match_at ASC
  `, [season]);

  // 插入个人排名
  for (let i = 0; i < playerStats.length; i++) {
    const stat = playerStats[i];
    await db.run(
      'INSERT INTO player_rankings (player_id, season, rank, win_rate, wins, total_games, last_match_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [stat.player_id, season, i + 1, stat.win_rate, stat.wins, stat.total_games, stat.last_match_at]
    );
  }

  // 计算组合排名
  const teamStats = await db.all(`
    SELECT 
      CASE 
        WHEN team_a_player1 < team_a_player2 THEN team_a_player1 || ',' || team_a_player2
        ELSE team_a_player2 || ',' || team_a_player1
      END as team_key,
      team_a_player1 as player1_id,
      team_a_player2 as player2_id,
      COUNT(CASE WHEN winner = 'A' THEN 1 END) as wins,
      COUNT(*) as total_games,
      CAST(COUNT(CASE WHEN winner = 'A' THEN 1 END) AS REAL) / COUNT(*) as win_rate
    FROM matches
    WHERE season = ?
    GROUP BY team_key, player1_id, player2_id
    
    UNION
    
    SELECT 
      CASE 
        WHEN team_b_player1 < team_b_player2 THEN team_b_player1 || ',' || team_b_player2
        ELSE team_b_player2 || ',' || team_b_player1
      END as team_key,
      team_b_player1 as player1_id,
      team_b_player2 as player2_id,
      COUNT(CASE WHEN winner = 'B' THEN 1 END) as wins,
      COUNT(*) as total_games,
      CAST(COUNT(CASE WHEN winner = 'B' THEN 1 END) AS REAL) / COUNT(*) as win_rate
    FROM matches
    WHERE season = ?
    GROUP BY team_key, player1_id, player2_id
    ORDER BY win_rate DESC, wins DESC, total_games ASC
  `, [season, season]);

  // 插入组合排名
  for (let i = 0; i < teamStats.length; i++) {
    const stat = teamStats[i];
    await db.run(
      'INSERT INTO team_rankings (player1_id, player2_id, season, rank, win_rate, wins, total_games) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [stat.player1_id, stat.player2_id, season, i + 1, stat.win_rate, stat.wins, stat.total_games]
    );
  }
}

export default router;