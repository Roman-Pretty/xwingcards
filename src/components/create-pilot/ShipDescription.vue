/**
 * ShipDescription Component
 * 
 * Displays ship description in a styled container
 */
<template>
  <div class="text-sm text-gray-300 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
    <p class="leading-relaxed">{{ description }}</p>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Description text to display */
  description: {
    type: String,
    required: true
  }
})
</script>
