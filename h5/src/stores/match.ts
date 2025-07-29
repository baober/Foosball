import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Match } from '@/types/match'
import { db } from '@/utils/db'
import { getCurrentSeason } from '@/utils/date'
import { usePlayerStore } from './player'

export const useMatchStore = defineStore('match', () => {
  const matches = ref<Map<string, Match>>(new Map())
  const loading = ref(false)

  const allMatches = computed(() => Array.from(matches.value.values()))
  
  const currentSeasonMatches = computed(() => {
    const currentSeason = getCurrentSeason()
    return allMatches.value.filter(m => m.season === currentSeason)
  })

  async function loadMatches() {
    loading.value = true
    try {
      const matchList = await db.matches.orderBy('playedAt').reverse().toArray()
      matches.value = new Map(matchList.map(m => [m.id, m]))
    } finally {
      loading.value = false
    }
  }

  async function createMatch(players: string[]): Promise<Match> {
    if (players.length !== 4) {
      throw new Error('需要4名玩家')
    }

    const [teamA, teamB] = generateTeams(players)
    
    const match: Match = {
      id: crypto.randomUUID(),
      season: getCurrentSeason(),
      teamA: teamA as [string, string],
      teamB: teamB as [string, string],
      scoreA: 0,
      scoreB: 0,
      winner: 'A',
      playedAt: new Date(),
      createdAt: new Date()
    }

    // 乐观更新
    matches.value.set(match.id, match)
    
    try {
      await db.matches.add(match)
      return match
    } catch (error) {
      matches.value.delete(match.id)
      throw error
    }
  }

  async function updateMatchScore(
    matchId: string, 
    scoreA: number, 
    scoreB: number
  ): Promise<void> {
    const match = matches.value.get(matchId)
    if (!match) return

    const updatedMatch = {
      ...match,
      scoreA,
      scoreB,
      winner: scoreA > scoreB ? 'A' : 'B'
    }

    matches.value.set(matchId, updatedMatch)
    
    try {
      await db.matches.update(matchId, updatedMatch)
    } catch (error) {
      matches.value.set(matchId, match)
      throw error
    }
  }

  async function deleteMatch(matchId: string): Promise<void> {
    const match = matches.value.get(matchId)
    if (!match) return

    matches.value.delete(matchId)
    
    try {
      await db.matches.delete(matchId)
    } catch (error) {
      matches.value.set(matchId, match)
      throw error
    }
  }

  function generateTeams(players: string[]): [string[], string[]] {
    // 简单的随机分组
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    return [shuffled.slice(0, 2), shuffled.slice(2, 4)]
  }

  function getMatchesBySeason(season: string): Match[] {
    return allMatches.value.filter(m => m.season === season)
  }

  function getMatch(id: string): Match | undefined {
    return matches.value.get(id)
  }

  return {
    matches: allMatches,
    currentSeasonMatches,
    loading,
    loadMatches,
    createMatch,
    updateMatchScore,
    deleteMatch,
    getMatchesBySeason,
    getMatch
  }
})