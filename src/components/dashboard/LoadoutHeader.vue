/**
 * LoadoutHeader Component
 * 
 * Displays loadout title and faction slot counts
 */
<template>
  <div class="w-full flex flex-row items-center justify-start gap-4 mb-4">
    <h2 class="text-lg mr-auto">Loadout</h2>
    <div 
      v-for="(count, symbol) in factionCounts" 
      :key="symbol" 
      :style="{ color: getFactionColor(symbol) }"
      class="text-xl flex flex-row items-center gap-1 cursor-default"
    >
      <span class="font-[xwing] font-light text-2xl -mt-1.5">{{ symbol }}</span>
      <span class="font-bold">{{ usedSlots[symbol] || 0 }} / {{ count }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Unlocked faction counts by symbol */
  factionCounts: {
    type: Object,
    required: true
  },
  /** Used faction slots by symbol */
  usedSlots: {
    type: Object,
    required: true
  }
})

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
