<template>
  <div class="ranking-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>排行榜</span>
          <el-select v-model="rankingType" style="width: 120px">
            <el-option label="个人排名" value="player" />
            <el-option label="组合排名" value="team" />
          </el-select>
        </div>
      </template>
      
      <el-table
        v-if="rankingType === 'player'"
        :data="playerRankings"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="rank" label="排名" width="80" />
        <el-table-column label="玩家">
          <template #default="{ row }">
            {{ getPlayerName(row.playerId) }}
          </template>
        </el-table-column>
        <el-table-column prop="winRate" label="胜率">
          <template #default="{ row }">
            {{ (row.winRate * 100).toFixed(1) }}%
          </template>
        </el-table-column>
        <el-table-column prop="wins" label="胜场" />
        <el-table-column prop="totalGames" label="总场数" />
      </el-table>
      
      <el-empty v-else description="组合排名功能开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRankingStore } from '@/stores/ranking'
import { usePlayerStore } from '@/stores/player'

const rankingStore = useRankingStore()
const playerStore = usePlayerStore()

const rankingType = ref<'player' | 'team'>('player')
const loading = ref(false)

const playerRankings = computed(() => rankingStore.playerRankings)

onMounted(async () => {
  loading.value = true
  try {
    await rankingStore.calculatePlayerRanking(rankingStore.currentSeason)
  } finally {
    loading.value = false
  }
})

function getPlayerName(playerId: string): string {
  const player = playerStore.getPlayer(playerId)
  return player?.name || '未知玩家'
}
</script>

<style scoped>
.ranking-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>