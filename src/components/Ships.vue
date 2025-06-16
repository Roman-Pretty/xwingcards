<template>
  <div class="flex flex-row gap-4 flex-wrap mb-4 max-w-full overflow-x-clip">
    <div
      v-for="ship in ships"
      :key="ship.ship"
      class="flex flex-col items-center gap-2 p-3 rounded flex-1 cursor-pointer transition-transform duration-300"
      :class="{
        'bg-yellow-700 border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)] hover:cursor-auto': getShipStatus(ship) === 'selected',
        'bg-yellow-800 hover:scale-105 cursor-pointer': getShipStatus(ship) === 'owned',
        'hover:bg-yellow-700 hover:scale-105 bg-neutral-800 cursor-pointer': getShipStatus(ship) === 'available',
        'bg-neutral-800 opacity-40 pointer-events-none cursor-default': getShipStatus(ship) === 'locked',
      }"
      @click="onShipClick(ship)"
    >
      <span class="font-[ships] text-3xl">{{ ship.icon }}</span>
      <span class="text-sm -mt-2 border-b-2 w-full text-center pb-2 mb-1 border-b-white/20">
        {{ ship.ship }}
      </span>

      <div class="flex items-center justify-evenly w-full flex-wrap">
        <span
          v-for="slot in ship.slots"
          :key="slot"
          class="font-[xwing] text-md font-extralight -mt-1"
        >
          {{ slot }}
        </span>
      </div>

      <div class="mt-auto text-sm text-white/80">
        <span v-if="getShipStatus(ship) === 'locked'">Locked</span>
        <span v-else-if="getShipStatus(ship) === 'owned'">Owned</span>
        <span v-else-if="getShipStatus(ship) === 'selected'" class="text-yellow-400">Selected</span>
        <span v-else>{{ ship.cost }} XP</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePilotStore } from '../stores/pilotStore'
import { storeToRefs } from 'pinia'
import classData from '../data/classes.json'
import { computed } from 'vue'

const pilotStore = usePilotStore()
const { currentPilot } = storeToRefs(pilotStore)

const ships = computed(() => {
  return classData[pilotStore.currentPilot?.class]?.ships || []
})

function getShipStatus(ship) {
  const pilot = currentPilot.value
  if (!pilot) return ''
  if (pilot.selectedShip && pilot.selectedShip === ship.ship) return 'selected'
  if (pilot.rank < ship.rank) return 'locked'
  if (pilot.ships.includes(ship.ship)) return 'owned'
  return 'available'
}

function onShipClick(ship) {
  const pilot = currentPilot.value
  if (!pilot) return

  const status = getShipStatus(ship)
  if (status === 'locked') return

  // buy this!
  if (status === 'available') return

  if (status !== 'selected') {
    // Update selected ship
    pilotStore.switchPilot(pilot.id) // Make sure current pilot is active
    pilot.selectedShip = ship.ship

    // Clear selected cards because slots changed
    pilot.selectedCards = []
  }
}
</script>
