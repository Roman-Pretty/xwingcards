<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-row gap-4 inria-sans-regular">
    <!-- Left Side: Level -->
    <div
      class="flex-1 border-2 border-neutral-700 rounded-2xl p-4 flex flex-col justify-between text-white overflow-hidden">
      <div class="flex flex-col justify-between h-full">
        <div class="flex-1">
          <div class="flex flex-row justify-between w-full items-center">
            <div class="flex flex-row gap-4">
            <div class="text-xl flex flex-row gap-2 items-center cursor-default">
              <span class="font-[xwing] text-3xl -mt-2" :style="{ color: color }">{{ icon }}</span>
              <span class="font-bold" :style="{ color: color }">The {{ store.currentPilot?.class }}</span>
            </div>
            <div class="text-xl flex flex-row  items-center cursor-default text-yellow-300">
              <span class="font-[xwing] text-3xl -mt-2">Ì</span>
              <span class="font-bold">{{ store.currentPilot?.xp }}</span>
            </div>
            </div>
            <div class="flex flex-row-reverse gap-2 items-center">
              <span class="btn">Add XP</span>
              <PilotTabs />
            </div>
            
          </div>

        </div>

        <div class="flex flex-col w-full mt-auto overflow-auto">
          <div>
            <h2 class="text-lg mb-4">Loadout</h2>
            <Slots />
          </div>
          <div>
            <h2 class="text-lg mb-4">Ships</h2>
            <Ships />
          </div>
          <div>
            <h2 class="text-lg mb-4">Rank</h2>
            <RankList />
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Card UI -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="p-4 bg-neutral-800 flex justify-between items-center flex-row">
        <div class="flex items-center gap-4">
          <button class="btn btn-warning">Deck</button>
          <button class="btn btn-neutral">Store</button>
        </div>
        <div class="flex items-center gap-2">
          <MenuIcon i="A" />
        </div>
      </div>

      <!-- Scrollable Cards List -->
      <section class="flex-1 overflow-y-auto p-4 flex flex-row flex-wrap gap-6 justify-center">
        <Card v-for="card in complete" :key="card.id" v-bind="card" :draggable="!store.isCardTaken(card.id)"
          @dragstart="onDragStart(card.id, $event)" @click="select(card)" :class="{
            'opacity-50 cursor-not-allowed': store.isCardTaken(card.id),
            'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out':
              !store.isCardTaken(card.id),
          }" />

      </section>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import RankList from './components/RankList.vue'
import Card from './components/Card.vue'
import MenuIcon from './components/MenuIcon.vue'
import PilotTabs from './components/PilotTabs.vue'
import { usePilotStore } from './stores/pilotStore'
import { useCardFilter } from './composables/useCardFilter'
import Ships from './components/Ships.vue'
import Slots from './components/Slots.vue'
import classData from './data/classes.json'

const store = usePilotStore()
const complete = computed(() => store.ownedCards);

// Use direct access of store.currentPilot.class for reactivity
const icon = computed(() => {
  return classData[store.currentPilot?.class]?.icon || ''
})

const color = computed(() => {
  return classData[store.currentPilot?.class]?.color || 'amber'
})

const select = (card) => {
  store.selectCard(card.id, { unique: card.unique })
}

function onDragStart(cardId, event) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', cardId)
}
</script>