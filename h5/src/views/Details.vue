<template>
  <div class="details-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>比赛明细</span>
          <el-select v-model="selectedSeason" style="width: 120px">
            <el-option
              v-for="season in seasons"
              :key="season"
              :label="season"
              :value="season"
            />
          </el-select>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="match in matches"
          :key="match.id"
          :timestamp="formatDateTime(match.playedAt)"
        >
          <MatchResult :match="match" :players="allPlayers" :show-time="false" />
        </el-timeline-item>
      </el-timeline>
      
      <el-empty v-if="matches.length === 0" description="暂无比赛记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMatchStore } from '@/stores/match'
import { usePlayerStore } from '@/stores/player'
import MatchResult from '@/components/MatchResult.vue'
import { formatDateTime } from '@/utils/date'

const matchStore = useMatchStore()
const playerStore = usePlayerStore()

const selectedSeason = ref('')

const matches = computed(() => 
  matchStore.getMatchesBySeason(selectedSeason.value)
)

const allPlayers = computed(() => playerStore.players)
const seasons = computed(() => {
  const seasonSet = new Set(matchStore.matches.map(m => m.season))
  return Array.from(seasonSet).sort().reverse()
})

onMounted(() => {
  selectedSeason.value = new Date().toISOString().slice(0, 7)
})
</script>

<style scoped>
.details-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>