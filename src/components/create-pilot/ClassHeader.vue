/**
 * ClassHeader Component
 * 
 * Header section of class card with icon, title, and selection indicator
 */
<template>
  <div class="flex items-center gap-4 mb-4">
    <div class="flex items-center gap-3 flex-1">
      <span 
        class="font-[xwing] text-4xl drop-shadow-lg" 
        :style="{ color: classInfo.color }"
      >
        {{ classInfo.icon }}
      </span>
      <div>
        <h3 class="text-2xl font-bold text-white drop-shadow-lg">
          The {{ classKey }}
        </h3>
        <p class="text-sm text-gray-200 drop-shadow">
          {{ classInfo.description || 'A skilled pilot ready for combat.' }}
        </p>
      </div>
    </div>
    
    <!-- Selection Indicator -->
    <div class="flex-shrink-0">
      <div 
        v-if="isSelected" 
        class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg" 
        :style="{ backgroundColor: classInfo.color }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
      <div v-else class="w-7 h-7 border-2 border-white/70 rounded-full shadow-lg"></div>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Class key identifier */
  classKey: {
    type: String,
    required: true
  },
  /** Class information object */
  classInfo: {
    type: Object,
    required: true
  },
  /** Whether this class is selected */
  isSelected: {
    type: Boolean,
    default: false
  }
})
</script>
