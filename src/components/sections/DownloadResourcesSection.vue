/**
 * DownloadResourcesSection.vue
 * 
 * A component for displaying downloadable resources including core game files,
 * expansions, and additional resources with proper categorization.
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
      Download Resources
    </h2>
    <div class="space-y-4">
      <ResourceCategory 
        title="Core Game Files" 
        :resources="coreGameResources" 
      />

      <div class="divider"></div>
      
      <ResourceCategory 
        title="Ground Assault Expansion" 
        :resources="groundAssaultResources" 
      />

      <div class="divider"></div>
      
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
    buttonClass: ''
  },
  {
    name: 'Rule Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1larIT35yMnbcNETOTXlNeQ-xB15ni3j3&export=download',
    buttonClass: ''
  }
]

/**
 * Ground Assault expansion resources
 */
const groundAssaultResources: Resource[] = [
  {
    name: 'Ground Assault Rule Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1H_drZpu8q7v6KH_FE6TRkgUt5FjeRzwx&export=download',
    buttonClass: ''
  },
  {
    name: 'Ground Assault Mission Book',
    url: 'https://drive.usercontent.google.com/u/0/uc?id=1hiC-KuGXOY1a52RJhQO-LMOC1JKaeiyV&export=download',
    buttonClass: ''
  }
]

/**
 * Additional resources
 */
const additionalResources: Resource[] = [
  {
    name: 'Game Components Guide',
    url: 'https://www.goonhammer.com/heroes-of-the-aturi-cluster-everything-you-need-to-know-about-x-wings-fan-made-co-op-campaign/',
    buttonClass: ''
  }
]
</script>
