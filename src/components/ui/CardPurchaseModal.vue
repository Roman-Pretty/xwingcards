<template>
  <BaseModal
    modal-id="confirm_card_purchase_modal"
    :title="isUpgrade ? 'Confirm Card Upgrade' : 'Confirm Card Purchase'"
    :confirm-text="isUpgrade ? 'Upgrade' : 'Purchase'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div v-if="!isUpgrade" class="mb-4">
        <p>
          Are you sure you want to buy
          <strong>{{ card?.name }}</strong> for
          <span class="font-[xwing] text-lg">Ì</span>{{ card?.cost }}?
        </p>
        
        <div v-if="initiativeWarning" class="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
            <span class="text-yellow-400 text-sm font-medium">{{ initiativeWarning }}</span>
          </div>
          <p class="text-yellow-200 text-xs mt-1">You can still purchase this card, but you won't be able to equip it until you have the required initiative.</p>
        </div>

        <div v-if="factionWarning" class="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
            <span class="text-red-400 text-sm font-medium">{{ factionWarning }}</span>
          </div>
        </div>

        <div v-if="uniqueCardWarning" class="mt-3 p-3 bg-orange-900/30 border border-orange-600 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-400">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
            <span class="text-orange-400 text-sm font-medium">{{ uniqueCardWarning }}</span>
          </div>
        </div>
      </div>
      
      <div v-else class="mb-4">
        <p>
          Are you sure you want to upgrade
          <strong>{{ card?.name }}</strong> to level {{ upgradeLevel + 1 }} for
          <span class="font-[xwing] text-lg">Ì</span>{{ card?.cost }}?
        </p>
        <small class="text-gray-400">
          This will increase its energy from {{ (card?.energy || 0) + upgradeLevel }} 
          to {{ (card?.energy || 0) + upgradeLevel + 1 }}.
        </small>
        
        <div v-if="initiativeWarning" class="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
            <span class="text-yellow-400 text-sm font-medium">{{ initiativeWarning }}</span>
          </div>
        </div>

        <div v-if="factionWarning" class="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="m12 17 .01 0"/>
            </svg>
            <span class="text-red-400 text-sm font-medium">{{ factionWarning }}</span>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { computed } from 'vue'
import { usePilotStore } from '../../stores/pilotStore'

const store = usePilotStore()

const props = defineProps({
  card: {
    type: Object,
    default: null
  },
  isUpgrade: {
    type: Boolean,
    default: false
  },
  upgradeLevel: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['confirm', 'cancel'])

// Check if this card has initiative requirements
const initiativeWarning = computed(() => {
  if (!props.card?.id) return null
  return store.getInitiativeRequirementText(props.card.id)
})

// Check if this card has faction requirements  
const factionWarning = computed(() => {
  if (!props.card?.id) return null
  return store.getFactionRequirementText(props.card.id)
})

// Check if this card has unique card conflicts
const uniqueCardWarning = computed(() => {
  if (!props.card?.id) return null
  return store.getUniqueCardWarningText(props.card.id)
})

function handleConfirm() {
  emit('confirm')
  closeModal()
}

function handleCancel() {
  emit('cancel')
  closeModal()
}

function closeModal() {
  const modal = document.getElementById('confirm_card_purchase_modal')
  if (modal?.close) {
    modal.close()
    document.body.style.overflow = ""
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById('confirm_card_purchase_modal')
    if (modal?.showModal) {
      modal.showModal()
      document.body.style.overflow = "hidden"
    }
  },
  close: closeModal
})
</script>
