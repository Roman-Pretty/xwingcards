/**
 * PilotOverviewHeader.vue
 * 
 * Header component for the pilot overview page with navigation and title information.
 */
<template>
  <div class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-6">
    <div class="max-w-4xl px-6 mx-auto flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">{{ title }}</h1>
        <p class="text-gray-400">{{ description }}</p>
      </div>
      <button 
        class="btn btn-ghost text-white" 
        @click="$emit('close')"
        aria-label="Close pilot overview"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="lucide lucide-x"
        >
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Component props interface
 */
interface Props {
  /** Page title */
  title?: string
  /** Page description */
  description?: string
}

/**
 * Component events interface
 */
interface Emits {
  /** Emitted when close button is clicked */
  (e: 'close'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Pilot Overview',
  description: 'Track your pilot\'s ship kill statistics and milestones'
})

defineEmits<Emits>()
</script>
