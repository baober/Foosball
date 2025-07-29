<template>
  <div class="profile-page">
    <el-card>
      <template #header>
        <span>个人中心</span>
      </template>
      
      <el-form :model="playerForm" label-width="80px">
        <el-form-item label="玩家名称">
          <el-input v-model="playerForm.name" />
        </el-form-item>
        
        <el-form-item label="玩家类型">
          <el-select v-model="playerForm.type">
            <el-option label="全能" value="全能" />
            <el-option label="前锋" value="前锋" />
            <el-option label="后卫" value="后卫" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="playerForm.avatar" :src="playerForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="createPlayer">创建玩家</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card style="margin-top: 20px">
      <template #header>
        <span>玩家列表</span>
      </template>
      
      <el-table :data="players" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column label="在场状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.isPresent"
              @change="togglePresent(row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deletePlayer(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { usePlayerStore } from '@/stores/player'
import type { PlayerType } from '@/types/player'

const playerStore = usePlayerStore()

const playerForm = ref({
  name: '',
  type: '全能' as PlayerType,
  avatar: ''
})

const players = ref([])

onMounted(async () => {
  await playerStore.loadPlayers()
  players.value = playerStore.players
})

function beforeAvatarUpload(file: File) {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    alert('头像只能是 JPG 格式!')
  }
  if (!isLt2M) {
    alert('头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

async function createPlayer() {
  if (!playerForm.value.name) {
    alert('请输入玩家名称')
    return
  }

  try {
    await playerStore.addPlayer({
      name: playerForm.value.name,
      type: playerForm.value.type,
      avatar: playerForm.value.avatar,
      isPresent: false
    })
    
    playerForm.value.name = ''
    playerForm.value.avatar = ''
    players.value = playerStore.players
  } catch (error) {
    console.error('创建玩家失败:', error)
  }
}

async function togglePresent(playerId: string) {
  try {
    await playerStore.togglePresent(playerId)
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}

async function deletePlayer(playerId: string) {
  try {
    await playerStore.deletePlayer(playerId)
    players.value = playerStore.players
  } catch (error) {
    console.error('删除玩家失败:', error)
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>