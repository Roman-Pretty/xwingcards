<template>
  <BaseModal 
    ref="modalRef" 
    modal-id="faction_selection_modal" 
    :title="modalTitle"
    confirm-text="Confirm"
    cancel-text="Cancel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="space-y-4">
        <p class="text-white">{{ cardName }} can be equipped to multiple factions. Choose which faction to equip it to:</p>
        
        <div class="grid grid-cols-1 gap-3">
          <!-- Actual faction buttons -->
          <button 
            v-for="faction in factions" 
            :key="faction"
            @click="selectFaction(faction)"
            class="flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer"
            :class="selectedFaction === faction ? 'bg-blue-700 border-blue-500 hover:bg-blue-600' : 'bg-neutral-700 border-transparent hover:bg-neutral-600 hover:border-gray-500'"
          >
            <div class="flex items-center gap-3">
              <!-- Faction icon -->
              <div :class="getFactionIconClass(faction)">
                <span>{{ getFactionIcon(faction) }}</span>
              </div>
              
              <!-- Faction name -->
              <span class="text-white font-semibold">{{ getFactionDisplayName(faction) }}</span>
            </div>
            
            <!-- Faction slot usage -->
            <div class="text-sm text-gray-400">
              {{ getUsedFactionSlots(faction) }} / {{ getMaxFactionSlots(faction) }} slots used
            </div>
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { usePilotStore } from '../../stores/PilotStore'

const props = defineProps({
  cardName: String,
  cardId: String,
  factions: Array
})

const emit = defineEmits(['confirm', 'cancel'])

const modalRef = ref(null)
const store = usePilotStore()
const selectedFaction = ref(null)

const modalTitle = computed(() => `Choose Faction for ${props.cardName}`)

const availableFactions = computed(() => {
  console.log('=== FactionSelectionModal availableFactions computed ===');
  console.log('props.factions:', props.factions);
  console.log('props.cardId:', props.cardId);
  console.log('props.cardName:', props.cardName);
  console.log('Current pilot faction slots:', store.currentPilot?.usedFactionSlots);
  
  if (!props.factions || !props.cardId) {
    console.log('Missing factions or cardId, returning empty array');
    return [];
  }
  
  if (!Array.isArray(props.factions)) {
    console.log('props.factions is not an array:', typeof props.factions);
    return [];
  }
  
  console.log('props.factions array length:', props.factions.length);
  
  const filtered = props.factions.filter(faction => {
    console.log(`Checking faction: "${faction}" (type: ${typeof faction})`);
    const canEquip = store.canEquipFactionCard(props.cardId, faction);
    console.log(`Can equip ${faction}:`, canEquip);
    return canEquip;
  });
  
  console.log('Final filtered factions:', filtered);
  console.log('Final filtered factions length:', filtered.length);
  return filtered;
})

// Faction icon mappings
const factionIcons = {
  'empire': '@',
  'force': 'h', 
  'resistance': '!',
  'firstorder': '+',
  'scum': '#',
  'republic': '/',
  'separatist': '.',
  'neutral': ''
}

const factionDisplayNames = {
  'empire': 'Galactic Empire',
  'force': 'Force Users',
  'resistance': 'Resistance', 
  'firstorder': 'First Order',
  'scum': 'Scum & Villainy',
  'republic': 'Galactic Republic',
  'separatist': 'Separatist Alliance',
  'neutral': 'Neutral'
}

function getFactionIcon(faction) {
  return factionIcons[faction.toLowerCase()] || ''
}

function getFactionDisplayName(faction) {
  return factionDisplayNames[faction.toLowerCase()] || faction
}

function getFactionIconClass(faction) {
  return `faction-icon font-[xwing] bg-${faction.toLowerCase()} text-xs`
}

function getUsedFactionSlots(faction) {
  return store.getMappedFactionSlots(getFactionIcon(faction)) || 0
}

function getMaxFactionSlots(faction) {
  return store.getMaxFactionSlots(faction.toLowerCase()) || 0
}

function selectFaction(faction) {
  selectedFaction.value = faction
}

function handleConfirm() {
  if (selectedFaction.value) {
    emit('confirm', selectedFaction.value)
    close()
  }
}

function handleCancel() {
  selectedFaction.value = null
  emit('cancel')
}

function cancel() {
  selectedFaction.value = null
  emit('cancel')
  close()
}

function open() {
  selectedFaction.value = null
  modalRef.value?.open()
}

function close() {
  modalRef.value?.close()
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.faction-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);
}

.faction-icon span {
  color: white;
  opacity: 0.9;
  font-size: 1rem;
  margin-top: -0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
