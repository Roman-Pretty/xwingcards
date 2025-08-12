/**
 * Settings.vue
 * 
 * Main settings page component that provides pilot management, application settings,
 * data import/export functionality, and resource downloads.
 */
<template>
  <main class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <SettingsHeader @close="$router.push('/dashboard')" />

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <PilotManagementSection 
            :pilots="store.pilots"
            @edit-pilot="openEditPilot"
            @delete-pilot="openDeletePilot"
          />

          <div class="space-y-6 flex flex-col h-full">
            <GeneralSettingsSection 
              :enable-custom-cards="store.enableCustomCards"
              :enable-faction-filtering="store.enableFactionFiltering"
              :enable-unique-card-restriction="store.enableUniqueCardRestriction"
              @update:enable-custom-cards="updateSetting('enableCustomCards', $event)"
              @update:enable-faction-filtering="updateSetting('enableFactionFiltering', $event)"
              @update:enable-unique-card-restriction="updateSetting('enableUniqueCardRestriction', $event)"
            />

            <QuickActionsSection 
              @create-pilot="$router.push('/create-pilot')"
              @export-data="exportData"
              @import-data="importData"
              @reset-all="openResetAll"
            />

            <div class="border-t border-neutral-700"></div>

            <DownloadResourcesSection />
          </div>
        </div>
      </div>
    </div>

    <EditPilotModal
      ref="editPilotModal"
      :pilot="selectedPilot || undefined"
      @confirm="confirmEditPilot"
      @cancel="cancelEditPilot"
    />

    <DeletePilotModal
      ref="deletePilotModal"
      :pilot="selectedPilot || undefined"
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

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePilotStore } from '../stores/PilotStore'
import type { Pilot } from '../stores/PilotStore'

// Component imports
import SettingsHeader from '../components/layout/SettingsHeader.vue'
import PilotManagementSection from '../components/pilots/PilotManagementSection.vue'
import GeneralSettingsSection from '../components/sections/GeneralSettingsSection.vue'
import QuickActionsSection from '../components/sections/QuickActionsSection.vue'
import DownloadResourcesSection from '../components/sections/DownloadResourcesSection.vue'
import EditPilotModal from '../components/modals/EditPilotModal.vue'
import DeletePilotModal from '../components/modals/DeletePilotModal.vue'
import ConfirmationModal from '../components/modals/ConfirmationModal.vue'

const router = useRouter()
const store = usePilotStore()

/**
 * Template refs for modal components
 */
const editPilotModal = ref<InstanceType<typeof EditPilotModal> | null>(null)
const deletePilotModal = ref<InstanceType<typeof DeletePilotModal> | null>(null)
const confirmationModal = ref<InstanceType<typeof ConfirmationModal> | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

/**
 * Modal state management
 */
const selectedPilot = ref<Pilot | null>(null)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const pendingAction = ref<(() => void) | null>(null)

/**
 * Open edit pilot modal
 * @param pilot - The pilot to edit
 */
function openEditPilot(pilot: Pilot): void {
  selectedPilot.value = pilot
  editPilotModal.value?.open()
}

/**
 * Confirm pilot edit changes
 * @param updatedPilot - The updated pilot data
 */
function confirmEditPilot(updatedPilot: Partial<Pilot>): void {
  if (selectedPilot.value) {
    const pilotIndex = store.pilots.findIndex(p => p.id === selectedPilot.value!.id)
    if (pilotIndex !== -1) {
      store.pilots[pilotIndex] = { ...store.pilots[pilotIndex], ...updatedPilot }
    }
  }
  selectedPilot.value = null
}

/**
 * Cancel pilot edit
 */
function cancelEditPilot(): void {
  selectedPilot.value = null
}

/**
 * Open delete pilot modal
 * @param pilot - The pilot to delete
 */
function openDeletePilot(pilot: Pilot): void {
  selectedPilot.value = pilot
  deletePilotModal.value?.open()
}

/**
 * Confirm pilot deletion
 */
function confirmDeletePilot(): void {
  if (selectedPilot.value) {
    const pilotIndex = store.pilots.findIndex(p => p.id === selectedPilot.value!.id)
    if (pilotIndex !== -1) {
      store.pilots.splice(pilotIndex, 1)
      
      // Handle current pilot switching
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

/**
 * Cancel pilot deletion
 */
function cancelDeletePilot(): void {
  selectedPilot.value = null
}

/**
 * Export pilot data as JSON file
 */
function exportData(): void {
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

/**
 * Trigger file import dialog
 */
function importData(): void {
  fileInput.value?.click()
}

/**
 * Handle file import process
 * @param event - The file input change event
 */
function handleFileImport(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
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
  
  target.value = ''
}

/**
 * Open reset all data confirmation
 */
function openResetAll(): void {
  confirmationTitle.value = 'Reset All Data'
  confirmationMessage.value = 'This will permanently delete all pilots and their data. This action cannot be undone.'
  pendingAction.value = () => {
    store.pilots = []
    store.currentPilotId = '1'
    router.push('/create-pilot')
  }
  confirmationModal.value?.open()
}

/**
 * Confirm pending action
 */
function confirmAction(): void {
  if (pendingAction.value) {
    pendingAction.value()
    pendingAction.value = null
  }
}

/**
 * Cancel pending action
 */
function cancelAction(): void {
  pendingAction.value = null
}

/**
 * Update a store setting
 * @param key - The setting key to update
 * @param value - The new value
 */
function updateSetting(key: 'enableCustomCards' | 'enableFactionFiltering' | 'enableUniqueCardRestriction', value: boolean): void {
  store.updateSetting(key, value)
}
</script>
