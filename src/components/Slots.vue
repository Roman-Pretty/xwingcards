<!-- src/components/Slots.vue -->
<template>
  <dialog id="confirm_slot_modal" class="modal">
    <div class="modal-box bg-neutral-800 text-white">
      <h3 class="text-lg font-bold mb-2">Unlock Slot</h3>
      <p class="mb-4">
        Spend <span class="font-[xwing] text-lg">Ì</span>{{ selectedSlotXP }} to unlock this slot?
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button type="button" class="btn" @click="confirmSlotPurchase">Confirm</button>
          <button class="btn btn-neutral" @click="cancelSlotPurchase">Cancel</button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="flex flex-row gap-4 flex-wrap mb-4 min-h-[20vh]">
    <!-- Fixed slots -->
    <Slot v-for="slot in fixedSlots" :key="slot.key" :slot-key="slot.key" :options="[slot.token]"
      :unlocked="slot.unlocked" :xpCost="slot.xpCost" :isLocked="slot.isLocked"
      :card="currentPilot?.slotCards[slot.key] || null" @card-drop="handleCardDrop(slot.key, $event)"
      @slot-switch="handleSlotSwitch(slot.key, $event)" @purchase-slot="openPurchaseModal(slot.key, slot.xpCost)" />


    <!-- Optional slots -->
    <Slot v-for="(opts, index) in optionalSlots" :key="'optional-' + index" :slot-key="'optional-' + index"
      :options="opts" :unlocked="true" :card="currentPilot?.slotCards['optional-' + index] || null"
      @card-drop="handleCardDrop('optional-' + index, $event)"
      @slot-switch="handleSlotSwitch('optional-' + index, $event)" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePilotStore } from "../stores/pilotStore";
import Slot from "./Slot.vue";
import { letterToTokenMap } from "../utils/mappings";
import classData from "../data/classes.json";

const store = usePilotStore();

const selectedSlotKey = ref(null)
const selectedSlotXP = ref(0)

function openPurchaseModal(slotKey, xp) {
  selectedSlotKey.value = slotKey
  selectedSlotXP.value = xp

  const modal = document.getElementById('confirm_slot_modal')
  if (modal?.showModal) modal.showModal()
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

  closePurchaseModal();
}


function cancelSlotPurchase() {
  closePurchaseModal()
}

function closePurchaseModal() {
  const modal = document.getElementById('confirm_slot_modal')
  if (modal?.close) modal.close()
}

const currentPilot = computed(() => store.currentPilot);

const lockedSlots = computed(() => {
  const ship = currentPilot.value?.selectedShip;
  const shipData = pilotClassData.value.ships?.find((s) => s.ship === ship);
  if (!shipData?.lockedSlots) return [];

  return shipData.lockedSlots.map((entry, index) => ({
    type: letterToTokenMap[entry.slot] ?? entry.slot,
    xp: entry.xp,
    unlocked: currentPilot.value?.lockedSlotUnlocks?.includes(index),
    index,
  }));
});

function handleLockedSlotClick(slot) {
  console.log("Clicked locked slot:", slot);

  if (slot.unlocked) return;

  const confirmed = confirm(`Unlock this slot for ${slot.xp} XP?`);
  if (!confirmed) return;

  const pilot = store.currentPilot;
  if (!pilot || pilot.xp < slot.xp) {
    alert("Not enough XP!");
    return;
  }

  pilot.xp -= slot.xp;
  pilot.lockedSlotUnlocks.push(slot.index);
}

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
  store.assignCardToSlot(slotKey, cardId);
}

// Handle slot type switch event emitted from Slot component
function handleSlotSwitch(slotKey, newOption) {
  // Update the current pilot’s slot type selection in the store
  store.changeSlotOption(slotKey, newOption);
}
</script>
