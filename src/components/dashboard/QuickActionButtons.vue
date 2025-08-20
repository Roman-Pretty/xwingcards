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
    <div class="tooltip absolute z-50" :class="buttonPositionClasses.settings" data-tip="Menu">
      <div 
        class="btn btn-square shadow shadow-black"
        :class="isMobile ? 'btn-sm' : ''"
        @click="$emit('navigate', '/menu')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" :width="isMobile ? 20 : 24" :height="isMobile ? 20 : 24" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>
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
