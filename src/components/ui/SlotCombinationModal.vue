<template>
  <BaseModal 
    ref="modalRef" 
    modal-id="slot_combination_modal" 
    :title="modalTitle"
    confirm-text="Equip Card"
    cancel-text="Cancel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="space-y-4">
        <p class="text-white">
          <strong>{{ cardName }}</strong> requires multiple slots. Choose which combination to use:
        </p>
        
        <div class="space-y-3">
          <div 
            v-for="(combination, index) in combinations" 
            :key="index"
            class="border rounded-lg p-3 cursor-pointer hover:bg-base-200 transition-colors"
            :class="{ 'border-primary bg-primary/10': selectedIndex === index }"
            @click="selectCombination(index)"
          >
            <div class="flex items-center space-x-2">
              <input 
                type="radio" 
                :id="`combo-${index}`"
                :value="index" 
                v-model="selectedIndex"
                class="radio radio-primary radio-sm"
              />
              <label :for="`combo-${index}`" class="flex-1 cursor-pointer">
                <div class="font-medium text-white">
                  {{ formatSlotCombination(combination.slotKeys) }}
                </div>
                <div class="text-xs text-gray-400">
                  Types: {{ combination.combination.join(', ') }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div v-if="combinations.length === 0" class="text-center text-gray-400 py-4">
          No available slot combinations for this card.
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  cardName: {
    type: String,
    default: ''
  },
  cardId: {
    type: String,
    default: ''
  },
  combinations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const modalRef = ref(null)
const selectedIndex = ref(null)

const modalTitle = computed(() => `Select Slot Combination for ${props.cardName}`)

// Reset selection when combinations change
watch(() => props.combinations, () => {
  selectedIndex.value = null
}, { deep: true })

// Also reset when card changes
watch(() => props.cardId, () => {
  selectedIndex.value = null
})

function selectCombination(index) {
  selectedIndex.value = index
}

function handleConfirm() {
  if (selectedIndex.value !== null && selectedIndex.value < props.combinations.length) {
    emit('confirm', selectedIndex.value)
    close()
  }
}

function handleCancel() {
  selectedIndex.value = null
  emit('cancel')
  close()
}

function open() {
  selectedIndex.value = null
  modalRef.value?.open()
}

function close() {
  modalRef.value?.close()
}

function formatSlotCombination(slotKeys) {
  return slotKeys.map(key => {
    if (key.startsWith('fixed-')) {
      const index = parseInt(key.split('-')[1]) + 1
      return `Slot ${index}`
    } else if (key.startsWith('optional-')) {
      const index = parseInt(key.split('-')[1]) + 1
      return `Optional ${index}`
    }
    return key
  }).join(' + ')
}

defineExpose({
  open,
  close
})
</script>
