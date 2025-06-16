<template>
  <div
    :key="selectedOption"
    class="relative group transition-colors duration-200 rounded flex-1 bg-neutral-800 cursor-default"
    :class="{
      'bg-neutral-800': true
    }"
    tabindex="0"
    ref="slotRef"
  >
    <!-- Swap icon in top right -->
    <div
      v-if="hasMultipleOptions"
      class="absolute top-2 right-2 w-6 h-6 text-neutral-600 opacity-80 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none"
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
           class="lucide lucide-arrow-left-right-icon">
        <path d="M8 3 4 7l4 4"/>
        <path d="M4 7h16"/>
        <path d="m16 21 4-4-4-4"/>
        <path d="M20 17H4"/>
      </svg>
    </div>

    <!-- Overlay on hover -->
    <div
      v-if="hasMultipleOptions"
      class="absolute inset-0 bg-amber-700/80 cursor-pointer text-white text-center flex items-center justify-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-10"
    >
      Switch Slot
    </div>

    <!-- Slot content -->
    <div class="flex flex-row items-center gap-2 p-3 rounded relative z-0 h-full">
      <span class="font-[xwing] text-5xl font-extralight opacity-60 -mt-3.5">
        {{ mappedLetter }}
      </span>
      <div class="flex flex-col">
        <h2>{{ selectedOption }}</h2>
        <span class="text-sm text-white/80">{{ card || 'Empty' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { tokenToLetterMap } from '../utils/mappings';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  unlocked: {
    type: Boolean,
    required: true
  },
  card: {
    type: String,
    default: ''
  }
});

const selectedOption = ref(props.options[0] ?? '');

const hasMultipleOptions = computed(() => props.options.length > 1);

watch(
  () => props.options,
  (newOptions) => {
    if (!newOptions.includes(selectedOption.value)) {
      selectedOption.value = newOptions[0] ?? '';
    }
  },
  { immediate: true }
);

const mappedLetter = computed(() => {
  return tokenToLetterMap[selectedOption.value?.toLowerCase()] || '?';
});
</script>

<style scoped>
/* No changes needed */
</style>
