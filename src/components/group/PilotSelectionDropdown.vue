/**
 * PilotSelectionDropdown Component
 * 
 * Dropdown interface for selecting which pilots to include in average rank calculation
 */
<template>
  <div class="dropdown dropdown-end">
    <div 
      tabindex="0" 
      role="button"
      class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center"
    >
      {{ selectedCount }} of {{ pilots.length }} pilots
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 20 20" 
        fill="none"
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="lucide lucide-chevron-down"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <div 
      tabindex="0"
      class="dropdown-content z-10 h-[40vh] overflow-auto p-2 rounded-box shadow-md text-xs text-white bg-neutral-950 flex flex-col gap-1 w-80"
    >
      <div class="text-sm cursor-default text-white mb-2 px-2">
        Include in Average Rank Calculation:
      </div>
      
      <PilotCheckboxItem
        v-for="pilot in pilots"
        :key="pilot.id"
        :pilot="pilot"
        :is-selected="selectedPilotIds.includes(pilot.id)"
        @toggle="$emit('toggle-pilot', pilot.id)"
      />
      
      <DropdownActions
        :selected-count="selectedCount"
        @select-all="$emit('select-all')"
        @clear-all="$emit('clear-all')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PilotCheckboxItem from './PilotCheckboxItem.vue'
import DropdownActions from './DropdownActions.vue'

/**
 * Component props
 */
const props = defineProps({
  /** Array of all pilots */
  pilots: {
    type: Array,
    required: true
  },
  /** Array of selected pilot IDs */
  selectedPilotIds: {
    type: Array,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['toggle-pilot', 'select-all', 'clear-all'])

/**
 * Number of selected pilots
 */
const selectedCount = computed(() => props.selectedPilotIds.length)
</script>
