/**
 * ShipOverviewCard Component
 * 
 * Displays detailed information about the pilot's selected ship including:
 * - Ship image and visual representation
 * - Ship abilities and description
 * - Combat statistics (attack, agility, hull, shields)
 * - Maneuver dial and ship-specific notes
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
    <h2 class="text-xl font-semibold text-white mb-4">Ship Overview</h2>
    
    <div v-if="selectedShip" class="flex gap-6">
      <ShipStatsCard 
        :ship-name="selectedShip" 
        class="flex-shrink-0 w-80" 
      />
      
      <div class="flex-1">
        <ManeuverDial :ship-name="selectedShip" />
        <ShipNotes 
          v-if="shipNotes.length > 0" 
          :notes="shipNotes" 
          class="mt-4" 
        />
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-gray-400">
      <p>No ship selected. Select a ship from the dashboard to see it here.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ShipStatsCard from './ShipStatsCard.vue'
import ManeuverDial from './ManeuverDial.vue'
import ShipNotes from './ShipNotes.vue'
import shipData from '../../data/ships.json'

/**
 * Component props
 */
const props = defineProps({
  /** Name of the selected ship */
  selectedShip: {
    type: String,
    default: null
  }
})

/**
 * Get ship-specific notes
 */
const shipNotes = computed(() => {
  if (!props.selectedShip) return []
  const ship = shipData[props.selectedShip]
  return ship?.notes || []
})
</script>
