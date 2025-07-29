# Ball Game Match System 🏓

A comprehensive 2v2 ball game match management system with intelligent player matching, real-time rankings, and detailed match records.

[English](#english) | [中文](#中文)

---

## English

### 🎯 Project Overview

Ball Game Match System is a full-stack application designed for managing 2v2 ball game matches. It provides intelligent player matching, comprehensive ranking systems, detailed match records, and personal profile management.

### ✨ Features

#### 🎮 Match Management
- **Smart Player Selection**: Checkbox-based player availability system
- **Intelligent 2v2 Matching**: Randomized fair team formation
- **Real-time Match Recording**: Instant score input and validation
- **Player Registration**: Add new players with role types (All-round/Forward/Guard)

#### 🏆 Ranking System
- **Season Rankings**: Monthly-based seasons with historical data
- **Individual Rankings**: Win rate, wins, total matches
- **Team Rankings**: Best performing pairs
- **Cross-season Statistics**: Comprehensive performance tracking

#### 📊 Match Details
- **Complete Match History**: Searchable across all seasons
- **Detailed Records**: Winning/losing teams with scores
- **Timeline View**: yyyy-mm-dd DayOfWeek HH:MM format
- **Admin Controls**: Match result editing capabilities

#### 👤 Personal Profile
- **Avatar Management**: Upload and update profile pictures
- **Performance Analytics**: Current season ranking, best teammate, toughest opponent
- **Historical Data**: Past season performances
- **Player Type Management**: Dynamic role switching

### 🏗️ Technical Architecture

#### Frontend (h5/)
- **Framework**: Vue 3 + TypeScript
- **State Management**: Pinia
- **UI Library**: Element Plus
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite

#### Backend (server/)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Language**: TypeScript
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

### 🚀 Quick Start

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ball-game-match-system
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
cp .env.example .env
```

3. **Install Frontend Dependencies**
```bash
cd ../h5
npm install
cp .env.example .env
```

4. **Start the Development Servers**

Backend:
```bash
cd server
npm run dev
# Server runs on http://localhost:3000
```

Frontend:
```bash
cd h5
npm run dev
# Frontend runs on http://localhost:5173
```

### 📁 Project Structure

```
ball-game-match-system/
├── h5/                    # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/        # Page components
│   │   ├── stores/       # Pinia state management
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/               # Backend API
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── app.ts        # Express application
│   ├── package.json
│   └── tsconfig.json
├── docs/                 # Documentation
│   ├── requirement.md    # Requirements document
│   ├── HighLevelDesign.md # High-level design
│   └── LowLevelDesign.md  # Detailed design
└── README.md
```

### 🧪 Development

#### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### 🔧 Configuration

#### Environment Variables

**Backend (.env)**
```
PORT=3000
DB_PATH=./database.sqlite
UPLOAD_DIR=./uploads
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 📱 Usage Guide

1. **Add Players**: Navigate to the Match tab and add new players with their roles
2. **Start Matching**: Select available players and click "Start Matching"
3. **Record Results**: Input match results immediately after completion
4. **View Rankings**: Check season and team rankings in the Ranking tab
5. **Track History**: Browse detailed match records in the Details tab
6. **Manage Profile**: Update avatar and view personal stats in the Profile tab

### 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 中文

### 🎯 项目简介

球局对战系统是一个全栈应用，专为2v2球类游戏比赛管理而设计。提供智能球员匹配、综合排名系统、详细比赛记录和个人资料管理功能。

### ✨ 功能特性

#### 🎮 比赛管理
- **智能球员选择**: 基于复选框的球员可用性系统
- **智能2v2匹配**: 随机公平组队
- **实时比赛记录**: 即时比分输入和验证
- **球员注册**: 添加新球员并设置角色类型（全能/前锋/后卫）

#### 🏆 排名系统
- **赛季排名**: 基于月份的赛季和历史数据
- **个人排名**: 胜率、胜场、总场次
- **组合排名**: 最佳搭档组合
- **跨赛季统计**: 综合表现追踪

#### 📊 比赛明细
- **完整比赛历史**: 跨赛季搜索
- **详细记录**: 获胜/失败队伍及比分
- **时间线视图**: yyyy-mm-dd 星期 HH:MM 格式
- **管理员控制**: 比赛结果编辑功能

#### 👤 个人资料
- **头像管理**: 上传和更新个人头像
- **表现分析**: 当前赛季排名、最佳队友、最难缠对手
- **历史数据**: 过往赛季表现
- **球员类型管理**: 动态角色切换

### 🏗️ 技术架构

#### 前端 (h5/)
- **框架**: Vue 3 + TypeScript
- **状态管理**: Pinia
- **UI库**: Element Plus
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **构建工具**: Vite

#### 后端 (server/)
- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: SQLite3
- **语言**: TypeScript
- **文件上传**: Multer
- **跨域**: 启用CORS跨域请求

### 🚀 快速开始

#### 环境要求
- Node.js (v16或更高版本)
- npm或yarn

#### 安装步骤

1. **克隆仓库**
```bash
git clone <repository-url>
cd ball-game-match-system
```

2. **安装后端依赖**
```bash
cd server
npm install
cp .env.example .env
```

3. **安装前端依赖**
```bash
cd ../h5
npm install
cp .env.example .env
```

4. **启动开发服务器**

后端:
```bash
cd server
npm run dev
# 服务器运行在 http://localhost:3000
```

前端:
```bash
cd h5
npm run dev
# 前端运行在 http://localhost:5173
```

### 📁 项目结构

```
ball-game-match-system/
├── h5/                    # 前端应用
│   ├── src/
│   │   ├── components/    # 可复用Vue组件
│   │   ├── views/        # 页面组件
│   │   ├── stores/       # Pinia状态管理
│   │   ├── types/        # TypeScript类型定义
│   │   └── utils/        # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── server/               # 后端API
│   ├── src/
│   │   ├── models/       # 数据库模型
│   │   ├── routes/       # API路由
│   │   └── app.ts        # Express应用
│   ├── package.json
│   └── tsconfig.json
├── docs/                 # 文档
│   ├── requirement.md    # 需求文档
│   ├── HighLevelDesign.md # 高层设计
│   └── LowLevelDesign.md  # 详细设计
└── README.md
```

### 🧪 开发指南

#### 可用脚本

**前端:**
- `npm run dev` - 启动开发服务器
- `npm run build` - 生产环境构建
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行ESLint
- `npm run format` - 使用Prettier格式化代码

**后端:**
- `npm run dev` - 使用nodemon启动开发服务器
- `npm run build` - TypeScript编译为JavaScript
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint
- `npm run format` - 使用Prettier格式化代码

### 🔧 配置说明

#### 环境变量

**后端 (.env)**
```
PORT=3000
DB_PATH=./database.sqlite
UPLOAD_DIR=./uploads
```

**前端 (.env)**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 📱 使用指南

1. **添加球员**: 进入匹配页面，添加新球员并设置角色
2. **开始匹配**: 选择可用球员，点击"开始匹配"
3. **记录结果**: 比赛结束后立即输入比分
4. **查看排名**: 在排名页面查看赛季和组合排名
5. **追踪历史**: 在明细页面浏览详细比赛记录
6. **管理资料**: 在个人页面更新头像和查看统计

### 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给个星标支持！</p>
  <p>Made with ❤️ by the Ball Game Team</p>
</div>