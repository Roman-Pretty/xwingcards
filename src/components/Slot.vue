<template>
  <!-- Main Slot Container -->
<div
  class="relative group transition-all duration-150 rounded flex-1 cursor-default flex border border-neutral-600"
  :class="{
    'opacity-50 hover:scale-105 transition-transform duration-300 bg-neutral-800': !unlocked,
    'bg-yellow-700 shadow-[0_0_8px_2px_rgba(204,153,0,0.5)] border-yellow-500 hover:border-transparent': props.card,
    'bg-neutral-800': !props.card && unlocked,
    'border-dashed !border-blue-400 bg-blue-900/10 shadow-[0_0_4px_1px_rgba(59,130,246,0.2)]': isDraggedOver && canAcceptDrop
  }"
  tabindex="0"
  ref="slotRef"
  @dragover.prevent="onDragOver"
  @dragenter.prevent="onDragEnter"
  @dragleave.prevent="onDragLeave"
  @drop.prevent="onDrop"
>
  <!-- Purchase Overlay -->
  <div
    v-if="isLocked && !unlocked"
    class="absolute inset-0 bg-black/70 hover:bg-black/80 flex items-center justify-center z-20 cursor-pointer rounded"
    @click.stop="emit('purchase-slot')"
  >
    <div class="text-white text-center">
      <div class="text-xl">
        <span class="font-[xwing] text-2xl">Ì</span> <span>{{ xpCost }}</span>
      </div>
      <div class="text-xs mt-1">Click to unlock</div>
    </div>
  </div>

  <!-- Content Wrapper (disabled when locked) -->
  <div :class="{ 'pointer-events-none': !unlocked }">
    <!-- Remove button -->
    <div
      v-if="props.card"
      class="absolute inset-0 bg-red-700/80  cursor-pointer text-white text-center flex items-center justify-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-10"
      @click.stop="clearCard"
    >
      Unequip Card
    </div>

    <!-- Slot Content -->
    <div class="flex flex-row items-center gap-2 p-3 rounded relative z-0 h-full">
      <div class="flex flex-row gap-1 items-center">
        <span
          v-for="option in props.options"
          :key="option"
          class="font-[xwing] text-5xl font-extralight opacity-60 -mt-3.5 select-none"
        >
          {{ tokenToLetterMap[option.toLowerCase()] || '?' }}
        </span>
      </div>
      <div class="flex flex-col">
        <h2 class="text-white truncate">{{ displayName }}</h2>
        <span class="text-sm text-white/80 select-none truncate">
          {{ cardName || "Empty" }}
        </span>
      </div>
    </div>
  </div>
</div>

</template>


<script setup>
import { computed, ref } from "vue";
import cards from "../data/cards.json";
import { tokenToLetterMap } from "../utils/mappings";

const props = defineProps({
  options: Array,
  unlocked: Boolean,
  card: String,
  xpCost: Number,
  isLocked: Boolean,
  currentlyDraggedCard: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["card-drop"]);

// Drag state
const isDraggedOver = ref(false);
const canAcceptDrop = computed(() => {
  if (!props.currentlyDraggedCard || !props.unlocked) return false;
  
  return props.options.some(opt =>
    opt.toLowerCase() === props.currentlyDraggedCard.type.toLowerCase()
  );
});

const cardName = computed(() => {
  if (!props.card) return "Empty";
  const found = cards.find((c) => c.id === props.card);
  return found ? found.name : "Unknown";
});

const displayName = computed(() => {
  return props.options.join(" or ");
});

function onDragEnter(event) {
  if (!props.unlocked || !props.currentlyDraggedCard) return;
  
  // Only show visual feedback if the card can be accepted
  if (canAcceptDrop.value) {
    isDraggedOver.value = true;
  }
}

function onDragLeave(event) {
  // Only reset if we're leaving the slot entirely (not just moving to a child element)
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDraggedOver.value = false;
  }
}

function onDragOver(event) {
  if (!props.unlocked || !props.currentlyDraggedCard) return;

  event.dataTransfer.dropEffect = canAcceptDrop.value ? "move" : "none";
}

function onDrop(event) {
  if (!props.unlocked) return;

  // Reset drag states
  isDraggedOver.value = false;

  const cardId = event.dataTransfer.getData("text/plain");
  if (!cardId || !props.currentlyDraggedCard) return;

  if (!canAcceptDrop.value) return;

  emit("card-drop", cardId);
}

function clearCard() {
  if (!props.unlocked) return;
  emit("card-drop", "");
}
</script>
