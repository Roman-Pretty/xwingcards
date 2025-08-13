/**
 * StepHeader Component
 * 
 * Reusable header for form steps with number indicator and title
 */
<template>
  <div class="flex items-center gap-3 mb-4">
    <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
      {{ stepNumber }}
    </div>
    <h2 class="text-xl font-semibold text-white">{{ title }}</h2>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Step number to display */
  stepNumber: {
    type: [String, Number],
    required: true
  },
  /** Step title */
  title: {
    type: String,
    required: true
  }
})
</script>
