/**
 * KillGrid Component
 * 
 * Displays a responsive grid of enemy ships with kill counters
 */
<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 md:gap-4 flex-1 overflow-y-auto">
    <div 
      v-for="ship in enemies" 
      :key="ship.icon" 
      class="bg-neutral-700 border border-neutral-600 rounded-lg p-1 md:p-4 flex flex-col items-center justify-between min-h-[80px] md:min-h-[120px]"
    >
      <!-- Ship icon and name -->
      <div class="flex flex-col items-center gap-1 md:gap-2 flex-1 w-full overflow-hidden">
        <!-- Mobile layout -->
        <div class="flex md:hidden flex-col items-center gap-1 w-full">
          <span class="font-[ships] text-lg text-gray-300">{{ ship.icon }}</span>
          <span class="text-[8px] text-gray-400 text-center leading-none px-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {{ ship.ship }}
          </span>
        </div>
        
        <!-- Desktop layout -->
        <div class="hidden md:flex flex-col items-center gap-2">
          <span class="font-[ships] text-4xl text-gray-300">{{ ship.icon }}</span>
          <span class="text-xs text-gray-400 text-center leading-tight">{{ ship.ship }}</span>
        </div>
      </div>
      
      <!-- Kill counter controls -->
      <div class="flex items-center justify-between w-full mt-1 md:mt-4">
        <button 
          @click="decrementKills(ship.icon)" 
          :disabled="getKillCount(ship.icon) === 0"
          class="btn btn-xs md:btn-sm btn-circle btn-ghost text-red-400 hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed p-0 min-h-6 h-6 w-6 md:min-h-8 md:h-8 md:w-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:w-4 md:h-4">
            <path d="M5 12h14"/>
          </svg>
        </button>
        
        <div class="flex flex-col items-center">
          <span class="text-sm md:text-2xl font-bold text-white">{{ getKillCount(ship.icon) }}</span>
          <span class="text-[7px] md:text-xs text-gray-500 leading-none">kills</span>
        </div>
        
        <button 
          @click="incrementKills(ship.icon)" 
          class="btn btn-xs md:btn-sm btn-circle btn-ghost text-green-400 hover:bg-green-900/20 p-0 min-h-6 h-6 w-6 md:min-h-8 md:h-8 md:w-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:w-4 md:h-4">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Array of enemy ship objects */
  enemies: {
    type: Array,
    required: true
  },
  /** Function to get kill count for a ship */
  getKillCount: {
    type: Function,
    required: true
  },
  /** Function to increment kills for a ship */
  incrementKills: {
    type: Function,
    required: true
  },
  /** Function to decrement kills for a ship */
  decrementKills: {
    type: Function,
    required: true
  }
})
</script>
