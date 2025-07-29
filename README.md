# 球局对战系统

一个基于 Vue3 + TypeScript + Node.js 的球类比赛管理系统，支持比赛记录、选手管理和排行榜功能。完全独立运行，无需任何第三方服务依赖。

## 项目说明

### 项目架构
本项目采用前后端分离架构：

- **前端**: Vue3 + TypeScript + Vite 构建的移动端 H5 应用
- **后端**: Node.js + Express + TypeScript 的 RESTful API 服务
- **数据库**: SQLite (本地文件数据库)
- **存储**: 本地文件系统存储用户头像
- **部署**: 前后端独立部署，支持容器化

### 技术栈
- **前端**: Vue3, TypeScript, Pinia, Vue Router, Element Plus, Vite, Axios
- **后端**: Node.js, Express, TypeScript, SQLite3
- **工具**: ESLint, Prettier, Nodemon

### 功能特性
- 📱 响应式移动端界面
- 🏓 比赛记录管理（乒乓球、羽毛球等）
- 👥 选手信息管理
- 📊 实时排行榜系统
- 💾 本地数据存储（SQLite）
- 🖼️ 本地头像上传
- 🎨 深色/浅色主题切换

## 开发说明

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 项目结构
```
ball/
├── src/
│   ├── h5/                    # 前端项目
│   │   ├── src/
│   │   │   ├── components/    # 公共组件
│   │   │   ├── views/        # 页面组件
│   │   │   ├── stores/       # Pinia 状态管理
│   │   │   ├── types/        # TypeScript 类型定义
│   │   │   ├── utils/        # 工具函数
│   │   │   └── api/          # API 接口
│   │   ├── public/           # 静态资源
│   │   └── package.json
│   └── server/               # 后端项目
│       ├── src/
│       │   ├── models/       # 数据模型
│       │   ├── routes/       # API 路由
│       │   ├── middleware/   # 中间件
│       │   └── config/       # 配置文件
│       └── package.json
├── data/                     # SQLite 数据库文件
├── uploads/                  # 上传文件目录
├── docker-compose.yml        # Docker 部署配置
├── Dockerfile               # 容器配置
├── .env.example             # 环境变量模板
└── README.md
```

### 安装依赖

#### 前端依赖
```bash
cd src/h5
npm install
```

#### 后端依赖
```bash
cd src/server
npm install
```

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 提交前运行 `npm run lint` 和 `npm run format`
- 遵循 Vue3 Composition API 规范
- TypeScript 严格模式已启用

## 本地调试

### 1. 环境配置

#### 配置文件设置
```bash
# 前端配置
cp src/h5/.env.example src/h5/.env.local

# 后端配置
cp src/server/.env.example src/server/.env
```

#### 环境变量说明

**前端 (.env.local)**
```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

**后端 (.env)**
```bash
PORT=3001
NODE_ENV=development
DB_PATH=./data/app.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=2097152
```

### 2. 启动开发服务器

#### 启动后端服务
```bash
cd src/server
npm run dev
# 服务将在 http://localhost:3001 启动
# 数据库文件将自动创建在 ./data/app.db
```

#### 启动前端服务
```bash
cd src/h5
npm run dev
# 应用将在 http://localhost:5173 启动
```

### 3. 调试工具

#### 前端调试
- **Vue DevTools**: 安装浏览器扩展 Vue DevTools
- **Vite 热更新**: 支持模块热替换，修改代码自动刷新
- **移动端调试**: 使用 Chrome DevTools 的设备模拟器

#### 后端调试
- **Nodemon**: 自动重启服务
- **Postman**: API 接口测试
- **数据库查看**: 使用 SQLite 浏览器工具查看数据

### 4. 测试数据

#### 创建测试数据
1. 启动前后端服务
2. 访问 http://localhost:5173
3. 创建选手信息
4. 添加比赛记录
5. 查看排行榜

## 部署方式

### 1. 构建生产版本

#### 前端构建
```bash
cd src/h5
npm run build
# 构建结果在 dist/ 目录
```

#### 后端构建
```bash
cd src/server
npm run build
# 构建结果在 dist/ 目录
```

### 2. 部署选项

#### 方案一：Docker 容器化部署（推荐）

**Dockerfile (后端)**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源码
COPY dist ./dist
COPY src/models/database.ts ./src/models/

# 创建数据目录
RUN mkdir -p /app/data /app/uploads/avatars

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/app.js"]
```

**Dockerfile (前端)**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./src/server
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_PATH=/app/data/app.db
      - UPLOAD_DIR=/app/uploads

  frontend:
    build:
      context: ./src/h5
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

**部署命令**
```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 方案二：传统服务器部署

**服务器环境准备**
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

**后端部署**
```bash
# 上传代码
cd src/server
npm ci --only=production
npm run build

# 启动服务
pm2 start dist/app.js --name ball-game-server
pm2 save
pm2 startup
```

**前端部署**
```bash
# 构建前端
cd src/h5
npm ci
npm run build

# 上传到服务器
rsync -avz dist/ user@server:/var/www/ball-game/

# Nginx 配置
sudo nano /etc/nginx/sites-available/ball-game
```

**Nginx 配置示例**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /var/www/ball-game;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 上传文件访问
    location /uploads {
        alias /path/to/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. 数据备份

#### 自动备份脚本
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/ball-game"
DB_FILE="/path/to/data/app.db"
UPLOADS_DIR="/path/to/uploads"

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/app_$DATE.db
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $(dirname $UPLOADS_DIR) $(basename $UPLOADS_DIR)

# 删除7天前的备份
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

#### 定时任务
```bash
# 添加到 crontab
0 2 * * * /path/to/backup.sh
```

### 4. 环境变量配置

#### 生产环境变量
**后端 (.env)**
```bash
PORT=3001
NODE_ENV=production
DB_PATH=/app/data/app.db
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=2097152
```

**前端构建配置**
```bash
# 构建时设置
VITE_API_BASE_URL=https://your-domain.com/api
```

### 5. 监控和维护

#### 进程监控
```bash
# 使用 PM2 监控
pm2 monit
pm2 logs
```

#### 日志管理
```bash
# 查看应用日志
tail -f /path/to/logs/app.log

# 使用 logrotate 管理日志
sudo nano /etc/logrotate.d/ball-game
```

#### 数据库维护
```bash
# 定期清理旧数据
sqlite3 /path/to/data/app.db "DELETE FROM matches WHERE played_at < date('now', '-1 year');"

# 数据库优化
sqlite3 /path/to/data/app.db "VACUUM;"
```

## 常见问题

### Q: 数据库文件权限问题
A: 确保运行应用的用户有读写数据目录的权限：
```bash
sudo chown -R $USER:$USER /path/to/data
sudo chmod -R 755 /path/to/data
```

### Q: 上传文件大小限制
A: 检查 Nginx 配置：
```nginx
client_max_body_size 10M;
```

### Q: 跨域问题
A: 确保后端 CORS 配置正确，或在前端开发时使用代理。

### Q: 构建失败
A: 检查 Node.js 版本是否符合要求，清理 node_modules 后重新安装依赖。

### Q: 数据丢失
A: 定期备份数据库文件，建议每天自动备份到远程存储。

## 技术支持

项目完全独立运行，所有数据存储在本地：
- 数据库：SQLite 文件数据库
- 上传文件：本地文件系统
- 配置文件：本地环境变量

如需技术支持，请查看项目文档或提交 Issue。