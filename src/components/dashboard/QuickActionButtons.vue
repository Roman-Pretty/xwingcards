/**
 * QuickActionButtons Component
 * 
 * Floating action buttons for navigation (Pilot Overview, Group Overview, Settings)
 */
<template>
  <div>
    <!-- Pilot Overview Button -->
    <div class="tooltip absolute z-50" :class="buttonPositionClasses.pilot" data-tip="Pilot Overview">
      <div 
        class="btn btn-square shadow shadow-black"
        :class="isMobile ? 'btn-sm' : ''"
        @click="$emit('navigate', '/pilot-overview')"
      >
        <span class="font-[xwing] text-2xl font-light pb-1.5">x</span>
      </div>
    </div>

    <!-- Group Overview Button -->
    <div class="tooltip absolute z-50" :class="buttonPositionClasses.group" data-tip="Group Overview">
      <div 
        class="btn btn-square shadow shadow-black"
        :class="isMobile ? 'btn-sm' : ''"
        @click="$emit('navigate', '/group-overview')"
      >
        <span class="font-[xwing] text-2xl font-light pb-1.5">!</span>
      </div>
    </div>

    <!-- Settings Button -->
    <div class="tooltip absolute z-50" :class="buttonPositionClasses.settings" data-tip="Settings">
      <div 
        class="btn btn-square shadow shadow-black"
        :class="isMobile ? 'btn-sm' : ''"
        @click="$emit('navigate', '/settings')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" :width="isMobile ? 20 : 24" :height="isMobile ? 20 : 24" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Whether in mobile mode */
  isMobile: {
    type: Boolean,
    default: false
  }
})

/**
 * Component events
 */
defineEmits(['navigate'])

/**
 * Button position classes based on mobile/desktop mode
 */
const buttonPositionClasses = computed(() => {
  if (props.isMobile) {
    return {
      pilot: 'bottom-20 right-28',
      group: 'bottom-20 right-16', 
      settings: 'bottom-20 right-4'
    }
  }
  return {
    pilot: 'bottom-4 right-28',
    group: 'bottom-4 right-16',
    settings: 'bottom-4 right-4'
  }
})
</script>
