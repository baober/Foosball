# 1 技术架构
- **前端框架**: Vue 3 + TypeScript + Vite
- **状态管理**: Pinia (替代Vuex，提供更好的TypeScript支持)
- **UI框架**: Element Plus (提供现成的表格、表单、标签页等组件)
- **路由**: Vue Router 4
- **数据存储**: IndexedDB (本地缓存) + Firebase Firestore (云端同步)
- **构建工具**: Vite (快速开发和构建)
- **CSS预处理器**: SCSS

# 2 项目结构
```
src/
├── components/          # 公共组件
│   ├── PlayerCard.vue
│   ├── MatchResult.vue
│   └── RankTable.vue
├── views/              # 页面组件
│   ├── Match.vue       # 匹配tab
│   ├── Ranking.vue     # 排名tab
│   ├── Details.vue     # 明细tab
│   └── Profile.vue     # 我的tab
├── stores/             # Pinia状态管理
│   ├── player.ts       # 玩家数据
│   ├── match.ts        # 比赛数据
│   └── ranking.ts      # 排名数据
├── types/              # TypeScript类型定义
│   ├── player.ts
│   ├── match.ts
│   └── ranking.ts
├── utils/              # 工具函数
│   ├── db.ts          # IndexedDB操作
│   ├── firebase.ts    # Firebase配置
│   └── date.ts        # 日期处理
└── assets/            # 静态资源
    ├── images/
    └── styles/
```

# 3 数据模型设计

## 3.1 玩家(Player)
```typescript
interface Player {
  id: string;           // 唯一标识
  name: string;         // 玩家名称
  type: '全能' | '前锋' | '后卫';
  avatar?: string;      // 头像URL
  isPresent: boolean;   // 是否在场
  createdAt: Date;
  updatedAt: Date;
}
```

## 3.2 比赛(Match)
```typescript
interface Match {
  id: string;
  season: string;       // 赛季标识 (yyyy-MM)
  teamA: [string, string];  // 队伍A玩家ID
  teamB: [string, string];  // 队伍B玩家ID
  scoreA: number;       // 队伍A得分
  scoreB: number;       // 队伍B得分
  winner: 'A' | 'B';    // 获胜方
  playedAt: Date;       // 比赛时间
  createdAt: Date;
}
```

## 3.3 排名统计(Ranking)
```typescript
interface PlayerRanking {
  playerId: string;
  season: string;
  rank: number;
  winRate: number;
  wins: number;
  totalGames: number;
  lastMatchAt: Date;
}

interface TeamRanking {
  team: [string, string];  // 两个玩家ID
  season: string;
  rank: number;
  winRate: number;
  wins: number;
  totalGames: number;
}
```

# 4 核心功能实现思路

## 4.1 随机分组算法
- 从在场玩家中随机选择4人
- 计算所有可能的分组组合 (C(4,2)/2 = 3种)
- 根据历史对战记录，优先选择对战次数最少的组合
- 如果没有历史记录，完全随机分组

## 4.2 赛季管理
- 使用自然月作为赛季周期
- 每月最后一天24:00截止，之后5分钟为结算期
- 结算期间禁止开启新比赛
- 提供赛季切换功能，可查看历史赛季数据

## 4.3 排名计算
- 胜率 = 胜场数 / 总场数
- 排序规则：胜率 > 胜场数 > 总场数(少者优先) > 最近比赛时间
- 实时计算，比赛结束后立即更新排名

## 4.4 数据同步策略
- **离线优先**: 优先使用IndexedDB本地数据
- **增量同步**: 只同步变更的数据
- **冲突解决**: 以服务器时间戳为准
- **网络恢复**: 自动检测并重试失败的同步操作

## 4.5 图片上传处理
- 前端压缩：使用Canvas将图片压缩至400x400
- 格式转换：统一转为JPEG格式
- 大小限制：前端检查文件大小≤2MB
- 上传到Firebase Storage，获取URL后保存到玩家信息

# 5 状态管理设计

## 5.1 Player Store
- 玩家列表状态
- 在场玩家状态
- 当前用户信息
- 玩家CRUD操作

## 5.2 Match Store
- 比赛历史
- 当前赛季比赛
- 比赛创建和查询

## 5.3 Ranking Store
- 个人排名缓存
- 组合排名缓存
- 排名计算逻辑

# 6 路由设计
- `/` - 重定向到匹配页面
- `/match` - 匹配页面
- `/ranking` - 排名页面
- `/details` - 明细页面
- `/profile` - 个人中心

# 7 响应式设计
- 移动端优先设计
- 断点：768px (平板)、1024px (桌面)
- 使用Element Plus的响应式组件
- 表格在小屏幕上转为卡片布局

# 8 性能优化
- 虚拟滚动：大量数据时使用
- 分页加载：明细页面支持分页
- 缓存策略：Pinia持久化插件
- 图片懒加载：头像使用懒加载

# 9 错误处理
- 全局错误边界
- 网络错误重试机制
- 用户友好的错误提示
- 离线模式提示