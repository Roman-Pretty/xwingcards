/**
 * ResourceCategory.vue
 * 
 * A reusable component for displaying a category of downloadable resources.
 */
<template>
  <div class="space-y-3">
    <h3 class="text-sm font-medium text-gray-300 uppercase tracking-wide">
      {{ title }}
    </h3>
    
    <div class="space-y-2">
      <a 
        v-for="resource in resources"
        :key="resource.name"
        :href="resource.url"
        target="_blank"
        :class="[
          'btn w-full justify-start hover:scale-[1.02] transition-transform duration-200',
          resource.buttonClass
        ]"
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
          :class="getIconClass(resource.buttonClass)"
        >
          <template v-if="isExternalLink(resource.url)">
            <path d="M15 3h6v6"/>
            <path d="M10 14 21 3"/>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          </template>
          <template v-else>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </template>
        </svg>
        {{ resource.name }}
      </a>

      <!-- Special info note for core game files -->
      <div 
        v-if="showInfoNote && title === 'Core Game Files'"
        class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"
      >
        <p class="text-xs text-amber-200 flex items-start gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="lucide lucide-info mt-0.5 flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          <span>
            <strong>Note:</strong> Ignore pages 8 and 9 on spending XP and character creation 
            as X-Wing Unlimited replaces them.<br/><br/>
            Enemy spawn levels may instead be based on Average Rank, not Average Initiative.
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
 * Component props interface
 */
interface Props {
  /** Category title */
  title: string
  /** Array of resources in this category */
  resources: Resource[]
  /** Whether to show the info note (defaults to true for core game files) */
  showInfoNote?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showInfoNote: true
})

/**
 * Determine if URL is external (not a direct download)
 * @param url - The URL to check
 * @returns True if external link, false if direct download
 */
function isExternalLink(url: string): boolean {
  return !url.includes('drive.usercontent.google.com')
}

/**
 * Get appropriate icon class based on button class
 * @param buttonClass - The button CSS class
 * @returns Icon class string
 */
function getIconClass(buttonClass: string): string {
  return buttonClass === 'btn-info' ? 'lucide lucide-external-link' : 'lucide lucide-download'
}
</script>
