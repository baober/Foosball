<template>
  <div class="match-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>开始新比赛</span>
          <el-button type="primary" @click="startMatch" :disabled="!canStartMatch">
            开始匹配
          </el-button>
        </div>
      </template>
      
      <div class="players-section">
        <h3>选择在场玩家（{{ selectedPlayers.length }}/4）</h3>
        <div class="players-grid">
          <PlayerCard
            v-for="player in presentPlayers"
            :key="player.id"
            :player="player"
            :show-checkbox="true"
            :checked="selectedPlayers.includes(player.id)"
            @update:checked="togglePlayer(player.id)"
          />
        </div>
      </div>
      
      <div v-if="currentMatch" class="match-result">
        <h3>当前比赛</h3>
        <MatchResult :match="currentMatch" :players="allPlayers" />
        
        <div class="score-input">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input-number
                v-model="currentMatch.scoreA"
                :min="0"
                :max="21"
                @change="updateScore"
              />
              <div>队伍A</div>
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="currentMatch.scoreB"
                :min="0"
                :max="21"
                @change="updateScore"
              />
              <div>队伍B</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useMatchStore } from '@/stores/match'
import PlayerCard from '@/components/PlayerCard.vue'
import MatchResult from '@/components/MatchResult.vue'

const playerStore = usePlayerStore()
const matchStore = useMatchStore()

const selectedPlayers = ref<string[]>([])
const currentMatch = ref<ReturnType<typeof matchStore.getMatch>>()

const presentPlayers = computed(() => playerStore.presentPlayers)
const allPlayers = computed(() => playerStore.players)
const canStartMatch = computed(() => selectedPlayers.value.length === 4)

onMounted(() => {
  // 加载最新数据
})

function togglePlayer(playerId: string) {
  const index = selectedPlayers.value.indexOf(playerId)
  if (index > -1) {
    selectedPlayers.value.splice(index, 1)
  } else if (selectedPlayers.value.length < 4) {
    selectedPlayers.value.push(playerId)
  }
}

async function startMatch() {
  if (selectedPlayers.value.length !== 4) return
  
  try {
    const match = await matchStore.createMatch(selectedPlayers.value)
    currentMatch.value = match
    selectedPlayers.value = []
  } catch (error) {
    console.error('创建比赛失败:', error)
  }
}

async function updateScore() {
  if (!currentMatch.value) return
  
  try {
    await matchStore.updateMatchScore(
      currentMatch.value.id,
      currentMatch.value.scoreA,
      currentMatch.value.scoreB
    )
  } catch (error) {
    console.error('更新比分失败:', error)
  }
}
</script>

<style scoped>
.match-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.players-section {
  margin-bottom: 20px;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.match-result {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.score-input {
  margin-top: 20px;
  text-align: center;
}
</style>