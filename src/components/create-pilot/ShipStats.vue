/**
 * ShipStats Component
 * 
 * Displays ship statistics including XP and loadout slots
 */
<template>
  <div class="space-y-4">
    <!-- Starting XP -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-400 font-medium">Starting XP:</span>
      <div class="flex items-center gap-1 text-yellow-300 font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
        <span class="font-[xwing] text-lg font-light">Ì</span>
        <span>{{ ship.xp }}</span>
      </div>
    </div>
    
    <!-- Loadout Slots -->
    <div>
      <span class="text-sm text-gray-400 font-medium block mb-3">Loadout Slots:</span>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="(slot, i) in ship.slots" 
          :key="i"
          class="inline-flex items-center justify-center w-9 h-9 bg-neutral-600 rounded-lg text-white font-[xwing] text-sm shadow-md border border-neutral-500"
        >
          {{ slot }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Ship information object */
  ship: {
    type: Object,
    required: true
  }
})
</script>
