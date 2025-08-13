/**
 * ClassCard Component
 * 
 * Individual class selection card with background image, description, and ship preview
 */
<template>
  <div 
    class="relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden"
    :class="{
      'ring-2 ring-opacity-100': isSelected,
      'hover:scale-[1.01]': !isSelected
    }"
    :style="{
      ringColor: isSelected ? classInfo.color : 'transparent'
    }"
    @click="$emit('select', classKey)"
  >
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{
        backgroundImage: `url(${classInfo.image || '/fallback-image.png'})`
      }"
    ></div>
    
    <!-- Background overlays -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
    
    <!-- Selection overlay -->
    <div 
      v-if="isSelected" 
      class="absolute inset-0 transition-all duration-300"
      :style="{
        backgroundColor: classInfo.color + '20',
        boxShadow: `inset 0 0 0 2px ${classInfo.color}`
      }"
    ></div>

    <div 
      class="relative bg-neutral-700/0 border-2 transition-all duration-300 rounded-lg h-full"
      :class="{
        'border-opacity-100': isSelected,
        'border-neutral-600/50 group-hover:border-gray-400/50': !isSelected
      }"
      :style="{
        borderColor: isSelected ? classInfo.color : ''
      }"
    >
      <div class="p-6 h-full flex flex-col">
        <ClassHeader 
          :class-info="classInfo"
          :class-key="classKey"
          :is-selected="isSelected"
        />
        
        <ShipPreview 
          :ships="classInfo.ships"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ClassHeader from './ClassHeader.vue'
import ShipPreview from './ShipPreview.vue'

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

/**
 * Component events
 */
defineEmits(['select'])
</script>
