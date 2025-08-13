/**
 * ShipSelectionStep Component
 * 
 * Third step of pilot creation - starting ship selection
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
    <StepHeader step-number="3" title="Choose Starting Ship" />
    
    <div class="ml-11 space-y-4">
      <p class="text-gray-400 text-sm">
        Your starting ship determines your initial loadout slots and experience points.
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <ShipOption
          v-for="ship in availableShips"
          :key="ship.value"
          :ship="ship"
          :is-selected="selectedShip === ship.value"
          @select="handleSelect"
        />
      </div>
      
      <ValidationMessage :error="error" :success="selectedShip && !error" success-text="✓ Ship selected!" />
    </div>
  </div>
</template>

<script setup>
import StepHeader from './StepHeader.vue'
import ShipOption from './ShipOption.vue'
import ValidationMessage from './ValidationMessage.vue'

/**
 * Component props
 */
const props = defineProps({
  /** Available starting ships */
  availableShips: {
    type: Array,
    required: true
  },
  /** Currently selected ship */
  selectedShip: {
    type: String,
    default: ''
  },
  /** Validation error message */
  error: {
    type: String,
    default: ''
  }
})

/**
 * Component events
 */
const emit = defineEmits(['update:selectedShip', 'select'])

/**
 * Handle ship selection
 * @param {string} shipValue - Selected ship value
 */
const handleSelect = (shipValue) => {
  emit('update:selectedShip', shipValue)
  emit('select', shipValue)
}
</script>
