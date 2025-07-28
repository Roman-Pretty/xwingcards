<template>
  <SettingsModal
    :isOpen="isOpen"
    :title="title"
    @close="close"
  >
    <div class="space-y-4">
      <div class="flex items-start gap-4 p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
        <div class="text-orange-400 flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-orange-400 mb-2">Confirmation Required</h3>
          <p class="text-gray-300 leading-relaxed">{{ message }}</p>
        </div>
      </div>
    </div>

    <template #actions>
      <button @click="close" class="btn btn-ghost">Cancel</button>
      <button @click="confirm" class="btn btn-warning">Confirm</button>
    </template>
  </SettingsModal>
</template>

<script setup>
import { ref } from 'vue'
import SettingsModal from './SettingsModal.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
  emit('cancel')
}

function confirm() {
  emit('confirm')
  close()
}

defineExpose({
  open,
  close
})
</script>
