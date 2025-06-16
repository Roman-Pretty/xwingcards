<template>
  <div class="flex flex-row gap-4 flex-wrap mb-4 min-h-[20vh]">
    <!-- Fixed slots -->
    <Slot
      v-for="(slot, index) in fixedSlots"
      :key="'fixed-' + index"
      :options="[slot]"
      :unlocked="true"
      :card="null"
    />

    <!-- Optional slots -->
    <Slot
      v-for="(opts, index) in optionalSlots"
      :key="'optional-' + index"
      :options="opts"
      :unlocked="true"
      :card="null"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePilotStore } from '../stores/pilotStore';
import Slot from './Slot.vue';
import { letterToTokenMap } from '../utils/mappings';
import classData from '../data/classes.json';

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
    if (r.optionalslots) optional.push(...r.optionalslots);
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
    .filter((s) => !['x', 'E', 'F'].includes(s))
    .map((letter) => {
      const token = letterToTokenMap[letter];
      return token ? capitalize(token) : letter;
    });
});

// Optional slots rendered as individual dropdowns
const optionalSlots = computed(() => {
  const rank = currentPilot.value?.rank ?? 1;
  const unlockedRanks = pilotClassData.value.ranks?.filter((r) => r.rank <= rank) ?? [];

  return unlockedRanks
    .filter((r) => Array.isArray(r.optionalslots))
    .map((r) =>
      r.optionalslots
        .map((letter) => {
          const token = letterToTokenMap[letter];
          return token ? capitalize(token) : letter;
        })
    );
});


function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
</script>
