<!-- src/components/Slots.vue -->
<template>
  <div :class="['flex flex-row gap-4 flex-wrap mb-4 min-h-[20vh]', $attrs.class]" :key="slotUpdateKey">
    <!-- Fixed slots -->
    <Slot v-for="slot in allFixedSlots" :key="`${slot.key}-${slotUpdateKey}`" :slot-key="slot.key" :options="[slot.token]"
      :unlocked="slot.unlocked" :xpCost="slot.xpCost" :isLocked="slot.isLocked"
      :card="currentPilot?.slotCards[slot.key] || null" 
      :currently-dragged-card="props.currentlyDraggedCard"
      @card-drop="handleCardDrop(slot.key, $event)"
      @slot-switch="handleSlotSwitch(slot.key, $event)" @purchase-slot="openPurchaseModal(slot.key, slot.xpCost)" />


    <!-- Optional slots -->
    <Slot v-for="(opts, index) in optionalSlots" :key="`optional-${index}-${slotUpdateKey}`" :slot-key="'optional-' + index"
      :options="opts" :unlocked="true" :card="currentPilot?.slotCards['optional-' + index] || null"
      :currently-dragged-card="props.currentlyDraggedCard"
      @card-drop="handleCardDrop('optional-' + index, $event)"
      @slot-switch="handleSlotSwitch('optional-' + index, $event)" />
  </div>

  <!-- Modal Component -->
  <SlotPurchaseModal
    ref="slotPurchaseModal"
    :xp-cost="selectedSlotXP"
    @confirm="confirmSlotPurchase"
    @cancel="cancelSlotPurchase"
  />

  <!-- Faction Selection Modal -->
  <FactionSelectionModal
    ref="factionSelectionModal"
    :card-name="pendingFactionCard?.name || ''"
    :card-id="pendingFactionCard?.cardId || ''"
    :factions="pendingFactionCard?.factions || []"
    @confirm="confirmFactionSelection"
    @cancel="cancelFactionSelection"
  />

  <!-- Slot Combination Selection Modal -->
  <SlotCombinationModal
    ref="slotCombinationModal"
    :card-name="pendingSlotCard?.name || ''"
    :card-id="pendingSlotCard?.cardId || ''"
    :combinations="pendingSlotCard?.combinations || []"
    @confirm="confirmSlotCombination"
    @cancel="cancelSlotCombination"
  />
</template>

<script setup>
import { computed, ref, nextTick, watch } from "vue";
import { usePilotStore } from "../../stores/PilotStore";
import Slot from "./Slot.vue";
import SlotPurchaseModal from "./SlotPurchaseModal.vue";
import FactionSelectionModal from "../modals/FactionSelectionModal.vue";
import SlotCombinationModal from "./SlotCombinationModal.vue";
import { letterToTokenMap } from "../../utils/mappings";
import classData from "../../data/classes.json";
import cards from "../../data/cards.js";

// Disable automatic attribute inheritance since we have multiple root elements
defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  currentlyDraggedCard: {
    type: Object,
    default: null
  },
  mobileMode: {
    type: Boolean,
    default: false
  }
});

const store = usePilotStore();

const selectedSlotKey = ref(null)
const selectedSlotXP = ref(0)
const pendingFactionCard = ref(null)
const pendingSlotCard = ref(null)

// Force reactivity updates
const slotUpdateKey = ref(0);

// Component refs
const slotPurchaseModal = ref(null);
const factionSelectionModal = ref(null);
const slotCombinationModal = ref(null);

// Watch for slot changes to force re-render
watch(() => store.currentPilot?.slotCards, () => {
  slotUpdateKey.value++;
}, { deep: true });

function openPurchaseModal(slotKey, xp) {
  selectedSlotKey.value = slotKey
  selectedSlotXP.value = xp
  slotPurchaseModal.value?.open()
}

function confirmSlotPurchase() {
  const pilot = currentPilot.value;
  if (!pilot || selectedSlotXP.value > pilot.xp) {
    alert("Not enough XP.");
    return;
  }

  pilot.xp -= selectedSlotXP.value;

  if (!pilot.unlockedSlots) {
    pilot.unlockedSlots = [];
  }

  pilot.unlockedSlots.push(selectedSlotKey.value);

  selectedSlotKey.value = null;
  selectedSlotXP.value = 0;
}


function cancelSlotPurchase() {
  selectedSlotKey.value = null;
  selectedSlotXP.value = 0;
}

function confirmFactionSelection(faction) {
  if (!pendingFactionCard.value) return;
  
  const { slotKey, slotKeys, cardId } = pendingFactionCard.value;
  
  if (store.isMultiSlotCard(cardId)) {
    // Use specific slot keys if provided (from slot combination selection)
    if (slotKeys && slotKeys.length > 0) {
      const success = store.assignMultiSlotCardToSlots(cardId, slotKeys);
      if (success !== false) {
        store.equipCardWithFaction(cardId, faction);
        // Force reactivity update
        nextTick(() => {
          slotUpdateKey.value++;
        });
      } else {
        alert("Could not equip this multi-slot card to the selected slots.");
      }
    } else {
      // Fall back to auto-assignment
      const success = store.assignMultiSlotCard(cardId);
      if (success !== false) {
        store.equipCardWithFaction(cardId, faction);
        // Force reactivity update
        nextTick(() => {
          slotUpdateKey.value++;
        });
      } else {
        alert("Could not equip this multi-slot card. Make sure all required slots are available.");
      }
    }
  } else {
    const success = store.assignCardToSlot(slotKey, cardId);
    if (success !== false) {
      store.equipCardWithFaction(cardId, faction);
      // Force reactivity update
      nextTick(() => {
        slotUpdateKey.value++;
      });
    }
  }
  
  pendingFactionCard.value = null;
}

function cancelFactionSelection() {
  pendingFactionCard.value = null;
}

function confirmSlotCombination(combinationIndex) {
  if (!pendingSlotCard.value) return;
  
  const { cardId, combinations } = pendingSlotCard.value;
  const selectedCombination = combinations[combinationIndex];
  
  if (selectedCombination) {
    handleMultiSlotCardEquip(cardId, selectedCombination.slotKeys);
  }
  
  // Clear pending state and close modal
  pendingSlotCard.value = null;
  slotCombinationModal.value?.close();
}

function cancelSlotCombination() {
  pendingSlotCard.value = null;
  slotCombinationModal.value?.close();
}

const currentPilot = computed(() => store.currentPilot);

const pilotClassData = computed(() => {
  return classData?.[currentPilot.value?.class] ?? {};
});

const shipSlots = computed(() => {
  const ship = currentPilot.value?.selectedShip;
  const matchingShip = pilotClassData.value.ships?.find((s) => s.ship === ship);
  return matchingShip?.slots ?? [];
});

const rankSlots = computed(() => {
  const rank = currentPilot.value?.rank ?? 1;
  const unlockedRanks = pilotClassData.value.ranks?.filter((r) => r.rank <= rank) ?? [];

  const fixed = [];
  const optional = [];

  unlockedRanks.forEach((r) => {
    if (r.slots) fixed.push(...r.slots);
    if (r.optionalslots) {
      if (Array.isArray(r.optionalslots[0])) {
        optional.push(...r.optionalslots);
      } else {
        optional.push(r.optionalslots);
      }
    }
  });

  return {
    fixed,
    optional,
  };
});

// Combine ship slots + rank fixed slots
const fixedSlots = computed(() => {
  const ship = currentPilot.value?.selectedShip;
  const shipData = pilotClassData.value.ships?.find((s) => s.ship === ship);
  const locked = shipData?.lockedSlots ?? [];

  const pilotUnlocked = currentPilot.value?.unlockedSlots ?? [];

  const allFixed = [...shipSlots.value, ...rankSlots.value.fixed];
  const processedSlots = [];

  allFixed.forEach((slot, index) => {
    processedSlots.push({
      token: capitalize(letterToTokenMap[slot] ?? slot),
      unlocked: true,
      key: `fixed-${index}`,
      slotType: slot // Add the original slot type
    });
  });

  // Add locked slots with purchase cost - these should NOT be mixed with fixed slots
  locked.forEach((lockedSlot, index) => {
    const key = `${ship}-${index}`;
    const token = capitalize(letterToTokenMap[lockedSlot.slot] ?? lockedSlot.slot);
    processedSlots.push({
      token,
      unlocked: pilotUnlocked.includes(key),
      xpCost: lockedSlot.xp,
      key,
      isLocked: true,
      slotType: lockedSlot.slot // Add the original slot type
    });
  });

  return processedSlots;
});


// Optional slots as array of arrays (each inner array are options for that optional slot)
const optionalSlots = computed(() => {
  const ship = currentPilot.value?.selectedShip;
  const shipData = pilotClassData.value.ships?.find((s) => s.ship === ship);

  const rankOptionals = rankSlots.value.optional ?? [];
  const shipOptionals = shipData?.optionalSlots ?? [];

  const combinedOptionals = [...rankOptionals];

  // Normalize ship optionalSlots to array of arrays (if needed)
  shipOptionals.forEach((opt) => {
    if (Array.isArray(opt)) {
      combinedOptionals.push(opt);
    } else {
      combinedOptionals.push([opt]);
    }
  });

  return combinedOptionals.map((slotGroup) =>
    slotGroup.map((letter) => {
      const token = letterToTokenMap[letter];
      return token ? capitalize(token) : letter;
    })
  );
});


function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Handle card drop event emitted from Slot component
function handleCardDrop(slotKey, cardId) {
  // If removing a card
  if (!cardId || cardId.trim() === '') {
    store.assignCardToSlot(slotKey, cardId);
    return;
  }

  // Check if this is a multi-slot card
  if (store.isMultiSlotCard(cardId)) {
    const combinations = store.getMultiSlotCombinations(cardId, slotKey);
    
    if (combinations.length === 0) {
      alert("Cannot equip this multi-slot card: No available slot combinations.");
      return;
    } else if (combinations.length === 1) {
      // Only one combination available, equip directly
      handleMultiSlotCardEquip(cardId, combinations[0].slotKeys);
    } else {
      // Multiple combinations available, show selection modal
      const card = cards.find(c => c.id === cardId);
      
      // Clear previous state first
      pendingSlotCard.value = null;
      
      // Use nextTick to ensure reactivity
      nextTick(() => {
        pendingSlotCard.value = {
          name: card?.name || 'Unknown Card',
          cardId: cardId,
          combinations: combinations
        };
        slotCombinationModal.value?.open();
      });
    }
    return;
  }

  // For regular cards, continue with existing logic
  // Check if card requires faction selection
  if (store.requiresFactionSelection(cardId)) {
    const availableFactions = store.getAvailableFactionsForCard(cardId);
    
    if (availableFactions.length === 0) {
      alert("Cannot equip this card: No available faction slots.");
      return;
    } else if (availableFactions.length === 1) {
      // Only one faction available, equip directly
      const success = store.assignCardToSlot(slotKey, cardId);
      if (success !== false) {
        store.equipCardWithFaction(cardId, availableFactions[0]);
      }
      return;
    } else {
      // Multiple factions available, show selection modal
      const card = cards.find(c => c.id === cardId);
      pendingFactionCard.value = {
        name: card?.name || 'Unknown Card',
        factions: availableFactions,
        slotKey: slotKey,
        cardId: cardId
      };
      factionSelectionModal.value?.open();
      return;
    }
  }

  // Regular card equipping (no faction selection needed)
  store.assignCardToSlot(slotKey, cardId);
}

// Helper function to handle multi-slot card equipping
function handleMultiSlotCardEquip(cardId, slotKeys) {
  // Check if card requires faction selection
  if (store.requiresFactionSelection(cardId)) {
    const availableFactions = store.getAvailableFactionsForCard(cardId);
    
    if (availableFactions.length === 0) {
      alert("Cannot equip this card: No available faction slots.");
      return;
    } else if (availableFactions.length === 1) {
      // Only one faction available, equip directly
      const success = store.assignMultiSlotCardToSlots(cardId, slotKeys);
      if (success !== false) {
        store.equipCardWithFaction(cardId, availableFactions[0]);
        // Force reactivity update
        nextTick(() => {
          slotUpdateKey.value++;
        });
      } else {
        alert("Could not equip this multi-slot card to the selected slots.");
      }
    } else {
      // Multiple factions available, store slot selection for after faction choice
      const card = cards.find(c => c.id === cardId);
      pendingFactionCard.value = {
        name: card?.name || 'Unknown Card',
        factions: availableFactions,
        slotKeys: slotKeys, // Store the slot keys for multi-slot cards
        cardId: cardId
      };
      factionSelectionModal.value?.open();
    }
  } else {
    // No faction selection needed, equip directly
    const success = store.assignMultiSlotCardToSlots(cardId, slotKeys);
    if (success === false) {
      alert("Could not equip this multi-slot card to the selected slots.");
    } else {
      // Force reactivity update
      nextTick(() => {
        slotUpdateKey.value++;
      });
    }
  }
}

// Handle slot type switch event emitted from Slot component
function handleSlotSwitch(slotKey, newOption) {
  // Update the current pilot’s slot type selection in the store
  store.changeSlotOption(slotKey, newOption);
}

const freeSlots = computed(() => {
  const pilot = currentPilot.value;
  if (!pilot) return [];

  const result = [];

  Object.entries(pilot.slotCards).forEach(([slotKey, cardId]) => {
    const card = cards.find((c) => c.id === cardId);
    if (card?.freeSlots?.length) {
      card.freeSlots.forEach((slot, index) => {
        result.push({
          token: capitalize(letterToTokenMap[slot] ?? slot),
          unlocked: true,
          key: `free-${cardId}-${index}`,
          slotType: slot // Add the original slot type
        });
      });
    }
  });

  return result;
});

const titleSlots = computed(() => {
  const pilot = currentPilot.value;
  if (!pilot) return [];

  const result = [];

  Object.entries(pilot.slotCards).forEach(([slotKey, cardId]) => {
    const card = cards.find((c) => c.id === cardId);
    if (card?.slots?.length) {
      card.slots.forEach((slot, index) => {
        result.push({
          token: capitalize(letterToTokenMap[slot] ?? slot),
          unlocked: true,
          key: `title-${cardId}-${index}`,
          slotType: slot // Add the original slot type
        });
      });
    }
  });

  return result;
});

const allFixedSlots = computed(() => {
  return [...fixedSlots.value, ...freeSlots.value, ...titleSlots.value];
});
</script>
