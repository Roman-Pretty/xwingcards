/**
 * PilotHeader Component
 * 
 * Displays pilot class, XP, force count, and action buttons
 */
<template>
  <div class="flex flex-row justify-between w-full items-center">
    <div class="flex flex-row gap-4">
      <!-- Pilot Class -->
      <div class="text-xl flex flex-row gap-2 items-center cursor-default">
        <span class="font-[xwing] text-3xl -mt-2" :style="{ color: classColor }">{{ classIcon }}</span>
        <span class="font-bold" :style="{ color: classColor }">The {{ pilotClass }}</span>
      </div>

      <!-- XP Display -->
      <div class="text-xl flex flex-row items-center cursor-default text-yellow-300">
        <span class="font-[xwing] text-3xl -mt-2">Ì</span>
        <span class="font-bold">{{ pilotXp }}</span>
      </div>

      <!-- Force Count (if applicable) -->
      <div v-if="showBaseForce" class="text-xl flex flex-row items-center cursor-default text-force gap-1">
        <span class="font-[xwing] text-xl -mt-1">h</span>
        <span class="font-bold">1</span>
      </div>

      <div v-if="showForceCount" class="text-xl flex flex-row items-center cursor-default text-force gap-1">
        <span class="font-[xwing] text-xl -mt-1">h`</span>
        <span class="font-bold">{{ forceCount }}</span>
      </div>
    </div>

    <div class="flex flex-row-reverse gap-2 items-center">
      <button class="btn" @click="$emit('add-xp')">Add XP</button>
      <PilotTabs @add-pilot="$emit('add-pilot')" />
    </div>
  </div>
</template>

<script setup>
import PilotTabs from '../pilots/PilotTabs.vue'

/**
 * Component props
 */
defineProps({
  /** Pilot class name */
  pilotClass: {
    type: String,
    required: true
  },
  /** Pilot class icon */
  classIcon: {
    type: String,
    required: true
  },
  /** Pilot class color */
  classColor: {
    type: String,
    required: true
  },
  /** Current pilot XP */
  pilotXp: {
    type: Number,
    required: true
  },
  /** Force count from equipped cards */
  forceCount: {
    type: Number,
    default: 0
  },
  /** Whether to show base force for Force Users */
  showBaseForce: {
    type: Boolean,
    default: false
  },
  /** Whether to show force count display */
  showForceCount: {
    type: Boolean,
    default: false
  }
})

/**
 * Component events
 */
defineEmits(['add-xp', 'add-pilot'])
</script>
