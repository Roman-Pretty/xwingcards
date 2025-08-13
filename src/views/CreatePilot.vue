<template>
  <div class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <CreatePilotForm 
      @create-pilot="createPilot"
      @go-back="goBack"
      :has-existing-pilots="store.pilots.length > 0"
    />
  </div>
</template>

<script setup>
/**
 * CreatePilot View
 * 
 * Main view for creating new pilots with componentized form
 */
import { useRouter } from "vue-router"
import { usePilotStore } from "../stores/PilotStore"
import CreatePilotForm from "../components/create-pilot/CreatePilotForm.vue"

const router = useRouter()
const store = usePilotStore()

/**
 * Handle pilot creation
 * @param {Object} pilotData - The pilot data from the form
 */
function createPilot(pilotData) {
  try {
    const newPilot = {
      id: Date.now().toString(),
      name: pilotData.name.trim(),
      class: pilotData.pilotClass,
      rank: 1,
      xp: pilotData.xp || 10,
      selectedCards: [],
      slotCards: {},
      ownedCards: [],
      ships: [pilotData.startingShip],
      selectedShip: pilotData.startingShip,
      slots: [],
      usedFactionSlots: {},
    }
    
    store.pilots.push(newPilot)
    store.currentPilotId = newPilot.id
    router.push('/dashboard')
  } catch (error) {
    console.error('Error creating pilot:', error)
    showErrorMessage('Failed to create pilot. Please try again.')
  }
}

/**
 * Handle navigation back to dashboard
 */
function goBack() {
  if (store.pilots.length > 0) {
    router.push('/dashboard')
  }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
  const errorElement = document.createElement('div')
  errorElement.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg'
  errorElement.textContent = message
  document.body.appendChild(errorElement)
  
  setTimeout(() => {
    errorElement.remove()
  }, 5000)
}
</script>
