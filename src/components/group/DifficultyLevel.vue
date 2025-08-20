/**
 * DifficultyLevel Component
 * 
 * Displays individual AI difficulty level with unlock status and description
 */
<template>
  <div 
    class="rounded-lg p-4 border"
    :class="[containerClasses, !isActive ? 'opacity-60' : '']"
  >
    <div class="mb-3">
      <h3 
        class="font-semibold mb-1" 
        :class="titleClasses"
      >
        {{ level.name }}
      </h3>
      <span 
        class="text-xs px-2 py-1 rounded inline-block" 
        :class="badgeClasses"
      >
        {{ badgeText }}
      </span>
    </div>
    
    <div 
      class="text-sm" 
      :class="descriptionClasses"
      v-html="processedDescription"
    >
    </div>
    
    <div 
      v-if="!isUnlocked" 
      class="text-xs text-gray-500 mt-2 italic text-center"
    >
      Unlocks at Average Rank {{ level.requiredRank }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Difficulty level configuration object */
  level: {
    type: Object,
    required: true
  },
  /** Whether this difficulty level is unlocked */
  isUnlocked: {
    type: Boolean,
    required: true
  },
  /** Whether this difficulty level is currently active */
  isActive: {
    type: Boolean,
    required: true
  }
})

/**
 * Container CSS classes based on unlock status
 */
const containerClasses = computed(() => {
  if (props.isUnlocked) {
    return 'bg-green-900/30 border-green-700'
  }
  return 'bg-gray-900/30 border-gray-700 opacity-60'
})

/**
 * Title CSS classes based on unlock status
 */
const titleClasses = computed(() => {
  return props.isUnlocked ? 'text-green-400' : 'text-gray-400'
})

/**
 * Badge CSS classes and text based on status
 */
const badgeClasses = computed(() => {
  if (props.isActive && props.level.name === 'Standard') {
    return 'bg-green-600 text-green-100'
  }
  if (props.isUnlocked) {
    return 'bg-green-600 text-green-100'
  }
  return 'bg-gray-600 text-gray-300'
})

/**
 * Badge text based on level and status
 */
const badgeText = computed(() => {
  if (props.level.name === 'Standard') {
    return props.isActive ? 'ACTIVE' : 'INACTIVE'
  }
  return props.isUnlocked ? 'UNLOCKED' : 'LOCKED'
})

/**
 * Description CSS classes based on unlock status
 */
const descriptionClasses = computed(() => {
  return props.isUnlocked ? 'text-green-200' : 'text-gray-400'
})

/**
 * Process description text to include proper game symbols
 */
const processedDescription = computed(() => {
  let desc = props.level.description
  
  // Replace common game symbols
  desc = desc.replace(/TIE Fighter/g, '<span class="font-[ships] text-2xl">F</span>')
  desc = desc.replace(/straight maneuver/g, '<span class="font-[xwing]">2</span> maneuver')
  desc = desc.replace(/turn or bank/g, '<span class="font-[xwing] pb-1">1</span> or <span class="font-[xwing] pb-1">3</span> maneuver')
  desc = desc.replace(/bullseye arc/g, '<span class="font-[xwing] pb-1">}</span>')
  
  return desc
})
</script>
