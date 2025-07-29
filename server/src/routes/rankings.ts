import express from 'express'
import type { PlayerRanking, TeamRanking } from '../models/match'

const router = express.Router()

// 模拟数据存储
let playerRankings: Map<string, PlayerRanking[]> = new Map()
let teamRankings: Map<string, TeamRanking[]> = new Map()

// 获取个人排名
router.get('/:season/players', (req, res) => {
  const { season } = req.params
  const rankings = playerRankings.get(season) || []
  res.json(rankings)
})

// 获取组合排名
router.get('/:season/teams', (req, res) => {
  const { season } = req.params
  const rankings = teamRankings.get(season) || []
  res.json(rankings)
})

// 计算排名（模拟实现）
router.post('/calculate/:season', (req, res) => {
  const { season } = req.params
  
  // 这里应该实现实际的排名计算逻辑
  // 目前返回模拟数据
  
  const mockPlayerRankings: PlayerRanking[] = [
    {
      playerId: 'player1',
      season,
      rank: 1,
      winRate: 0.8,
      wins: 8,
      totalGames: 10,
      lastMatchAt: new Date()
    },
    {
      playerId: 'player2',
      season,
      rank: 2,
      winRate: 0.7,
      wins: 7,
      totalGames: 10,
      lastMatchAt: new Date()
    }
  ]
  
  playerRankings.set(season, mockPlayerRankings)
  
  res.json({ message: 'Rankings calculated successfully', season })
})

export default router