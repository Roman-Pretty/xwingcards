/**
 * ValidationMessage Component
 * 
 * Displays error or success validation messages
 */
<template>
  <div v-if="error" class="text-red-400 text-sm mt-1">
    {{ error }}
  </div>
  <div v-else-if="success" class="text-green-400 text-sm mt-1">
    {{ successText }}
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Error message to display */
  error: {
    type: String,
    default: ''
  },
  /** Whether to show success state */
  success: {
    type: Boolean,
    default: false
  },
  /** Success message text */
  successText: {
    type: String,
    default: '✓ Valid'
  }
})
</script>
