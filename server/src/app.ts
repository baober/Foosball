import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDatabase, closeDatabase } from './models/database';
import playersRouter from './routes/players';
import matchesRouter from './routes/matches';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API 路由
app.use('/api/players', playersRouter);
app.use('/api/matches', matchesRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await getDatabase();
    console.log('数据库连接成功');
    
    const server = app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });

    // 优雅关闭
    process.on('SIGTERM', async () => {
      console.log('收到 SIGTERM，正在关闭服务器...');
      server.close(async () => {
        await closeDatabase();
        console.log('服务器已关闭');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('收到 SIGINT，正在关闭服务器...');
      server.close(async () => {
        await closeDatabase();
        console.log('服务器已关闭');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();

export default app;