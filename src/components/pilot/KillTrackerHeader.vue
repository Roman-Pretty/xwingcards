/**
 * KillTrackerHeader Component
 * 
 * Displays the header section of the kill tracker with pilot information
 */
<template>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-white">Ship Kill Tracker</h2>
    
    <div class="flex items-center gap-4 text-white">
      <div class="flex items-center gap-2">
        <span 
          class="font-[xwing] text-2xl -mt-1" 
          :style="{ color: getClassColor(pilotClass) }"
        >
          {{ getClassIcon(pilotClass) }}
        </span>
        <span class="font-bold">{{ pilotName }}</span>
      </div>
      <div class="text-sm text-gray-400">
        Rank {{ pilotRank }}
      </div>
    </div>
  </div>
</template>

<script setup>
import classData from '../../data/classes.json'

/**
 * Component props
 */
defineProps({
  /** Pilot name */
  pilotName: {
    type: String,
    default: ''
  },
  /** Pilot class */
  pilotClass: {
    type: String,
    default: ''
  },
  /** Pilot rank */
  pilotRank: {
    type: Number,
    default: 1
  }
})

/**
 * Get class icon from class data
 * @param {string} className - Class name
 * @returns {string} Class icon
 */
const getClassIcon = (className) => {
  return classData[className]?.icon || '?'
}

/**
 * Get class color from class data
 * @param {string} className - Class name
 * @returns {string} Color hex code
 */
const getClassColor = (className) => {
  return classData[className]?.color || '#a8a8a8'
}
</script>
