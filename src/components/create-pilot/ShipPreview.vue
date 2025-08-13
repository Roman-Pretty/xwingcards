/**
 * ShipPreview Component
 * 
 * Preview of available ships for a pilot class with limited display
 */
<template>
  <div class="flex-1">
    <div class="text-sm text-gray-200 mb-3 font-medium drop-shadow">
      Additional Ships:
    </div>
    <div class="flex gap-3 overflow-x-auto pb-2">
      <div 
        v-for="ship in displayShips" 
        :key="ship.ship"
        class="flex-shrink-0 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center min-w-[90px] shadow-lg"
      >
        <div class="font-[ships] text-2xl mb-2 text-gray-200">{{ ship.icon }}</div>
        <div class="text-xs text-gray-300 mb-2 font-medium">{{ ship.ship }}</div>
        <div class="flex justify-center gap-1 text-xs font-[xwing] text-gray-400">
          <span v-for="(slot, idx) in ship.slots" :key="idx">{{ slot }}</span>
        </div>
      </div>
      <div 
        v-if="remainingCount > 0" 
        class="flex-shrink-0 flex items-center text-gray-300 text-sm px-2 font-medium drop-shadow"
      >
        +{{ remainingCount }} more
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Array of available ships for the class */
  ships: {
    type: Array,
    required: true
  },
  /** Maximum number of ships to display */
  maxDisplay: {
    type: Number,
    default: 4
  }
})

/**
 * Get ships to display based on rank priority
 */
const displayShips = computed(() => {
  const rank3AndAbove = props.ships.filter(s => s.rank >= 3)
  const rank2AndBelow = props.ships.filter(s => s.rank < 3)
  
  // Show higher rank ships first, fallback to lower rank if none available
  const shipsToShow = rank3AndAbove.length > 0 ? rank3AndAbove : rank2AndBelow
  return shipsToShow.slice(0, props.maxDisplay)
})

/**
 * Calculate remaining ships count
 */
const remainingCount = computed(() => {
  const rank3AndAbove = props.ships.filter(s => s.rank >= 3)
  const rank2AndBelow = props.ships.filter(s => s.rank < 3)
  
  const totalShipsToShow = rank3AndAbove.length > 0 ? rank3AndAbove.length : rank2AndBelow.length
  return Math.max(0, totalShipsToShow - props.maxDisplay)
})
</script>
