<template>
  <BaseModal
    modal-id="add_xp_modal"
    :title="`Add XP to ${pilotName}`"
    confirm-text="Confirm"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <input 
        v-model.number="xpAmount" 
        type="number" 
        min="1" 
        class="input input-bordered w-full mb-4 text-white" 
        placeholder="Enter XP amount"
        @keyup.enter="handleConfirm" 
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  pilotName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm'])

const xpAmount = ref(null)

function handleConfirm() {
  if (xpAmount.value > 0) {
    emit('confirm', xpAmount.value)
    xpAmount.value = null
    closeModal()
  }
}

function handleCancel() {
  xpAmount.value = null
}

function closeModal() {
  const modal = document.getElementById('add_xp_modal')
  if (modal?.close) {
    modal.close()
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById('add_xp_modal')
    if (modal?.showModal) {
      modal.showModal()
    }
  },
  close: closeModal
})
</script>
