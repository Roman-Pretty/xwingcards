/**
 * MobileLoadoutTab Component
 * 
 * Mobile view for loadout, ships, and rank sections
 */
<template>
  <div class="flex-1 p-4 text-white overflow-y-auto pb-20">
    <!-- Mobile Pilot Header -->
    <div class="flex flex-row justify-between w-full items-center mb-4">
      <div class="flex flex-row gap-4">
        <div class="text-lg flex flex-row gap-2 items-center cursor-default">
          <span class="font-[xwing] text-2xl -mt-2" :style="{ color: classColor }">{{ classIcon }}</span>
          <span class="font-bold" :style="{ color: classColor }">The {{ pilotClass }}</span>
        </div>

        <div class="text-lg flex flex-row items-center cursor-default text-yellow-300">
          <span class="font-[xwing] text-2xl -mt-2">Ì</span>
          <span class="font-bold">{{ pilotXp }}</span>
        </div>
      </div>
      <div class="flex flex-row-reverse gap-2 items-center">
        <button class="btn btn-sm" @click="$emit('add-xp')">Add XP</button>
        <PilotTabs @add-pilot="$emit('add-pilot')" />
      </div>
    </div>

    <!-- Loadout Section -->
    <div>
      <div class="w-full flex flex-row items-center justify-between mb-4">
        <h2 class="text-lg">Loadout</h2>
        <div 
          v-for="(count, symbol) in factionCounts" 
          :key="symbol" 
          :style="{ color: getFactionColor(symbol) }"
          class="text-lg flex flex-row items-center gap-1 cursor-default"
        >
          <span class="font-[xwing] font-light text-xl -mt-1.5">{{ symbol }}</span>
          <span class="font-bold">{{ usedSlots[symbol] || 0 }} / {{ count }}</span>
        </div>
      </div>
      <Slots class="w-full" :currently-dragged-card="currentlyDraggedCard" :mobile-mode="true" />
    </div>

    <!-- Ships Section -->
    <div class="mt-6">
      <h2 class="text-lg mb-4">Ships</h2>
      <Ships />
    </div>

    <!-- Rank Section -->
    <div class="mt-6">
      <h2 class="text-lg mb-4">Rank</h2>
      <RankList />
    </div>
  </div>
</template>

<script setup>
import PilotTabs from '../../pilots/PilotTabs.vue'
import Slots from '../../slots/Slots.vue'
import Ships from '../../sections/Ships.vue'
import RankList from '../../sections/RankList.vue'

/**
 * Component props
 */
defineProps({
  /** Pilot class name */
  pilotClass: {
    type: String,
    required: true
  },
  /** Pilot class icon */
  classIcon: {
    type: String,
    required: true
  },
  /** Pilot class color */
  classColor: {
    type: String,
    required: true
  },
  /** Current pilot XP */
  pilotXp: {
    type: Number,
    required: true
  },
  /** Unlocked faction counts */
  factionCounts: {
    type: Object,
    required: true
  },
  /** Used faction slots */
  usedSlots: {
    type: Object,
    required: true
  },
  /** Currently dragged card */
  currentlyDraggedCard: {
    type: Object,
    default: null
  }
})

/**
 * Component events
 */
defineEmits(['add-xp', 'add-pilot'])

/**
 * Get faction color based on symbol
 * @param {string} symbol - Faction symbol
 * @returns {string} Hex color code
 */
function getFactionColor(symbol) {
  const factionColors = {
    "@": "#609bca", // empire
    "h": "#f9a8d4", // force
    "!": "#ff9900", // resistance
    "+": "#ff4e32", // firstorder
    "#": "#2ec22b", // scum
    "/": "#ff6048", // republic  
    ".": "#72b8f0"  // separatists 
  }
  return factionColors[symbol] || "#6b7280"
}
</script>
