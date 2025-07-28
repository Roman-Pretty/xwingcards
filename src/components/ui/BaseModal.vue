<template>
  <dialog :id="modalId" class="modal">
    <div class="modal-box bg-neutral-800 text-white">
      <h3 v-if="title" class="text-lg font-bold mb-2">{{ title }}</h3>
      
      <slot name="content">
        <div v-html="content"></div>
      </slot>
      
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button 
            v-if="confirmText" 
            type="button" 
            class="btn" 
            :class="confirmButtonClass"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
          <button 
            class="btn btn-neutral" 
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  modalId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmButtonClass: {
    type: String,
    default: 'btn-primary'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  closeModal()
}

function closeModal() {
  const modal = document.getElementById(props.modalId)
  if (modal?.close) {
    modal.close()
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    const modal = document.getElementById(props.modalId)
    if (modal?.showModal) {
      modal.showModal()
    }
  },
  close: closeModal
})
</script>
