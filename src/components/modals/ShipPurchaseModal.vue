<template>
  <BaseModal
    modal-id="confirm_purchase_modal"
    title="Confirm Purchase"
    confirm-text="Confirm"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="mb-4">
        <p>
          Are you sure you want to buy <strong>{{ ship?.ship }}</strong> for
          <span class="font-[xwing] text-lg">Ì</span>{{ ship?.cost }}?
        </p>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

const props = defineProps({
  ship: {
    type: Object,
    default: null
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
  const modal = document.getElementById('confirm_purchase_modal')
  if (modal?.close) {
    modal.close()
    document.body.style.overflow = ""
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById('confirm_purchase_modal')
    if (modal?.showModal) {
      modal.showModal()
      document.body.style.overflow = "hidden"
    }
  },
  close: closeModal
})
</script>
