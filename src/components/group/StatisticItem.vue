/**
 * StatisticItem Component
 * 
 * Individual statistic display with value and label
 */
<template>
  <div>
    <div 
      class="font-bold"
      :class="[sizeClass, colorClass]"
    >
      {{ value }}
    </div>
    <div class="text-sm text-gray-400">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /** Statistic value to display */
  value: {
    type: [Number, String],
    required: true
  },
  /** Label for the statistic */
  label: {
    type: String,
    required: true
  },
  /** Color theme for the value */
  color: {
    type: String,
    default: 'white',
    validator: (value) => ['yellow', 'blue', 'green', 'red', 'white'].includes(value)
  },
  /** Size of the value text */
  size: {
    type: String,
    default: 'xl',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value)
  }
})

/**
 * CSS class for text size
 */
const sizeClass = computed(() => {
  const sizeMap = {
    'sm': 'text-sm',
    'md': 'text-md',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }
  return sizeMap[props.size] || 'text-xl'
})

/**
 * CSS class for text color
 */
const colorClass = computed(() => {
  const colorMap = {
    'yellow': 'text-yellow-400',
    'blue': 'text-blue-400',
    'green': 'text-green-400',
    'red': 'text-red-400',
    'white': 'text-white'
  }
  return colorMap[props.color] || 'text-white'
})
</script>
