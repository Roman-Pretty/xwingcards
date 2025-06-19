<template>
  <div>
    <!-- Ships list -->
    <div class="flex flex-row gap-4 flex-wrap mb-4 max-w-full overflow-x-clip">
      <div v-for="ship in ships" :key="ship.ship"
        class="flex flex-col items-center gap-2 p-3 rounded flex-1 cursor-pointer transition-transform duration-300"
        :class="{
          'bg-yellow-700 border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)] hover:cursor-auto': getShipStatus(ship) === 'selected',
          'bg-yellow-800 hover:scale-105 cursor-pointer': getShipStatus(ship) === 'owned',
          'hover:bg-yellow-700 hover:scale-105 bg-neutral-800 cursor-pointer': getShipStatus(ship) === 'available',
          'bg-neutral-800 opacity-40 pointer-events-none cursor-default': getShipStatus(ship) === 'locked',
        }" @click="onShipClick(ship)">
        <span class="font-[ships] text-3xl">{{ ship.icon }}</span>
        <span class="text-sm -mt-2 border-b-2 w-full text-center pb-2 mb-1 border-b-white/20">
          {{ ship.ship }}
        </span>

        <div class="flex items-center justify-evenly w-full flex-wrap">
          <span v-for="slot in ship.slots" :key="slot" class="font-[xwing] text-md font-extralight -mt-1">
            {{ slot }}
          </span>
        </div>

        <div v-if="ship.optionalSlots?.length" class="flex flex-col items-center">
          <div v-for="(group, gIndex) in normalizeOptionalSlots(ship.optionalSlots)" :key="'group-' + gIndex"
            class="flex items-center justify-center gap-1 flex-wrap">
            <span v-for="(slot, index) in group" :key="slot + '-' + index"
              class="font-[xwing] text-md font-extralight -mt-1">
              <span class="inria-sans-light text-xs" v-if="index !== 0">/</span>
              {{ slot }}
            </span>
          </div>
        </div>

        <div class="mt-auto text-sm text-white/80">
          <span v-if="getShipStatus(ship) === 'locked'">Locked</span>
          <span v-else-if="getShipStatus(ship) === 'owned'">Owned</span>
          <span v-else-if="getShipStatus(ship) === 'selected'" class="text-yellow-400">Selected</span>
          <span v-else><span class="font-[xwing] text-lg ">Ì</span>{{ ship.cost }}</span>
        </div>
      </div>
    </div>

    <!-- Confirm Purchase Modal -->
    <dialog id="confirm_purchase_modal" class="modal">
      <div class="modal-box bg-neutral-800 text-white">
        <h3 class="text-lg font-bold mb-2">
          Confirm Purchase
        </h3>
        <p class="mb-4">
          Are you sure you want to buy <strong>{{ pendingShip?.ship }}</strong> for
          <span class="font-[xwing] text-lg">Ì</span>{{ pendingShip?.cost }}?
        </p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button type="button" class="btn" @click="confirmPurchase">Confirm</button>
            <button class="btn btn-neutral" @click="cancelPurchase">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePilotStore } from '../stores/pilotStore'
import { storeToRefs } from 'pinia'
import classData from '../data/classes.json'

const pilotStore = usePilotStore()
const { currentPilot } = storeToRefs(pilotStore)

const ships = computed(() => {
  return classData[pilotStore.currentPilot?.class]?.ships || []
})

// State to hold the ship pending purchase
const pendingShip = ref(null)

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

  if (status === 'available') {
    // Open confirmation modal before buying
    pendingShip.value = ship
    const modal = document.getElementById('confirm_purchase_modal')
    if (modal?.showModal) {
      modal.showModal()
      document.body.style.overflow = 'hidden'
    }
    return
  }

  if (status !== 'selected') {
    pilotStore.changeSelectedShip(ship.ship)
  }
}

function confirmPurchase() {
  if (!pendingShip.value) return
  const pilot = currentPilot.value
  if (!pilot) return

  // Deduct XP cost (assumed logic)
  if (pilot.xp >= pendingShip.value.cost) {
    pilot.xp -= pendingShip.value.cost
    pilot.ships.push(pendingShip.value.ship)

    pilotStore.changeSelectedShip(pendingShip.value.ship)
  } else {
    alert('Not enough XP to buy this ship.')
  }

  closeModal()
}

// Cancel purchase logic
function cancelPurchase() {
  closeModal()
}

// Helper to close modal and reset states
function closeModal() {
  const modal = document.getElementById('confirm_purchase_modal')
  if (modal?.close) {
    modal.close()
    document.body.style.overflow = ''
  }
  pendingShip.value = null
}

function normalizeOptionalSlots(optionals) {
  if (!optionals) return [];
  if (!Array.isArray(optionals[0])) {
    return [optionals];
  }
  return optionals;
}
</script>
