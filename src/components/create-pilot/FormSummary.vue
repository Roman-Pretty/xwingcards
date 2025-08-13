/**
 * FormSummary Component
 * 
 * Displays a summary of the current form selections
 */
<template>
  <div>
    <div class="text-sm text-gray-400 mb-2">Summary:</div>
    <div class="flex flex-wrap gap-4 text-sm">
      <span v-if="formData.name" class="text-white">
        <span class="text-gray-400">Name:</span> {{ formData.name }}
      </span>
      <span v-if="formData.pilotClass" class="text-white">
        <span class="text-gray-400">Class:</span> {{ formData.pilotClass }}
      </span>
      <span v-if="formData.startingShip" class="text-white">
        <span class="text-gray-400">Ship:</span> {{ formData.startingShip }}
      </span>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Form data object containing name, pilotClass, and startingShip */
  formData: {
    type: Object,
    required: true
  }
})
</script>
