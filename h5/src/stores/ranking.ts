import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayerRanking, TeamRanking } from '@/types/ranking'
import { useMatchStore } from './match'
import { usePlayerStore } from './player'
import { db } from '@/utils/db'
import { getCurrentSeason } from '@/utils/date'

export const useRankingStore = defineStore('ranking', () => {
  const playerRankings = ref<Map<string, PlayerRanking>>(new Map())
  const teamRankings = ref<Map<string, TeamRanking>>(new Map())
  const loading = ref(false)

  const currentSeason = computed(() => getCurrentSeason())

  async function calculatePlayerRanking(season: string) {
    loading.value = true
    
    try {
      const matchStore = useMatchStore()
      const playerStore = usePlayerStore()
      
      const matches = matchStore.getMatchesBySeason(season)
      const players = playerStore.players
      
      const stats = new Map<string, { wins: number; total: number; lastMatch: Date }>()
      
      // 统计每个玩家的数据
      matches.forEach(match => {
        const winnerTeam = match.winner === 'A' ? match.teamA : match.teamB
        const loserTeam = match.winner === 'A' ? match.teamB : match.teamA
        
        const allPlayers = [...match.teamA, ...match.teamB]
        
        allPlayers.forEach(playerId => {
          if (!stats.has(playerId)) {
            stats.set(playerId, { wins: 0, total: 0, lastMatch: match.playedAt })
          }
          
          const stat = stats.get(playerId)!
          stat.total++
          if (winnerTeam.includes(playerId)) {
            stat.wins++
          }
          stat.lastMatch = match.playedAt > stat.lastMatch ? match.playedAt : stat.lastMatch
        })
      })
      
      // 计算排名
      const rankings = Array.from(stats.entries())
        .map(([playerId, stat]) => ({
          playerId,
          season,
          rank: 0,
          winRate: stat.total > 0 ? stat.wins / stat.total : 0,
          wins: stat.wins,
          totalGames: stat.total,
          lastMatchAt: stat.lastMatch
        }))
        .sort((a, b) => {
          // 按胜率降序
          if (b.winRate !== a.winRate) return b.winRate - a.winRate
          // 胜率相同按胜场降序
          if (b.wins !== a.wins) return b.wins - a.wins
          // 胜场相同按总场数升序
          if (a.totalGames !== b.totalGames) return a.totalGames - b.totalGames
          // 总场数相同按最近比赛时间升序
          return a.lastMatchAt.getTime() - b.lastMatchAt.getTime()
        })
        .map((ranking, index) => ({ ...ranking, rank: index + 1 }))
      
      // 保存到数据库
      await db.playerRankings.where('season').equals(season).delete()
      await db.playerRankings.bulkAdd(rankings)
      
      // 更新状态
      playerRankings.value = new Map(
        rankings.map(r => [`${r.playerId}-${r.season}`, r])
      )
      
    } finally {
      loading.value = false
    }
  }

  async function calculateTeamRanking(season: string) {
    // 类似地实现组合排名计算
    // 这里简化实现，实际项目中需要更复杂的逻辑
  }

  function getPlayerRankings(season: string): PlayerRanking[] {
    return Array.from(playerRankings.value.values())
      .filter(r => r.season === season)
      .sort((a, b) => a.rank - b.rank)
  }

  function getTeamRankings(season: string): TeamRanking[] {
    return Array.from(teamRankings.value.values())
      .filter(r => r.season === season)
      .sort((a, b) => a.rank - b.rank)
  }

  function getPlayerWinRate(playerId: string, season?: string): number {
    const targetSeason = season || currentSeason.value
    const key = `${playerId}-${targetSeason}`
    const ranking = playerRankings.value.get(key)
    
    return ranking ? ranking.winRate : 0
  }

  return {
    playerRankings: computed(() => getPlayerRankings(currentSeason.value)),
    teamRankings: computed(() => getTeamRankings(currentSeason.value)),
    loading,
    calculatePlayerRanking,
    calculateTeamRanking,
    getPlayerRankings,
    getTeamRankings,
    getPlayerWinRate
  }
})