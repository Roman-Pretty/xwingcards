<!-- src/components/Slots.vue -->
<template>
  <div class="flex flex-row gap-4 flex-wrap mb-4 min-h-[20vh]">
    <!-- Fixed slots -->
    <Slot
      v-for="(slot, index) in fixedSlots"
      :key="'fixed-' + index"
      :slot-key="'fixed-' + index"
      :options="[slot]"
      :unlocked="true"
      :card="currentPilot?.slotCards['fixed-' + index] || null"
      @card-drop="handleCardDrop('fixed-' + index, $event)"
      @slot-switch="handleSlotSwitch('fixed-' + index, $event)"
    />

    <!-- Optional slots -->
    <Slot
      v-for="(opts, index) in optionalSlots"
      :key="'optional-' + index"
      :slot-key="'optional-' + index"
      :options="opts"
      :unlocked="true"
      :card="currentPilot?.slotCards['optional-' + index] || null"
      @card-drop="handleCardDrop('optional-' + index, $event)"
      @slot-switch="handleSlotSwitch('optional-' + index, $event)"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePilotStore } from "../stores/pilotStore";
import Slot from "./Slot.vue";
import { letterToTokenMap } from "../utils/mappings";
import classData from "../data/classes.json";

const store = usePilotStore();

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
    if (r.optionalslots) optional.push(r.optionalslots);
  });

  return {
    fixed,
    optional,
  };
});

// Combine ship slots + rank fixed slots
const fixedSlots = computed(() => {
  const allFixed = [...shipSlots.value, ...rankSlots.value.fixed];
  return allFixed
    .filter((s) => !["x", "E", "F"].includes(s))
    .map((letter) => {
      const token = letterToTokenMap[letter];
      return token ? capitalize(token) : letter;
    });
});

// Optional slots as array of arrays (each inner array are options for that optional slot)
const optionalSlots = computed(() => {
  // Each element in rankSlots.value.optional is itself an array of slot letters for that optional slot
  return rankSlots.value.optional.map((slotGroup) =>
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
  store.assignCardToSlot(slotKey, cardId);
}

// Handle slot type switch event emitted from Slot component
function handleSlotSwitch(slotKey, newOption) {
  // Update the current pilot’s slot type selection in the store
  store.changeSlotOption(slotKey, newOption);
}
</script>
