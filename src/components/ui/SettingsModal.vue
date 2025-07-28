<template>
  <dialog :class="['modal', { 'modal-open': isOpen }]">
    <div class="modal-box bg-neutral-800 text-white">
      <h3 v-if="title" class="text-lg font-bold mb-4">{{ title }}</h3>
      
      <slot />
      
      <div class="modal-action">
        <slot name="actions">
          <button class="btn btn-ghost" @click="close">Cancel</button>
          <button class="btn btn-primary" @click="$emit('confirm')">Confirm</button>
        </slot>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="close">
      <button type="button">close</button>
    </form>
  </dialog>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])

function close() {
  emit('close')
}
</script>
