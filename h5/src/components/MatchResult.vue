<template>
  <div class="match-result">
    <div class="teams-container">
      <div class="team" :class="{ 'team--winner': match.winner === 'A' }">
        <div class="team-players">
          <span v-for="playerId in match.teamA" :key="playerId">
            {{ getPlayerName(playerId) }}
          </span>
        </div>
        <div class="team-score">{{ match.scoreA }}</div>
      </div>
      
      <div class="vs">VS</div>
      
      <div class="team" :class="{ 'team--winner': match.winner === 'B' }">
        <div class="team-players">
          <span v-for="playerId in match.teamB" :key="playerId">
            {{ getPlayerName(playerId) }}
          </span>
        </div>
        <div class="team-score">{{ match.scoreB }}</div>
      </div>
    </div>
    
    <div v-if="showTime" class="match-time">
      {{ formatDate(match.playedAt) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Match } from '@/types/match'
import { usePlayerStore } from '@/stores/player'
import { formatDate } from '@/utils/date'

interface Props {
  match: Match
  players: Array<{ id: string; name: string }>
  showTime?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTime: false,
  compact: false
})

const playerStore = usePlayerStore()

function getPlayerName(playerId: string): string {
  const player = playerStore.getPlayer(playerId)
  return player?.name || '未知玩家'
}
</script>

<style scoped>
.match-result {
  padding: 16px;
}

.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.team {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.team--winner {
  background-color: #e6f7ff;
  border: 2px solid #409eff;
}

.team-players {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.team-players span {
  font-size: 14px;
  color: #606266;
}

.team-score {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.vs {
  font-size: 18px;
  font-weight: bold;
  color: #909399;
}

.match-time {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .teams-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .team {
    width: 100%;
  }
}
</style>