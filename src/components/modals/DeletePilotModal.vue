<template>
  <SettingsModal
    :isOpen="isOpen"
    title="Delete Pilot"
    @close="close"
  >
    <div v-if="pilot" class="space-y-4">
      <div class="flex items-center gap-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
        <div class="text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="m12 17 .01 0"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-red-400">Warning: This action cannot be undone</h3>
          <p class="text-gray-300">All pilot data will be permanently deleted.</p>
        </div>
      </div>

      <div class="bg-neutral-800 border border-neutral-600 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-4">
          <span class="font-[xwing] text-2xl -mt-1" :style="{ color: getPilotColor(pilot.class) }">{{ getPilotIcon(pilot.class) }}</span>
          <div>
            <h3 class="text-xl font-semibold text-white">{{ pilot.name }}</h3>
            <p class="text-gray-400">{{ pilot.class }} - Rank {{ pilot.rank }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2 text-yellow-300">
            <span class="font-[xwing] text-lg -mt-1">Ì</span>
            <span>{{ pilot.xp || 0 }} XP</span>
          </div>
          <div class="text-gray-300">
            {{ (pilot.ownedCards?.length || 0) }} Cards
          </div>
          <div class="text-gray-300">
            {{ (pilot.ships?.length || 0) }} Ships
          </div>
          <div class="text-gray-300">
            Current Ship: {{ pilot.selectedShip || 'None' }}
          </div>
        </div>
      </div>

      <p class="text-gray-300">
        Are you sure you want to delete <strong class="text-white">{{ pilot.name }}</strong>? 
        This will permanently remove:
      </p>

      <ul class="text-sm text-gray-400 space-y-1 ml-4">
        <li>• All pilot information and progress</li>
        <li>• All owned cards and upgrades</li>
        <li>• All ship configurations</li>
        <li>• All slot assignments and loadouts</li>
      </ul>

      <div class="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
        <p class="text-yellow-300 text-sm">
          <strong>Note:</strong> If this is your current active pilot, you will be switched to another pilot or redirected to create a new one.
        </p>
      </div>
    </div>

    <template #actions>
      <button @click="close" class="btn btn-ghost">Cancel</button>
      <button @click="confirmDelete" class="btn btn-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        Delete Pilot
      </button>
    </template>
  </SettingsModal>
</template>

<script setup>
import { ref } from 'vue'
import SettingsModal from './SettingsModal.vue'
import classData from '../../data/classes.json'

const props = defineProps({
  pilot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

function getPilotIcon(pilotClass) {
  return classData[pilotClass]?.icon || ''
}

function getPilotColor(pilotClass) {
  return classData[pilotClass]?.color || '#fbbf24'
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
  emit('cancel')
}

function confirmDelete() {
  emit('confirm')
  close()
}

defineExpose({
  open,
  close
})
</script>
