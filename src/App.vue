<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-row gap-4 inria-sans-regular">
    <!-- Left Side: Level -->
    <div
      class="flex-1 border-2 border-neutral-700 rounded-2xl p-4 flex flex-col justify-between text-white overflow-hidden">
      <div class="flex flex-col justify-between h-full">
        <div class="flex-1">
          <div class="flex flex-row justify-between w-full items-center">
            <h2 class="text-lg font-bold mb-4"></h2>
            <PilotTabs />
          </div>
          <div class="flex flex-row w-full justify-center items-center">
            <div class="flex flex-row">
              <span class="font-[xwing]  text-[18rem] -mt-32" :style="{ color: `${color}` }">{{ icon }}</span>
              <div class="flex flex-col justify-center pb-10  flex-wrap ml-4">
                <span class="text-white/30">{{ store.currentPilot?.name }}</span>
                <span class=" text-7xl" :style="{ color: `${color}` }">The {{ store.currentPilot?.class }}</span>
                <div class="flex-row flex-wrap justify-start font-[xwing] text-4xl">
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">m</span>
                  <span class="text-white/80">M</span>
                  <span class="text-white/80">P</span>
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">A</span>
                  <span class="text-white/80">A</span>
                </div>
                <div class="flex flex-row gap-2 mt-2">
                  <span class="text-white/30 text-2xl">XP: {{ store.currentPilot?.xp }}</span>
                </div>
              </div>
            </div>
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
import classData from './data/classes.json'
import { computed } from 'vue'

const store = usePilotStore()
const { all } = useCardFilter()
const complete = all()

const icon = computed(() => {
  return classData[store.currentPilot?.class]?.icon || ''
})

const color = computed(() => {
  return classData[store.currentPilot?.class]?.color || 'amber'
})

const select = (card) => {
  store.selectCard(card.id, { unique: card.unique })
}
</script>
