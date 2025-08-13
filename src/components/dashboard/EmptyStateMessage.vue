/**
 * EmptyStateMessage Component
 * 
 * Displays appropriate messages when no cards are available
 */
<template>
  <div class="text-white text-center opacity-70 font-medium flex items-center justify-center w-full h-full"
    :class="{
      'text-sm': isMobile,
      'text-lg': !isMobile
    }"
  >
    <div v-if="hasFilters">
      No {{ getTabDescription }} match your current filters.<br />
      <button @click="$emit('clear-filters')" class="btn btn-sm btn-outline mt-2">
        Clear Filters
      </button>
    </div>
    <div v-else v-html="getEmptyMessage">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Current active tab */
  activeTab: {
    type: String,
    required: true
  },
  /** Whether filters are applied */
  hasFilters: {
    type: Boolean,
    required: true
  },
  /** Whether in mobile mode */
  isMobile: {
    type: Boolean,
    default: false
  }
})

/**
 * Component events
 */
defineEmits(['clear-filters'])

/**
 * Get description of current tab for filtered state
 */
const getTabDescription = computed(() => {
  switch (props.activeTab) {
    case 'hand':
      return 'equipped cards'
    case 'deck': 
      return 'cards in your deck'
    case 'store':
      return 'cards in the store'
    default:
      return 'cards'
  }
})

/**
 * Get empty state message based on current tab
 */
const getEmptyMessage = computed(() => {
  switch (props.activeTab) {
    case 'hand':
      return `You have no equipped cards. You can equip cards from your deck or purchase new ones from the store.${props.isMobile ? '<br /><br />Tap cards in your deck to equip them.' : '<br /><br />Drag cards from your deck to their respective slots on the left side of the screen to equip them.'}`
    case 'deck':
      return 'Purchase cards from the store to add them to your deck.'
    case 'store':
      return 'No cards available in the store.'
    default:
      return 'No cards available.'
  }
})
</script>
