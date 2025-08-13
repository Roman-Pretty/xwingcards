/**
 * ShipStats Component
 * 
 * Displays ship combat statistics in a responsive grid layout
 */
<template>
  <div class="grid gap-2" :class="gridClass">
    <!-- Primary Attack -->
    <div v-if="shipStats.attack !== undefined" class="flex items-center justify-center gap-1">
      <span class="font-[xwing] text-red-400 text-lg pb-1">{{ shipStats.arc }}</span>
      <span class="text-lg font-bold text-red-400">{{ shipStats.attack }}</span>
    </div>
    
    <!-- Secondary Attack -->
    <div v-if="shipStats.secondAttack !== undefined" class="flex items-center justify-center gap-1">
      <span class="font-[xwing] text-red-400 text-lg pb-1 ml-2">
        {{ shipStats.secondArc || shipStats.arc }}
      </span>
      <span class="text-lg font-bold text-red-400">{{ shipStats.secondAttack }}</span>
    </div>
    
    <!-- Agility -->
    <div v-if="shipStats.agility !== undefined" class="flex items-center justify-center gap-1">
      <span class="font-[xwing] text-green-400 text-lg pb-1">e</span>
      <span class="text-lg font-bold text-green-400">{{ shipStats.agility }}</span>
    </div>
    
    <!-- Hull -->
    <div v-if="shipStats.hull !== undefined" class="flex items-center justify-center gap-1">
      <span class="font-[xwing] text-yellow-400 text-lg pb-1">&</span>
      <span class="text-lg font-bold text-yellow-400">{{ shipStats.hull }}</span>
    </div>
    
    <!-- Shields -->
    <div v-if="shipStats.shields !== undefined" class="flex items-center justify-center gap-1">
      <span class="font-[xwing] text-blue-400 text-lg pb-1">*</span>
      <span class="text-lg font-bold text-blue-400">{{ shipStats.shields }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Ship statistics object */
  shipStats: {
    type: Object,
    required: true
  }
})

/**
 * Calculate grid class based on number of stats
 */
const gridClass = computed(() => {
  let statCount = 1 // Always have attack
  
  if (props.shipStats.agility !== undefined) statCount++
  if (props.shipStats.hull !== undefined) statCount++
  if (props.shipStats.shields !== undefined) statCount++
  if (props.shipStats.secondAttack !== undefined) statCount++
  
  switch(statCount) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-2'
    case 3: return 'grid-cols-3'
    case 4: return 'grid-cols-4'
    case 5: return 'grid-cols-5'
    default: return 'grid-cols-4'
  }
})
</script>
