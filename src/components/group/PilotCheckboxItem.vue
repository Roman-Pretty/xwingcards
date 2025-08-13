/**
 * PilotCheckboxItem Component
 * 
 * Individual pilot checkbox item with class icon and rank display
 */
<template>
  <label class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-neutral-700 transition-colors duration-150">
    <input 
      type="checkbox" 
      :checked="isSelected"
      @change="$emit('toggle')"
      class="checkbox checkbox-xs checkbox-primary"
    >
    <span 
      class="font-[xwing] text-xl -mt-1" 
      :style="{ color: getClassColor(pilot.class) }"
    >
      {{ getClassIcon(pilot.class) }}
    </span>
    <span class="flex-1 truncate text-md">{{ pilot.name }}</span>
    <span class="text-md text-gray-400">Rank {{ pilot.rank }}</span>
  </label>
</template>

<script setup>
import classData from '../../data/classes.json'

/**
 * Component props
 */
defineProps({
  /** Pilot object */
  pilot: {
    type: Object,
    required: true
  },
  /** Whether this pilot is selected */
  isSelected: {
    type: Boolean,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['toggle'])

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
