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
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

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
