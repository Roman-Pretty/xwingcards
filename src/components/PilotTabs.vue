<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn w-[6vw] m-1">
      {{ selectedPilotName }} 
    </div>

    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-md">
      <li v-for="pilot in pilotStore.pilots" :key="pilot.id">
        <a @click="pilotStore.switchPilot(pilot.id)" :class="{
          'font-bold text-yellow-400': pilot.id === pilotStore.currentPilotId
        }">
          {{ pilot.name }}
        </a>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { usePilotStore } from '../stores/pilotStore'

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
