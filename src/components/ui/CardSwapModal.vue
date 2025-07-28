<template>
  <BaseModal
    modal-id="card_swap_modal"
    title="Card Already Owned"
    confirm-text="Swap Cards"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="mb-4">
        <p class="mb-2">{{ targetPilotName }} already owns "{{ cardName }}"</p>
        <div class="bg-neutral-700 p-3 rounded">
          <div class="flex justify-between mb-2">
            <span>Your upgrade level:</span>
            <span class="font-bold">{{ yourUpgradeLevel }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ targetPilotName }}'s upgrade level:</span>
            <span class="font-bold">{{ targetUpgradeLevel }}</span>
          </div>
        </div>
      </div>
      
      <p class="text-sm text-gray-300 mb-4">
        Would you like to swap your upgrade levels?
      </p>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
  cardName: String,
  targetPilotName: String,
  yourUpgradeLevel: Number,
  targetUpgradeLevel: Number,
});

const emit = defineEmits(['confirm', 'cancel']);

function handleConfirm() {
  emit('confirm');
  closeModal();
}

function handleCancel() {
  emit('cancel');
  closeModal();
}

function closeModal() {
  const modal = document.getElementById('card_swap_modal');
  if (modal?.close) {
    modal.close();
    document.body.style.overflow = "";
  }
}

// Expose methods for parent components
defineExpose({
  open: () => {
    // Try the setTimeout approach to ensure DOM is ready
    setTimeout(() => {
      const modal = document.getElementById('card_swap_modal');
      if (modal?.showModal) {
        modal.showModal();
        document.body.style.overflow = "hidden";
      }
    }, 0);
  },
  close: closeModal
});
</script>
