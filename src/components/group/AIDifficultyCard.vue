/**
 * AIDifficultyCard Component
 * 
 * Main container for AI difficulty adjustments interface including:
 * - Pilot selection dropdown for calculating average rank
 * - Difficulty level tiers with unlock requirements
 * - Group statistics summary
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col h-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-white">AI Difficulty Adjustments</h2>
      
      <PilotSelectionDropdown 
        :pilots="allPilots"
        :selected-pilot-ids="selectedPilotIds"
        @toggle-pilot="togglePilot"
        @select-all="selectAllPilots"
        @clear-all="clearAllPilots"
      />
    </div>
    
    <div class="space-y-4 flex-1">
      <DifficultyLevel
        v-for="level in difficultyLevels"
        :key="level.name"
        :level="level"
        :is-unlocked="averageRank >= level.requiredRank"
        :is-active="level.name === 'Standard' ? averageRank < 3 : averageRank >= level.requiredRank"
      />
    </div>

    <GroupStatistics 
      :average-rank="averageRank"
      :selected-count="selectedPilots.length"
      :total-xp="totalXP"
      class="mt-6 pt-4 border-t border-neutral-600"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PilotSelectionDropdown from './PilotSelectionDropdown.vue'
import DifficultyLevel from './DifficultyLevel.vue'
import GroupStatistics from './GroupStatistics.vue'

/**
 * Component props
 */
const props = defineProps({
  /** Array of all available pilots */
  allPilots: {
    type: Array,
    required: true
  },
  /** Array of selected pilot IDs */
  selectedPilotIds: {
    type: Array,
    required: true
  }
})

/**
 * Component events
 */
const emit = defineEmits(['toggle-pilot', 'select-all-pilots', 'clear-all-pilots'])

/**
 * Difficulty level configurations
 */
const difficultyLevels = [
  {
    name: 'Standard',
    requiredRank: 0,
    description: 'AI operates at normal difficulty levels. Base game experience.',
    color: 'green'
  },
  {
    name: 'Enhanced',
    requiredRank: 3,
    description: 'When a TIE Fighter would perform a straight maneuver, they may perform a turn or bank to get a better shot or avoid an obstacle',
    color: 'green'
  },
  {
    name: 'Veteran',
    requiredRank: 4,
    description: 'All TIE Fighters gain 1 hull & predator (if the defender is in their bullseye arc, they may reroll 1 attack die)',
    color: 'green'
  },
  {
    name: 'Ace',
    requiredRank: 5,
    description: 'All Non-Elites gain 1 shield and predator',
    color: 'green'
  },
  {
    name: 'Legendary',
    requiredRank: 6,
    description: 'Elites gain 1 shield and predator',
    color: 'green'
  }
]

/**
 * Get selected pilots from the full pilot list
 */
const selectedPilots = computed(() => {
  return props.allPilots.filter(pilot => props.selectedPilotIds.includes(pilot.id))
})

/**
 * Calculate average rank of selected pilots
 */
const averageRank = computed(() => {
  if (selectedPilots.value.length === 0) return 0
  const total = selectedPilots.value.reduce((sum, pilot) => sum + pilot.rank, 0)
  return Math.ceil(total / selectedPilots.value.length)
})

/**
 * Calculate total XP of selected pilots
 */
const totalXP = computed(() => {
  return selectedPilots.value.reduce((sum, pilot) => sum + pilot.xp, 0)
})

/**
 * Toggle pilot selection
 * @param {string} pilotId - ID of pilot to toggle
 */
const togglePilot = (pilotId) => {
  emit('toggle-pilot', pilotId)
}

/**
 * Select all pilots
 */
const selectAllPilots = () => {
  emit('select-all-pilots')
}

/**
 * Clear all pilot selections
 */
const clearAllPilots = () => {
  emit('clear-all-pilots')
}
</script>
