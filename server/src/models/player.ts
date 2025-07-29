export interface Player {
  id: string
  name: string
  type: '全能' | '前锋' | '后卫'
  avatar?: string
  isPresent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreatePlayerRequest {
  name: string
  type: '全能' | '前锋' | '后卫'
  avatar?: string
}

export interface UpdatePlayerRequest {
  name?: string
  type?: '全能' | '前锋' | '后卫'
  avatar?: string
  isPresent?: boolean
}