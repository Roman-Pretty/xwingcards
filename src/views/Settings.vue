<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-col gap-4 inria-sans-regular overflow-hidden">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-bold text-white">Settings</h1>
      <button class="btn btn-ghost text-white" @click="$router.push('/dashboard')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
        Close
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <!-- Left Column: Pilot Management -->
        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col overflow-hidden">
          <h2 class="text-xl font-semibold text-white mb-4">Pilot Management</h2>
          
          <div class="space-y-4 overflow-y-auto flex-1 pr-2 pb-6">
            <div v-for="pilot in store.pilots" :key="pilot.id" class="bg-neutral-900 border border-neutral-600 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <span class="font-[xwing] text-2xl -mt-1" :style="{ color: getPilotColor(pilot.class) }">{{ getPilotIcon(pilot.class) }}</span>
                    <div>
                      <h3 class="text-lg font-semibold text-white">{{ pilot.name }}</h3>
                      <p class="text-sm text-gray-400">{{ pilot.class }} - Rank {{ pilot.rank }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-primary" @click="openEditPilot(pilot)">Edit</button>
                  <button class="btn btn-sm btn-error" @click="openDeletePilot(pilot)">Delete</button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center gap-2 text-yellow-300">
                  <span class="font-[xwing] text-lg -mt-1">Ì</span>
                  <span>XP: {{ pilot.xp || 0 }}</span>
                </div>
                <div class="text-gray-300">
                  <span>Cards: {{ pilot.ownedCards?.length || 0 }}</span>
                </div>
                <div class="text-gray-300">
                  <span>Ships: {{ pilot.ships?.length || 0 }}</span>
                </div>
                <div class="text-gray-300">
                  <span>Current Ship: {{ pilot.selectedShip || 'None' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Settings and Actions -->
        <div class="space-y-6 flex flex-col h-full">
          <!-- General Settings -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
            <h2 class="text-xl font-semibold text-white mb-4">General Settings</h2>
            
            <div class="space-y-4">
              <!-- Enable Custom Cards -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-white font-medium">Enable Custom Cards</h3>
                  <p class="text-sm text-gray-400">Show custom cards in the shop (owned custom cards will always be visible)</p>
                </div>
                <input 
                  type="checkbox" 
                  class="toggle toggle-primary" 
                  :checked="store.enableCustomCards"
                  @change="updateCustomCardsEnabled"
                />
              </div>

              <!-- Enable Faction Filtering -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-white font-medium">Enable Faction Filtering</h3>
                  <p class="text-sm text-gray-400">Only show cards from your class's allowed factions in the shop</p>
                </div>
                <input 
                  type="checkbox" 
                  class="toggle toggle-primary" 
                  :checked="store.enableFactionFiltering"
                  @change="updateFactionFilteringEnabled"
                />
              </div>

              <!-- Enable Unique Card Restriction -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-white font-medium">Enable Unique Card Restriction</h3>
                  <p class="text-sm text-gray-400">Prevent multiple pilots from equipping unique cards with the same name</p>
                </div>
                <input 
                  type="checkbox" 
                  class="toggle toggle-primary" 
                  :checked="store.enableUniqueCardRestriction"
                  @change="updateUniqueCardRestrictionEnabled"
                />
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
            <h2 class="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            
            <div class="space-y-3">
              <button class="btn btn-primary w-full justify-start" @click="$router.push('/create-pilot')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create New Pilot
              </button>
              
              <button class="btn btn-secondary w-full justify-start" @click="exportData">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Data
              </button>
              
              <button class="btn btn-secondary w-full justify-start" @click="importData">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Import Data
              </button>
              
              <button class="btn btn-error w-full justify-start" @click="openResetAll">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditPilotModal
      ref="editPilotModal"
      :pilot="selectedPilot"
      @confirm="confirmEditPilot"
      @cancel="cancelEditPilot"
    />

    <DeletePilotModal
      ref="deletePilotModal"
      :pilot="selectedPilot"
      @confirm="confirmDeletePilot"
      @cancel="cancelDeletePilot"
    />

    <ConfirmationModal
      ref="confirmationModal"
      :title="confirmationTitle"
      :message="confirmationMessage"
      @confirm="confirmAction"
      @cancel="cancelAction"
    />

    <!-- Hidden file input for import -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePilotStore } from '../stores/PilotStore'
import classData from '../data/classes.json'

import EditPilotModal from '../components/ui/EditPilotModal.vue'
import DeletePilotModal from '../components/ui/DeletePilotModal.vue'
import ConfirmationModal from '../components/ui/ConfirmationModal.vue'

const router = useRouter()
const store = usePilotStore()

// Component refs
const editPilotModal = ref(null)
const deletePilotModal = ref(null)
const confirmationModal = ref(null)
const fileInput = ref(null)

// Modal state
const selectedPilot = ref(null)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const pendingAction = ref(null)

// Helper functions
function getPilotIcon(pilotClass) {
  return classData[pilotClass]?.icon || ''
}

function getPilotColor(pilotClass) {
  return classData[pilotClass]?.color || '#fbbf24'
}

// Pilot management
function openEditPilot(pilot) {
  selectedPilot.value = pilot
  editPilotModal.value?.open()
}

function confirmEditPilot(updatedPilot) {
  if (selectedPilot.value) {
    // Update the pilot in the store
    const pilotIndex = store.pilots.findIndex(p => p.id === selectedPilot.value.id)
    if (pilotIndex !== -1) {
      store.pilots[pilotIndex] = { ...store.pilots[pilotIndex], ...updatedPilot }
    }
  }
  selectedPilot.value = null
}

function cancelEditPilot() {
  selectedPilot.value = null
}

function openDeletePilot(pilot) {
  selectedPilot.value = pilot
  deletePilotModal.value?.open()
}

function confirmDeletePilot() {
  if (selectedPilot.value) {
    const pilotIndex = store.pilots.findIndex(p => p.id === selectedPilot.value.id)
    if (pilotIndex !== -1) {
      store.pilots.splice(pilotIndex, 1)
      
      // If we deleted the current pilot, switch to another one or go to create pilot
      if (store.currentPilotId === selectedPilot.value.id) {
        if (store.pilots.length > 0) {
          store.currentPilotId = store.pilots[0].id
        } else {
          router.push('/create-pilot')
        }
      }
    }
  }
  selectedPilot.value = null
}

function cancelDeletePilot() {
  selectedPilot.value = null
}

// Data management
function exportData() {
  const data = {
    pilots: store.pilots,
    currentPilotId: store.currentPilotId,
    exportDate: new Date().toISOString(),
    version: '1.0'
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `xwing-pilots-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function importData() {
  fileInput.value?.click()
}

function handleFileImport(event) {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (data.pilots && Array.isArray(data.pilots)) {
        confirmationTitle.value = 'Import Data'
        confirmationMessage.value = `This will replace all current pilot data with ${data.pilots.length} pilot(s) from the file. This action cannot be undone.`
        pendingAction.value = () => {
          store.pilots = data.pilots
          store.currentPilotId = data.currentPilotId || (data.pilots.length > 0 ? data.pilots[0].id : '1')
          alert('Data imported successfully!')
        }
        confirmationModal.value?.open()
      } else {
        alert('Invalid file format. Please select a valid export file.')
      }
    } catch (error) {
      alert('Error reading file. Please make sure it\'s a valid JSON file.')
    }
  }
  reader.readAsText(file)
  
  // Reset the file input
  event.target.value = ''
}

function openResetAll() {
  confirmationTitle.value = 'Reset All Data'
  confirmationMessage.value = 'This will permanently delete all pilots and their data. This action cannot be undone.'
  pendingAction.value = () => {
    store.pilots = []
    store.currentPilotId = '1'
    router.push('/create-pilot')
  }
  confirmationModal.value?.open()
}

function confirmAction() {
  if (pendingAction.value) {
    pendingAction.value()
    pendingAction.value = null
  }
}

function cancelAction() {
  pendingAction.value = null
}

// Settings methods
function updateCustomCardsEnabled(event) {
  store.updateSetting('enableCustomCards', event.target.checked)
}

function updateFactionFilteringEnabled(event) {
  store.updateSetting('enableFactionFiltering', event.target.checked)
}

function updateUniqueCardRestrictionEnabled(event) {
  store.updateSetting('enableUniqueCardRestriction', event.target.checked)
}
</script>
