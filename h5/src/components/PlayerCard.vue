<template>
  <el-card 
    class="player-card" 
    :class="{ 
      'player-card--selected': checked,
      'player-card--disabled': disabled
    }"
    @click="handleClick"
  >
    <div class="player-content">
      <el-avatar 
        :size="size === 'small' ? 40 : 60" 
        :src="player.avatar || defaultAvatar"
      >
        {{ player.name.charAt(0) }}
      </el-avatar>
      
      <div class="player-info">
        <h4>{{ player.name }}</h4>
        <el-tag :type="getTypeTag(player.type)" size="small">
          {{ player.type }}
        </el-tag>
      </div>
      
      <el-checkbox 
        v-if="showCheckbox"
        :model-value="checked"
        @change="handleCheck"
        @click.stop
      />
    </div>
    
    <div v-if="player.isPresent" class="present-indicator">
      <el-tag type="success" size="mini">在场</el-tag>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Player } from '@/types/player'

interface Props {
  player: Player
  showCheckbox?: boolean
  checked?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  'update:checked': [value: boolean]
  'click': [player: Player]
}

const props = withDefaults(defineProps<Props>(), {
  showCheckbox: false,
  checked: false,
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

function getTypeTag(type: string): string {
  const typeMap: Record<string, string> = {
    '全能': 'primary',
    '前锋': 'success',
    '后卫': 'warning'
  }
  return typeMap[type] || 'info'
}

function handleClick() {
  if (!props.disabled) {
    emit('click', props.player)
  }
}

function handleCheck(value: boolean) {
  emit('update:checked', value)
}
</script>

<style scoped>
.player-card {
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.player-card--selected {
  border-color: #409eff;
}

.player-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.player-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-info {
  flex: 1;
}

.player-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.present-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>