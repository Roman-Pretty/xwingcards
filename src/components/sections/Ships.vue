<template>
  <div>
    <!-- Ships list -->
    <div class="flex flex-row gap-4 flex-wrap mb-4 max-w-full">
      <div v-for="ship in ships" :key="ship.ship"
        :class="[
          'flex flex-col items-center gap-2 p-3 rounded min-w-1/5 cursor-pointer transition-transform duration-300',
          isMobile ? 'w-[calc(50%-0.5rem)]' : 'flex-1',
          {
            'bg-yellow-700 border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)] hover:cursor-auto': getShipStatus(ship) === 'selected',
            'bg-yellow-800 hover:scale-105 cursor-pointer': getShipStatus(ship) === 'owned',
            'hover:bg-yellow-700 hover:scale-105 bg-neutral-800 cursor-pointer': getShipStatus(ship) === 'available',
            'bg-neutral-800 opacity-40 pointer-events-none cursor-default': getShipStatus(ship) === 'locked',
          }
        ]" @click="onShipClick(ship)">
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

        <div v-if="ship.lockedSlots?.length" class="flex flex-col items-center">
          <div class="flex items-center justify-center gap-1 flex-wrap">
            <span v-for="(lockedSlot, index) in ship.lockedSlots" :key="lockedSlot.slot + '-locked-' + index"
              class="font-[xwing] text-md font-extralight -mt-1"
              :class="{ 'opacity-40': !isLockedSlotPurchased(ship.ship, index) }">
              {{ lockedSlot.slot }}
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

    <!-- Modal Component -->
    <ShipPurchaseModal
      ref="shipPurchaseModal"
      :ship="pendingShip"
      @confirm="confirmPurchase"
      @cancel="cancelPurchase"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePilotStore } from '../../stores/PilotStore'
import { storeToRefs } from 'pinia'
import classData from '../../data/classes.json'
import ShipPurchaseModal from '../modals/ShipPurchaseModal.vue'

const pilotStore = usePilotStore()
const { currentPilot } = storeToRefs(pilotStore)

// Mobile detection
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Component refs
const shipPurchaseModal = ref(null)

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

function isLockedSlotPurchased(shipName, slotIndex) {
  const pilot = currentPilot.value
  if (!pilot || !pilot.unlockedSlots) return false
  const key = `${shipName}-${slotIndex}`
  return pilot.unlockedSlots.includes(key)
}

function onShipClick(ship) {
  const pilot = currentPilot.value
  if (!pilot) return

  const status = getShipStatus(ship)
  if (status === 'locked') return

  if (status === 'available') {
    // Open confirmation modal before buying
    pendingShip.value = ship
    shipPurchaseModal.value?.open()
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

  pendingShip.value = null
}

// Cancel purchase logic
function cancelPurchase() {
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
