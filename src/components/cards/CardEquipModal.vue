<template>
  <BaseModal
    modal-id="card_equip_modal"
    :title="`Equip ${card?.name || 'Card'}`"
    :confirm-text="null"
    @cancel="handleCancel"
  >
    <template #content>
      <div v-if="card" class="mb-4">
        <p class="text-neutral-400 text-sm mb-4">Select a slot to equip this card:</p>
        
        <div class="space-y-2">
          <button 
            v-for="slot in availableSlots" 
            :key="slot.key" 
            @click="selectSlot(slot.key)"
            class="w-full p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-left text-white transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="font-[xwing] text-xl text-yellow-400">{{ slot.icon }}</span>
                <span class="font-medium">{{ slot.name }}</span>
              </div>
              <span v-if="slot.occupied" class="text-xs text-red-400">Replace {{ slot.occupiedCard }}</span>
              <span v-else class="text-xs text-green-400">Empty</span>
            </div>
          </button>
        </div>
        
        <div v-if="availableSlots.length === 0" class="text-center text-neutral-400 py-8">
          <p>No compatible slots available for this card type.</p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../modals/BaseModal.vue'

const props = defineProps({
  card: {
    type: Object,
    default: null
  },
  availableSlots: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['equip', 'cancel'])

function selectSlot(slotKey) {
  emit('equip', slotKey)
  closeModal()
}

function handleCancel() {
  emit('cancel')
  closeModal()
}

function closeModal() {
  const modal = document.getElementById('card_equip_modal')
  if (modal?.close) {
    modal.close()
    document.body.style.overflow = ""
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById('card_equip_modal')
    if (modal?.showModal) {
      modal.showModal()
      document.body.style.overflow = "hidden"
    }
  },
  close: closeModal
})
</script>
