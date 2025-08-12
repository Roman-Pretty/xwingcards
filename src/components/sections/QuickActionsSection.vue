/**
 * QuickActionsSection.vue
 * 
 * Component for quick action buttons including pilot creation, data management, and reset.
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
    <h2 class="text-xl font-semibold text-white mb-4">Quick Actions</h2>
    
    <div class="space-y-3">
      <button 
        class="btn btn-primary w-full justify-start" 
        @click="$emit('create-pilot')"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="lucide lucide-user-plus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Create New Pilot
      </button>
      
      <button 
        class="btn btn-secondary w-full justify-start" 
        @click="$emit('export-data')"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="lucide lucide-download"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export Data
      </button>
      
      <button 
        class="btn btn-secondary w-full justify-start" 
        @click="$emit('import-data')"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="lucide lucide-upload"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17,8 12,3 7,8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Import Data
      </button>
      
      <button 
        class="btn btn-error w-full justify-start" 
        @click="$emit('reset-all')"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="lucide lucide-trash-2"
        >
          <polyline points="3,6 5,6 21,6"/>
          <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        Reset All Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Component events interface
 */
interface Emits {
  /** Emitted when create pilot button is clicked */
  (e: 'create-pilot'): void
  /** Emitted when export data button is clicked */
  (e: 'export-data'): void
  /** Emitted when import data button is clicked */
  (e: 'import-data'): void
  /** Emitted when reset all button is clicked */
  (e: 'reset-all'): void
}

defineEmits<Emits>()
</script>
