export type PlayerType = '全能' | '前锋' | '后卫'

export interface Player {
  id: string
  name: string
  type: PlayerType
  avatar?: string
  isPresent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlayerForm {
  name: string
  type: PlayerType
  avatar?: File
}