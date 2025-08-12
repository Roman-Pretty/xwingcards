<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row justify-end">
      {{ selectedPilotName }}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-chevron-down-icon lucide-chevron-down">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-md">
      <li v-for="pilot in pilotStore.pilots" :key="pilot.id">
        <a
          @click="pilotStore.switchPilot(pilot.id)"
          :class="{'font-bold text-yellow-400': pilot.id === pilotStore.currentPilotId}"
        >
          {{ pilot.name }}
        </a>
      </li>
      <!-- Add Pilot option at the bottom -->
      <li>
        <a
          @click="$emit('add-pilot')"
          class="text-blue-400 hover:text-blue-600 cursor-pointer"
        >
          Add Pilot...
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePilotStore } from '../../stores/PilotStore'

const pilotStore = usePilotStore()

onMounted(() => {
  if (!pilotStore.currentPilotId && pilotStore.pilots.length > 0) {
    pilotStore.switchPilot(pilotStore.pilots[0].id)
  }
})

const selectedPilotName = computed(() => {
  const pilot = pilotStore.currentPilot
  return pilot ? pilot.name : 'Select Pilot'
})
</script>
