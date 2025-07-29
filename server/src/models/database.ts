import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

// 数据库初始化
export async function initDatabase(dbPath: string = './data/app.db') {
  // 确保数据目录存在
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = await Database.open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 创建表结构
  await db.exec(`
    -- 玩家表
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      type TEXT CHECK(type IN ('全能', '前锋', '后卫')) DEFAULT '全能',
      avatar_path TEXT,
      is_present BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 比赛表
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      season TEXT NOT NULL,
      team_a_player1 TEXT NOT NULL,
      team_a_player2 TEXT NOT NULL,
      team_b_player1 TEXT NOT NULL,
      team_b_player2 TEXT NOT NULL,
      score_a INTEGER DEFAULT 0,
      score_b INTEGER DEFAULT 0,
      winner TEXT CHECK(winner IN ('A', 'B')) NOT NULL,
      played_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_a_player1) REFERENCES players(id),
      FOREIGN KEY (team_a_player2) REFERENCES players(id),
      FOREIGN KEY (team_b_player1) REFERENCES players(id),
      FOREIGN KEY (team_b_player2) REFERENCES players(id)
    );

    -- 排名缓存表（用于性能优化）
    CREATE TABLE IF NOT EXISTS player_rankings (
      player_id TEXT NOT NULL,
      season TEXT NOT NULL,
      rank INTEGER NOT NULL,
      win_rate REAL NOT NULL,
      wins INTEGER DEFAULT 0,
      total_games INTEGER DEFAULT 0,
      last_match_at DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (player_id, season),
      FOREIGN KEY (player_id) REFERENCES players(id)
    );

    -- 组合排名缓存表
    CREATE TABLE IF NOT EXISTS team_rankings (
      player1_id TEXT NOT NULL,
      player2_id TEXT NOT NULL,
      season TEXT NOT NULL,
      rank INTEGER NOT NULL,
      win_rate REAL NOT NULL,
      wins INTEGER DEFAULT 0,
      total_games INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (player1_id, player2_id, season),
      FOREIGN KEY (player1_id) REFERENCES players(id),
      FOREIGN KEY (player2_id) REFERENCES players(id)
    );

    -- 触发器：自动更新 updated_at
    CREATE TRIGGER IF NOT EXISTS update_players_timestamp 
    AFTER UPDATE ON players
    BEGIN
      UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  return db;
}

// 数据库连接单例
let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}