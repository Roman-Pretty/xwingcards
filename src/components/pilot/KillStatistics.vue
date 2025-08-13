/**
 * KillStatistics Component
 * 
 * Displays kill statistics summary and achievement milestones
 */
<template>
  <div>
    <!-- Statistics Summary -->
    <div class="mt-6 pt-4 border-t border-neutral-600">
      <div class="flex justify-center items-center gap-8 text-center">
        <div>
          <div class="text-3xl font-bold text-yellow-400">{{ totalKills }}</div>
          <div class="text-sm text-gray-400">Total Kills</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-400">{{ uniqueShipsKilled }}</div>
          <div class="text-sm text-gray-400">Ship Types Killed</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-400">{{ favoriteTarget.ship || 'None' }}</div>
          <div class="text-sm text-gray-400">Favorite Target ({{ favoriteTarget.kills }} kills)</div>
        </div>
      </div>
    </div>

    <!-- Achievement Milestones -->
    <div class="mt-4 pt-4 border-t border-neutral-600">
      <h3 class="text-lg font-semibold text-white mb-3">Milestones</h3>
      <div class="flex flex-wrap gap-3">
        <div 
          v-for="milestone in milestones" 
          :key="milestone.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            milestone.achieved 
              ? 'bg-yellow-600 text-yellow-100 border border-yellow-500' 
              : 'bg-gray-700 text-gray-400 border border-gray-600'
          ]"
        >
          {{ milestone.name }}
          <span v-if="!milestone.achieved" class="ml-2 opacity-70">
            ({{ milestone.progress }}/{{ milestone.target }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Total number of kills */
  totalKills: {
    type: Number,
    required: true
  },
  /** Number of unique ship types killed */
  uniqueShipsKilled: {
    type: Number,
    required: true
  },
  /** Most frequently killed target */
  favoriteTarget: {
    type: Object,
    required: true
  },
  /** Array of milestone objects */
  milestones: {
    type: Array,
    required: true
  }
})
</script>
