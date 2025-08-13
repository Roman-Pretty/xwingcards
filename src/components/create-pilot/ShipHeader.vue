/**
 * ShipHeader Component
 * 
 * Header section of ship option with icon, name, and selection indicator
 */
<template>
  <div class="flex items-start gap-4 mb-4">
    <!-- Ship Icon -->
    <div class="font-[ships] text-5xl text-gray-300 flex-shrink-0 drop-shadow-lg">
      {{ ship.icon }}
    </div>
    
    <!-- Ship Info -->
    <div class="flex-1">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xl font-bold text-white">{{ ship.label }}</h3>
        <SelectionIndicator :is-selected="isSelected" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectionIndicator from './SelectionIndicator.vue'

/**
 * Component props
 */
defineProps({
  /** Ship information object */
  ship: {
    type: Object,
    required: true
  },
  /** Whether this ship is selected */
  isSelected: {
    type: Boolean,
    default: false
  }
})
</script>
