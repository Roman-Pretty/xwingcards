<!-- src/components/Slots.vue -->
<template>
  <div class="flex flex-row gap-4 flex-wrap mb-4 min-h-[20vh]">
    <!-- Fixed slots -->
    <Slot v-for="slot in allFixedSlots" :key="slot.key" :slot-key="slot.key" :options="[slot.token]"
      :unlocked="slot.unlocked" :xpCost="slot.xpCost" :isLocked="slot.isLocked"
      :card="currentPilot?.slotCards[slot.key] || null" 
      :currently-dragged-card="props.currentlyDraggedCard"
      @card-drop="handleCardDrop(slot.key, $event)"
      @slot-switch="handleSlotSwitch(slot.key, $event)" @purchase-slot="openPurchaseModal(slot.key, slot.xpCost)" />


    <!-- Optional slots -->
    <Slot v-for="(opts, index) in optionalSlots" :key="'optional-' + index" :slot-key="'optional-' + index"
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
</template>

<script setup>
import { computed, ref } from "vue";
import { usePilotStore } from "../stores/PilotStore";
import Slot from "./Slot.vue";
import SlotPurchaseModal from "./ui/SlotPurchaseModal.vue";
import FactionSelectionModal from "./ui/FactionSelectionModal.vue";
import { letterToTokenMap } from "../utils/mappings";
import classData from "../data/classes.json";
import cards from "../data/cards.js";

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

// Component refs
const slotPurchaseModal = ref(null);
const factionSelectionModal = ref(null);

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
  
  const { slotKey, cardId } = pendingFactionCard.value;
  const success = store.assignCardToSlot(slotKey, cardId);
  if (success !== false) {
    store.equipCardWithFaction(cardId, faction);
  }
  
  pendingFactionCard.value = null;
}

function cancelFactionSelection() {
  pendingFactionCard.value = null;
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
      key: `fixed-${index}`
    });
  });

  // Add locked slots with purchase cost
  locked.forEach((lockedSlot, index) => {
    const key = `${ship}-${index}`;
    const token = capitalize(letterToTokenMap[lockedSlot.slot] ?? lockedSlot.slot);
    processedSlots.push({
      token,
      unlocked: pilotUnlocked.includes(key),
      xpCost: lockedSlot.xp,
      key,
      isLocked: true,
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

  // Check if card requires faction selection
  if (store.requiresFactionSelection(cardId)) {
    const availableFactions = store.getAvailableFactionsForCard(cardId);
    console.log('Slots - availableFactions for', cardId, ':', availableFactions);
    
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
      console.log('Setting up pendingFactionCard:', {
        name: card?.name,
        cardId: cardId,
        factions: availableFactions
      });
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
        });
      });
    }
  });

  return result;
});

const allFixedSlots = computed(() => {
  return [...fixedSlots.value, ...freeSlots.value];
});
</script>
