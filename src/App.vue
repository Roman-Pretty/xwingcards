<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-row gap-4 inria-sans-regular overflow-hidden">
    <!-- XP Modal -->
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box bg-neutral-800 text-white">
        <h3 class="text-lg font-bold mb-2">Add XP to {{ store.currentPilot?.name }}</h3>
        <input v-model.number="xpToAdd" type="number" min="1" class="input input-bordered w-full mb-4 text-white"
          placeholder="Enter XP amount" />
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button type="button" class="btn" @click="confirmAddXP">Confirm</button>
            <button class="btn btn-neutral">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>

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
              <div class="text-xl flex flex-row items-center cursor-default text-yellow-300">
                <span class="font-[xwing] text-3xl -mt-2">Ì</span>
                <span class="font-bold">{{ store.currentPilot?.xp }}</span>
              </div>
            </div>
            <div class="flex flex-row-reverse gap-2 items-center">
              <button class="btn" @click="openModal">Add XP</button>
              <PilotTabs />
            </div>
          </div>
        </div>

        <!-- Bottom Content -->
        <div class="flex flex-col w-full mt-auto">
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
      <div class="p-4 border-2 border-neutral-700 rounded-2xl flex justify-between items-center flex-row">
        <div class="flex items-center gap-4">
          <button class="btn"
            :class="{ 'btn-warning btn-active': activeTab === 'deck', 'btn-neutral': activeTab !== 'deck' }"
            @click="activeTab = 'deck'">
            Deck
          </button>
          <button class="btn"
            :class="{ 'btn-warning btn-active': activeTab === 'store', 'btn-neutral': activeTab !== 'store' }"
            @click="activeTab = 'store'">
            Store
          </button>
        </div>
        <div class="flex items-center gap-2">
          <MenuIcon i="A" />
        </div>
      </div>

      <!-- Scrollable Cards List -->
      <section class="flex-1 overflow-y-auto p-4 flex flex-row flex-wrap gap-6 justify-center pb-16 pt-8">
        <component v-for="(card, index) in cardsToShow" :is="activeTab === 'store' ? StoreCard : Card"
          :key="card?.id || card?.name || index" v-bind="card"
          :draggable="activeTab === 'deck' && !store.isCardTaken(card.id)" @dragstart="onDragStart(card.id, $event)"
          @click="select(card)" :class="{
            'opacity-50 cursor-not-allowed': store.isCardTaken(card.id),
            'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out': !store.isCardTaken(card.id) && activeTab === 'deck',
            'cursor-default': activeTab !== 'deck'
          }" />
      </section>

    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import RankList from './components/RankList.vue'
import Card from './components/Card.vue'
import MenuIcon from './components/MenuIcon.vue'
import PilotTabs from './components/PilotTabs.vue'
import Ships from './components/Ships.vue'
import Slots from './components/Slots.vue'
import classData from './data/classes.json'
import { usePilotStore } from './stores/pilotStore'
import { useCardFilter } from './composables/useCardFilter'
import StoreCard from './components/StoreCard.vue'

components: {
  Card,
    StoreCard
}

const store = usePilotStore()
const { all, byAllowedFactions } = useCardFilter()

// UI state
const activeTab = ref('deck')

const cardsToShow = computed(() => {
  if (activeTab.value === 'deck') return store.ownedCards

  const className = store.currentPilot?.class
  const classInfo = classData[className]
  const allowedFactions = classInfo?.factions?.map(f => f.toLowerCase()) || []

  return byAllowedFactions(allowedFactions)
})


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
  if (activeTab.value !== 'deck') {
    event.preventDefault()
    return
  }
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', cardId)
}

// XP Modal Logic
const xpToAdd = ref(null)

function openModal() {
  const modal = document.getElementById('my_modal_1')
  if (modal?.showModal) {
    modal.showModal()
  }
}

function confirmAddXP() {
  if (xpToAdd.value > 0) {
    store.currentPilot.xp += xpToAdd.value
    const modal = document.getElementById('my_modal_1')
    modal?.close()
    xpToAdd.value = null
  }
}
</script>
