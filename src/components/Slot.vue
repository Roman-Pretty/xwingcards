<template>
  <div class="relative group transition-colors duration-200 rounded flex-1 bg-neutral-800 cursor-default" :class="{
    'opacity-50 pointer-events-none': !unlocked,
    'bg-yellow-700 outline-2 outline-yellow-500 shadow-[0_0_8px_2px_rgba(204,153,0,0.5)]': props.card
  }" tabindex="0" ref="slotRef" @dragover.prevent="onDragOver" @drop.prevent="onDrop">
    <!-- Remove button overlay -->
    <div v-if="props.card"
      class="absolute inset-0 bg-red-700/80 cursor-pointer text-white text-center flex items-center justify-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-10"
      @click.stop="clearCard">
      Unequip Card
    </div>

    <!-- Slot content -->
    <div class="flex flex-row items-center gap-2 p-3 rounded relative z-0 h-full">
      <div class="flex flex-row gap-1 items-center">
        <span v-for="option in props.options" :key="option"
          class="font-[xwing] text-5xl font-extralight opacity-60 -mt-3.5 select-none">
          {{ tokenToLetterMap[option.toLowerCase()] || '?' }}
        </span>
      </div>
      <div class="flex flex-col">
        <h2 class="text-white truncate">
          {{ displayName }}
        </h2>
        <span class="text-sm text-white/80 select-none">
          {{ cardName || "Empty" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import cards from "../data/cards.json";
import { tokenToLetterMap } from "../utils/mappings";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  unlocked: {
    type: Boolean,
    required: true,
  },
  card: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["card-drop"]);

const cardName = computed(() => {
  if (!props.card) return "Empty";
  const found = cards.find((c) => c.id === props.card);
  return found ? found.name : "Unknown";
});

const displayName = computed(() => {
  return props.options.join(" or ");
});

function onDragOver(event) {
  if (!props.unlocked) return;

  const cardId = event.dataTransfer.getData("text/plain");
  if (!cardId) return;

  const draggedCard = cards.find(c => c.id === cardId);
  if (!draggedCard) {
    event.dataTransfer.dropEffect = "none";
    return;
  }

  const allowed = props.options.some(opt =>
    opt.toLowerCase() === draggedCard.type.toLowerCase()
  );

  event.dataTransfer.dropEffect = allowed ? "move" : "none";
}

function onDrop(event) {
  if (!props.unlocked) return;

  const cardId = event.dataTransfer.getData("text/plain");
  if (!cardId) return;

  const droppedCard = cards.find(c => c.id === cardId);
  if (!droppedCard) return;

  const allowed = props.options.some(opt =>
    opt.toLowerCase() === droppedCard.type.toLowerCase()
  );

  if (!allowed) return;

  emit("card-drop", cardId);
}

function clearCard() {
  if (!props.unlocked) return;
  emit("card-drop", "");
}
</script>

<style scoped>
/* No extra styles needed */
</style>
