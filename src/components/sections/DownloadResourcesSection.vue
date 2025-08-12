/**
 * DownloadResourcesSection.vue
 * 
 * A component for displaying downloadable resources including core game files,
 * expansions, and additional resources with proper categorization.
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
        class="lucide lucide-folder-down text-accent"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
        <path d="M12 10v6"/>
        <path d="m15 13-3 3-3-3"/>
      </svg>
      Download Resources
    </h2>
    
    <div class="space-y-4">
      <ResourceCategory 
        title="Core Game Files" 
        :resources="coreGameResources" 
      />
      
      <ResourceCategory 
        title="Ground Assault Expansion" 
        :resources="groundAssaultResources" 
      />
      
      <ResourceCategory 
        title="Additional Resources" 
        :resources="additionalResources"
        :show-info-note="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceCategory from './ResourceCategory.vue'

/**
 * Resource item interface
 */
interface Resource {
  /** Display name of the resource */
  name: string
  /** Download URL */
  url: string
  /** Button style class */
  buttonClass: string
}

/**
 * Core game files resources
 */
const coreGameResources: Resource[] = [
  {
    name: 'Mission Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1fRB5fA6imKSRvGlBJs6g6ZitwNFDYsS_&export=download',
    buttonClass: 'btn-accent'
  },
  {
    name: 'Rule Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1larIT35yMnbcNETOTXlNeQ-xB15ni3j3&export=download',
    buttonClass: 'btn-accent'
  }
]

/**
 * Ground Assault expansion resources
 */
const groundAssaultResources: Resource[] = [
  {
    name: 'Ground Assault Rule Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1H_drZpu8q7v6KH_FE6TRkgUt5FjeRzwx&export=download',
    buttonClass: 'btn-accent'
  },
  {
    name: 'Ground Assault Mission Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1hiC-KuGXOY1a52RJhQO-LMOC1JKaeiyV&export=download',
    buttonClass: 'btn-accent'
  }
]

/**
 * Additional resources
 */
const additionalResources: Resource[] = [
  {
    name: 'Game Components Guide',
    url: 'https://www.goonhammer.com/heroes-of-the-aturi-cluster-everything-you-need-to-know-about-x-wings-fan-made-co-op-campaign/',
    buttonClass: 'btn-info'
  }
]
</script>
