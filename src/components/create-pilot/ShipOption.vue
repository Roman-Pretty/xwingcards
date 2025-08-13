/**
 * ShipOption Component
 * 
 * Individual ship selection card with stats, slots, and description
 */
<template>
  <div 
    class="group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden"
    :class="{
      'ring-2 ring-yellow-500 ring-opacity-100 scale-[1.02]': isSelected,
      'hover:scale-[1.01]': !isSelected
    }"
    @click="$emit('select', ship.value)"
  >
    <div 
      class="bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 transition-all duration-300 rounded-lg h-full shadow-lg"
      :class="{
        'border-yellow-500 shadow-yellow-500/20': isSelected,
        'border-neutral-600 group-hover:border-gray-500 group-hover:shadow-lg': !isSelected
      }"
    >
      <div class="p-6 h-full flex flex-col">
        <ShipHeader 
          :ship="ship"
          :is-selected="isSelected"
        />
        
        <ShipStats 
          :ship="ship"
          class="mb-4"
        />
        
        <ShipDescription 
          :description="ship.description"
          class="mt-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShipHeader from './ShipHeader.vue'
import ShipStats from './ShipStats.vue'
import ShipDescription from './ShipDescription.vue'

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

/**
 * Component events
 */
defineEmits(['select'])
</script>
