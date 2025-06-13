<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-row gap-4 inria-sans-regular">
    <!-- Left Side: Level -->
    <div
      class="flex-1 border-2 border-neutral-700 rounded-2xl p-4 flex flex-col justify-between text-white overflow-hidden">
      <div class="flex flex-col justify-between h-full">
        <div class="flex-1">
          <div class="flex flex-row justify-between w-full items-center">
            <h2 class="text-lg font-bold mb-4">Hand</h2>
            <PilotTabs />
          </div>
        </div>
        <div>
          <h2 class="text-lg font-bold mb-4">Ships</h2>
          <Ships />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-4">Rank</h2>
          <RankList />
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
        <div class="flex items-center gap-2 font-[xwing]">
          <MenuIcon i="A" />
          <MenuIcon i="m" />
          <MenuIcon i="M" />
          <MenuIcon i="P" />
          <MenuIcon i="C" />
          <MenuIcon i="S" />
          <MenuIcon i="X" />
          <MenuIcon i="Z" />
          <MenuIcon i="W" />
          <MenuIcon i="I" />
          <MenuIcon i="n" />
          <MenuIcon i="t" />
        </div>
      </div>

      <!-- Scrollable Cards List -->
      <div class="flex-1 overflow-y-auto p-4 flex flex-row flex-wrap gap-6 justify-center">
        <Card v-for="card in complete" :key="card.id" v-bind="card" @click="select(card)" />
      </div>
    </div>
  </main>
</template>

<script setup>
import RankList from './components/RankList.vue'
import Card from './components/Card.vue'
import MenuIcon from './components/MenuIcon.vue'
import PilotTabs from './components/PilotTabs.vue'
import { usePilotStore } from './stores/pilotStore'
import { useCardFilter } from './composables/useCardFilter'
import Ships from './components/Ships.vue'

const store = usePilotStore()
const { all } = useCardFilter()
const complete = all()

const select = (card) => {
  store.selectCard(card.id, { unique: card.unique })
}
</script>
