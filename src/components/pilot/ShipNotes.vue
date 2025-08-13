/**
 * ShipNotes Component
 * 
 * Displays additional notes and information about a ship
 */
<template>
  <div class="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
    <h3 class="text-lg font-semibold text-white mb-4">Notes</h3>
    <ul class="list-disc list-inside space-y-2 text-gray-300">
      <li v-for="note in notes" :key="note" class="text-sm">
        {{ note }}
      </li>
    </ul>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Array of note strings */
  notes: {
    type: Array,
    required: true
  }
})
</script>
