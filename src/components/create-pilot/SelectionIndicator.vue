/**
 * SelectionIndicator Component
 * 
 * Reusable selection indicator (checkmark or empty circle)
 */
<template>
  <div 
    v-if="isSelected" 
    class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  </div>
  <div 
    v-else 
    class="w-6 h-6 border-2 border-gray-400 rounded-full group-hover:border-gray-300 transition-colors"
  ></div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Whether the item is selected */
  isSelected: {
    type: Boolean,
    default: false
  }
})
</script>
