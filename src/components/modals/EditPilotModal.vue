<template>
  <SettingsModal
    :isOpen="isOpen"
    title="Edit Pilot"
    @close="close"
  >
    <div v-if="pilot" class="space-y-6">
      <!-- Basic Info -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Pilot Name</label>
          <input
            v-model="editedPilot.name"
            type="text"
            class="input input-bordered w-full bg-neutral-700 text-white"
            placeholder="Enter pilot name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Experience Points</label>
          <input
            v-model.number="editedPilot.xp"
            type="number"
            min="0"
            class="input input-bordered w-full bg-neutral-700 text-white"
            placeholder="0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Rank</label>
          <select
            v-model.number="editedPilot.rank"
            class="select select-bordered w-full bg-neutral-700 text-white"
          >
            <option v-for="rank in availableRanks" :key="rank" :value="rank">
              Rank {{ rank }}
            </option>
          </select>
        </div>
      </div>

      <!-- Advanced Management -->
      <div class="border-t border-neutral-600 pt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">Advanced Management</h3>
          <button
            @click="showAdvanced = !showAdvanced"
            class="btn btn-sm btn-ghost text-gray-400"
          >
            {{ showAdvanced ? 'Hide' : 'Show' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['lucide lucide-chevron-down transition-transform', showAdvanced ? 'rotate-180' : '']">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>

        <div v-show="showAdvanced" class="space-y-4">
          <!-- Owned Cards Management -->
          <div v-if="editedPilot.ownedCards?.length > 0">
            <label class="block text-sm font-medium text-gray-300 mb-2">Owned Cards</label>
            <div class="max-h-40 overflow-y-auto bg-neutral-700 rounded border p-3 space-y-2">
              <div
                v-for="cardId in editedPilot.ownedCards"
                :key="cardId"
                class="flex justify-between items-center text-sm"
              >
                <div class="flex items-center gap-2">
                  <span class="text-white">{{ getCardName(cardId) }}</span>
                  <span v-if="getCardUpgradeLevel(cardId) > 0" class="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Lv{{ getCardUpgradeLevel(cardId) }}
                  </span>
                </div>
                <div class="flex gap-1">
                  <button
                    v-if="getCardUpgradeLevel(cardId) > 0"
                    @click="downgradeCard(cardId)"
                    class="btn btn-xs btn-warning"
                    title="Downgrade"
                  >
                    ↓
                  </button>
                  <button
                    @click="removeCard(cardId)"
                    class="btn btn-xs btn-error"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Ships Management -->
          <div v-if="editedPilot.ships?.length > 0">
            <label class="block text-sm font-medium text-gray-300 mb-2">Owned Ships</label>
            <div class="max-h-32 overflow-y-auto bg-neutral-700 rounded border p-3 space-y-2">
              <div
                v-for="ship in editedPilot.ships"
                :key="ship"
                class="flex justify-between items-center text-sm"
              >
                <span class="text-white">{{ ship }}</span>
                <button
                  @click="removeShip(ship)"
                  class="btn btn-xs btn-error"
                  title="Remove"
                  :disabled="editedPilot.ships.length <= 1"
                >
                  ×
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-1">Note: Cannot remove the last ship</p>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <button @click="close" class="btn btn-ghost">Cancel</button>
      <button @click="save" class="btn btn-primary" :disabled="!isValidPilot">Save Changes</button>
    </template>
  </SettingsModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SettingsModal from './SettingsModal.vue'
import cards from '../../data/cards.js'
import classData from '../../data/classes.json'

const props = defineProps({
  pilot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)
const showAdvanced = ref(false)
const editedPilot = ref({})

// Watch for pilot changes and reset the edited pilot
watch(() => props.pilot, (newPilot) => {
  if (newPilot) {
    editedPilot.value = {
      ...newPilot,
      xp: newPilot.xp || 0,
      rank: newPilot.rank || 1,
      ownedCards: [...(newPilot.ownedCards || [])],
      ships: [...(newPilot.ships || [])],
      cardUpgrades: { ...(newPilot.cardUpgrades || {}) }
    }
  }
}, { immediate: true })

const availableRanks = computed(() => {
  if (!props.pilot?.class) return [1]
  const classInfo = classData[props.pilot.class]
  if (!classInfo?.ranks) return [1]
  return classInfo.ranks.map(r => r.rank).sort((a, b) => a - b)
})

const isValidPilot = computed(() => {
  return editedPilot.value.name && 
         editedPilot.value.name.trim().length > 0 &&
         editedPilot.value.xp >= 0 &&
         availableRanks.value.includes(editedPilot.value.rank)
})

function getCardName(cardId) {
  const card = cards.find(c => c.id === cardId)
  return card?.name || 'Unknown Card'
}

function getCardUpgradeLevel(cardId) {
  return editedPilot.value.cardUpgrades?.[cardId] || 0
}

function removeCard(cardId) {
  // Remove from owned cards
  editedPilot.value.ownedCards = editedPilot.value.ownedCards.filter(id => id !== cardId)
  
  // Remove upgrade data
  if (editedPilot.value.cardUpgrades?.[cardId]) {
    delete editedPilot.value.cardUpgrades[cardId]
  }
  
  // Remove from slot cards if equipped
  if (editedPilot.value.slotCards) {
    Object.keys(editedPilot.value.slotCards).forEach(slotKey => {
      if (editedPilot.value.slotCards[slotKey] === cardId) {
        delete editedPilot.value.slotCards[slotKey]
      }
    })
  }
  
  // Remove from selected cards if present
  if (editedPilot.value.selectedCards) {
    editedPilot.value.selectedCards = editedPilot.value.selectedCards.filter(id => id !== cardId)
  }
}

function downgradeCard(cardId) {
  if (!editedPilot.value.cardUpgrades) {
    editedPilot.value.cardUpgrades = {}
  }
  
  const currentLevel = editedPilot.value.cardUpgrades[cardId] || 0
  if (currentLevel > 0) {
    editedPilot.value.cardUpgrades[cardId] = currentLevel - 1
    
    // If downgraded to 0, remove the upgrade entry
    if (editedPilot.value.cardUpgrades[cardId] === 0) {
      delete editedPilot.value.cardUpgrades[cardId]
    }
  }
}

function removeShip(shipName) {
  if (editedPilot.value.ships.length <= 1) return // Don't allow removing the last ship
  
  editedPilot.value.ships = editedPilot.value.ships.filter(s => s !== shipName)
  
  // If the removed ship was the selected ship, select the first remaining ship
  if (editedPilot.value.selectedShip === shipName) {
    editedPilot.value.selectedShip = editedPilot.value.ships[0] || ''
  }
}

function open() {
  isOpen.value = true
  showAdvanced.value = false
}

function close() {
  isOpen.value = false
  emit('cancel')
}

function save() {
  if (!isValidPilot.value) return
  
  emit('confirm', editedPilot.value)
  close()
}

defineExpose({
  open,
  close
})
</script>
