/**
 * MobileBottomTabs Component
 * 
 * Bottom navigation tabs for mobile layout
 */
<template>
  <div class="fixed bottom-0 left-0 right-0 z-40">
    <div role="tablist" class="tabs tabs-box w-full justify-center">
      <a 
        role="tab"
        @click="$emit('switch-tab', 'loadout')"
        :class="[
          'tab flex-1',
          activeTab === 'loadout' ? 'tab-active' : ''
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
          stroke-linejoin="round" class="lucide lucide-shield mr-2">
          <path d="M20 13c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6l8-3 8 3v7Z"/>
        </svg>
        Loadout
      </a>
      <a 
        role="tab"
        @click="$emit('switch-tab', 'cards')"
        :class="[
          'tab flex-1',
          activeTab === 'cards' ? 'tab-active' : ''
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
          stroke-linejoin="round" class="lucide lucide-layers mr-2">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
        </svg>
        Cards
      </a>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Currently active tab */
  activeTab: {
    type: String,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['switch-tab'])
</script>
