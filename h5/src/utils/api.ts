import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 玩家相关 API
export const playerApi = {
  // 获取所有玩家
  getAll: () => api.get('/players'),
  
  // 创建玩家
  create: (data: { name: string; type: string }) => api.post('/players', data),
  
  // 更新玩家
  update: (id: string, data: Partial<{ name: string; type: string; is_present: boolean }>) => 
    api.put(`/players/${id}`, data),
  
  // 删除玩家
  delete: (id: string) => api.delete(`/players/${id}`),
  
  // 切换在场状态
  togglePresent: (id: string, is_present: boolean) => 
    api.patch(`/players/${id}/present`, { is_present }),
  
  // 上传头像
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/players/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// 比赛相关 API
export const matchApi = {
  // 获取所有比赛
  getAll: (params?: { season?: string; limit?: number; offset?: number }) => 
    api.get('/matches', { params }),
  
  // 获取指定赛季比赛
  getBySeason: (season: string) => api.get(`/matches/season/${season}`),
  
  // 创建比赛
  create: (data: { players: string[]; score_a?: number; score_b?: number }) => 
    api.post('/matches', data),
  
  // 更新比赛结果
  updateResult: (id: string, score_a: number, score_b: number) => 
    api.put(`/matches/${id}`, { score_a, score_b }),
  
  // 删除比赛
  delete: (id: string) => api.delete(`/matches/${id}`),
  
  // 获取个人排名
  getPlayerRankings: (season: string) => api.get(`/matches/rankings/${season}/players`),
  
  // 获取组合排名
  getTeamRankings: (season: string) => api.get(`/matches/rankings/${season}/teams`),
};

// 工具函数
export const apiUtils = {
  // 获取当前赛季
  getCurrentSeason: () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },
  
  // 格式化日期
  formatDate: (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${weekday} ${hours}:${minutes}`;
  },
  
  // 获取头像URL
  getAvatarUrl: (avatarPath?: string) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${API_BASE_URL.replace('/api', '')}${avatarPath}`;
  },
};

export default api;