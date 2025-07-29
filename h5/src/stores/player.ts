import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player } from '@/types/player'
import { db } from '@/utils/db'

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const players = ref<Map<string, Player>>(new Map())
  const loading = ref(false)

  // 计算属性
  const allPlayers = computed(() => Array.from(players.value.values()))
  const presentPlayers = computed(() => 
    allPlayers.value.filter(p => p.isPresent)
  )
  const playerMap = computed(() => players.value)

  // 方法
  async function loadPlayers() {
    loading.value = true
    try {
      const playerList = await db.players.toArray()
      players.value = new Map(playerList.map(p => [p.id, p]))
    } finally {
      loading.value = false
    }
  }

  async function addPlayer(playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) {
    const newPlayer: Player = {
      ...playerData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // 乐观更新
    players.value.set(newPlayer.id, newPlayer)
    
    try {
      await db.players.add(newPlayer)
      return newPlayer.id
    } catch (error) {
      // 回滚
      players.value.delete(newPlayer.id)
      throw error
    }
  }

  async function updatePlayer(id: string, updates: Partial<Player>) {
    const player = players.value.get(id)
    if (!player) return
    
    const updatedPlayer = { ...player, ...updates, updatedAt: new Date() }
    players.value.set(id, updatedPlayer)
    
    try {
      await db.players.update(id, updatedPlayer)
    } catch (error) {
      // 回滚
      players.value.set(id, player)
      throw error
    }
  }

  async function deletePlayer(id: string) {
    const player = players.value.get(id)
    if (!player) return
    
    players.value.delete(id)
    
    try {
      await db.players.delete(id)
    } catch (error) {
      // 回滚
      players.value.set(id, player)
      throw error
    }
  }

  function togglePresent(playerId: string) {
    const player = players.value.get(playerId)
    if (player) {
      updatePlayer(playerId, { isPresent: !player.isPresent })
    }
  }

  function getPlayer(id: string): Player | undefined {
    return players.value.get(id)
  }

  return {
    players: allPlayers,
    presentPlayers,
    playerMap,
    loading,
    loadPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    togglePresent,
    getPlayer
  }
})