<!--
  GroupOverview View
  
  Main view component for displaying AI difficulty adjustments based on group average rank.
  Includes pilot selection interface and difficulty level progression system.
  
  @component GroupOverview
  @requires PilotStore - For accessing pilot data
  @requires AIDifficultyCard - Main difficulty adjustment interface
-->
<template>
  <main class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <header class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-6">
      <div class="max-w-4xl px-6 mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Group Overview</h1>
          <p class="text-gray-400">View AI difficulty adjustments based on your group's average rank</p>
        </div>
        <button class="btn btn-ghost text-white" @click="$router.push('/dashboard')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
          Close
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6">
        <AIDifficultyCard 
          :all-pilots="store.pilots"
          :selected-pilot-ids="selectedPilotIds"
          @toggle-pilot="togglePilot"
          @select-all-pilots="selectAllPilots"
          @clear-all-pilots="clearAllPilots"
        />
      </div>
    </div>
  </main>
</template>

/**
 * GroupOverview View Script
 * 
 * Main logic for the group overview page. Manages pilot selection for
 * calculating average rank and determining AI difficulty adjustments.
 * 
 * @requires PilotStore - For accessing pilot data
 * @requires AIDifficultyCard - Component for difficulty adjustment interface
 */
<script setup>
import { ref, onMounted } from 'vue'
import { usePilotStore } from '../stores/PilotStore'
import AIDifficultyCard from '../components/group/AIDifficultyCard.vue'

/**
 * Pilot store instance for accessing pilot data
 */
const store = usePilotStore()

/**
 * Array of selected pilot IDs for average rank calculation
 */
const selectedPilotIds = ref([])

/**
 * Initialize component with all pilots selected
 */
onMounted(() => {
  selectedPilotIds.value = store.pilots.map(pilot => pilot.id)
})

/**
 * Toggle pilot selection status
 * @param {string} pilotId - ID of pilot to toggle
 */
const togglePilot = (pilotId) => {
  const index = selectedPilotIds.value.indexOf(pilotId)
  if (index > -1) {
    selectedPilotIds.value.splice(index, 1)
  } else {
    selectedPilotIds.value.push(pilotId)
  }
}

/**
 * Select all available pilots
 */
const selectAllPilots = () => {
  selectedPilotIds.value = store.pilots.map(pilot => pilot.id)
}

/**
 * Clear all pilot selections
 */
const clearAllPilots = () => {
  selectedPilotIds.value = []
}
</script>
