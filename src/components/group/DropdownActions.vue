/**
 * DropdownActions Component
 * 
 * Action buttons for dropdown with select all and clear functionality
 */
<template>
  <div class="flex justify-between items-center mt-2 pt-2 border-t border-neutral-700 px-2">
    <div class="text-xs text-gray-400 cursor-default">
      {{ selectedCount }} selected
    </div>
    <div class="flex gap-1">
      <button 
        @click="$emit('select-all')" 
        class="btn btn-xs btn-ghost text-gray-400 hover:text-white"
      >
        All
      </button>
      <button 
        @click="$emit('clear-all')" 
        class="btn btn-xs btn-ghost text-gray-400 hover:text-white"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Number of selected items */
  selectedCount: {
    type: Number,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['select-all', 'clear-all'])
</script>
