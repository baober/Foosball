<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>球局对战系统</h1>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="匹配" name="match" />
          <el-tab-pane label="排名" name="ranking" />
          <el-tab-pane label="明细" name="details" />
          <el-tab-pane label="我的" name="profile" />
        </el-tabs>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useMatchStore } from '@/stores/match'

const router = useRouter()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()

const activeTab = ref('match')

onMounted(async () => {
  // 初始化数据
  await playerStore.loadPlayers()
  await matchStore.loadMatches()
})

function handleTabChange(tab: string) {
  router.push(`/${tab}`)
}
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.el-footer {
  border-top: 1px solid #e4e7ed;
  padding: 0;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tab-pane) {
  flex: 1;
  text-align: center;
}
</style>