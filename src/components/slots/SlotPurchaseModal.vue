<template>
  <BaseModal
    modal-id="confirm_slot_modal"
    title="Unlock Slot"
    confirm-text="Confirm"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="mb-4">
        <p>
          Spend <span class="font-[xwing] text-lg">Ì</span>{{ xpCost }} to unlock this slot?
        </p>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../modals/BaseModal.vue'

const props = defineProps({
  xpCost: {
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
  const modal = document.getElementById('confirm_slot_modal')
  if (modal?.close) {
    modal.close()
    document.body.style.overflow = ""
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById('confirm_slot_modal')
    if (modal?.showModal) {
      modal.showModal()
      document.body.style.overflow = "hidden"
    }
  },
  close: closeModal
})
</script>
