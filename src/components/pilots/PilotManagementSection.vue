/**
 * PilotManagementSection.vue
 * 
 * A component for displaying and managing the list of pilots.
 * Provides functionality to edit and delete pilots with appropriate modal interactions.
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col overflow-hidden">
    <h2 class="text-xl font-semibold text-white mb-4">Pilot Management</h2>
    
    <div class="space-y-4 overflow-y-auto flex-1 pr-2 pb-6">
      <div 
        v-for="pilot in pilots" 
        :key="pilot.id" 
        class="bg-neutral-900 border border-neutral-600 rounded-lg p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span 
                class="font-[xwing] text-2xl -mt-1" 
                :style="{ color: getPilotColor(pilot.class) }"
              >
                {{ getPilotIcon(pilot.class) }}
              </span>
              <div>
                <h3 class="text-lg font-semibold text-white">{{ pilot.name }}</h3>
                <p class="text-sm text-gray-400">{{ pilot.class }} - Rank {{ pilot.rank }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="btn btn-sm btn-primary" 
              @click="$emit('edit-pilot', pilot)"
            >
              Edit
            </button>
            <button 
              class="btn btn-sm btn-error" 
              @click="$emit('delete-pilot', pilot)"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="flex flex-wrap w-full justify-between gap-4 text-sm">
          <div class="flex items-center gap-2 text-yellow-300">
            <span class="font-[xwing] text-lg -mt-1">Ì</span>
            <span>XP: {{ pilot.xp || 0 }}</span>
          </div>
          <div class="text-gray-300">
            <span>Cards: {{ pilot.ownedCards?.length || 0 }}</span>
          </div>
          <div class="text-gray-300">
            <span>Ships: {{ pilot.ships?.length || 0 }}</span>
          </div>
          <div class="text-gray-300">
            <span>Current Ship: {{ pilot.selectedShip || 'None' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '../../stores/PilotStore'
import classData from '../../data/classes.json'

/**
 * Component props interface
 */
interface Props {
  /** Array of pilot objects to display */
  pilots: Pilot[]
}

/**
 * Component events interface
 */
interface Emits {
  /** Emitted when user wants to edit a pilot */
  (e: 'edit-pilot', pilot: Pilot): void
  /** Emitted when user wants to delete a pilot */
  (e: 'delete-pilot', pilot: Pilot): void
}

defineProps<Props>()
defineEmits<Emits>()

/**
 * Get the icon character for a pilot class
 * @param pilotClass - The pilot's class
 * @returns The icon character or empty string if not found
 */
function getPilotIcon(pilotClass: string): string {
  return classData[pilotClass]?.icon || ''
}

/**
 * Get the color hex code for a pilot class
 * @param pilotClass - The pilot's class
 * @returns The color hex code or default yellow if not found
 */
function getPilotColor(pilotClass: string): string {
  return classData[pilotClass]?.color || '#fbbf24'
}
</script>
