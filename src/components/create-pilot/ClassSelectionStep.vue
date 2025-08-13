/**
 * ClassSelectionStep Component
 * 
 * Second step of pilot creation - class selection with visual cards
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
    <StepHeader step-number="2" title="Choose Your Path" />
    
    <div class="ml-11 space-y-4">
      <p class="text-gray-400 text-sm">
        Select a pilot class that defines your abilities and available ships.
      </p>
      
      <div class="grid gap-4">
        <ClassCard
          v-for="(classInfo, key) in classes"
          :key="key"
          :class-key="key"
          :class-info="classInfo"
          :is-selected="selectedClass === key"
          @select="handleSelect"
        />
      </div>
      
      <ValidationMessage :error="error" :success="selectedClass && !error" success-text="✓ Class selected!" />
    </div>
  </div>
</template>

<script setup>
import StepHeader from './StepHeader.vue'
import ClassCard from './ClassCard.vue'
import ValidationMessage from './ValidationMessage.vue'

/**
 * Component props
 */
const props = defineProps({
  /** Available pilot classes */
  classes: {
    type: Object,
    required: true
  },
  /** Currently selected class */
  selectedClass: {
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
const emit = defineEmits(['update:selectedClass', 'select'])

/**
 * Handle class selection
 * @param {string} classKey - Selected class key
 */
const handleSelect = (classKey) => {
  emit('update:selectedClass', classKey)
  emit('select', classKey)
}
</script>
