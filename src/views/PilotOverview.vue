<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-col gap-4 inria-sans-regular overflow-hidden">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-bold text-white">Pilot Overview</h1>
      <button class="btn btn-ghost text-white" @click="$router.push('/dashboard')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
        Close
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <!-- Kill Tracker Card - Full Width -->
      <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Ship Kill Tracker</h2>
          
          <!-- Current Pilot Info -->
          <div class="flex items-center gap-4 text-white">
            <div class="flex items-center gap-2">
              <span class="font-[xwing] text-2xl -mt-1" :style="{ color: getClassColor(store.currentPilot?.class) }">
                {{ getClassIcon(store.currentPilot?.class) }}
              </span>
              <span class="font-bold">{{ store.currentPilot?.name }}</span>
            </div>
            <div class="text-sm text-gray-400">
              Rank {{ store.currentPilot?.rank }}
            </div>
          </div>
        </div>
        
        <!-- Ship Kill Grid -->
        <div class="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 md:gap-4 flex-1 overflow-y-auto">
          <div v-for="ship in allEnemies" :key="ship.icon" 
               class="bg-neutral-700 border border-neutral-600 rounded-lg p-1 md:p-4 flex flex-col items-center justify-between min-h-[80px] md:min-h-[120px]">
            
            <!-- Ship Icon -->
            <div class="flex flex-col items-center gap-1 md:gap-2 flex-1 w-full overflow-hidden">
              <!-- Mobile: Compact vertical layout -->
              <div class="flex md:hidden flex-col items-center gap-1 w-full">
                <span class="font-[ships] text-lg text-gray-300">{{ ship.icon }}</span>
                <span class="text-[8px] text-gray-400 text-center leading-none px-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">{{ ship.ship }}</span>
              </div>
              <!-- Desktop: Icon and text stacked -->
              <div class="hidden md:flex flex-col items-center gap-2">
                <span class="font-[ships] text-4xl text-gray-300">{{ ship.icon }}</span>
                <span class="text-xs text-gray-400 text-center leading-tight">{{ ship.ship }}</span>
              </div>
            </div>
            
            <!-- Kill Counter -->
            <div class="flex items-center justify-between w-full mt-1 md:mt-4">
              <button @click="decrementKills(ship.icon)" 
                      :disabled="getKillCount(ship.icon) === 0"
                      class="btn btn-xs md:btn-sm btn-circle btn-ghost text-red-400 hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed p-0 min-h-6 h-6 w-6 md:min-h-8 md:h-8 md:w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:w-4 md:h-4">
                  <path d="M5 12h14"/>
                </svg>
              </button>
              
              <div class="flex flex-col items-center">
                <span class="text-sm md:text-2xl font-bold text-white">{{ getKillCount(ship.icon) }}</span>
                <span class="text-[7px] md:text-xs text-gray-500 leading-none">kills</span>
              </div>
              
              <button @click="incrementKills(ship.icon)" 
                      class="btn btn-xs md:btn-sm btn-circle btn-ghost text-green-400 hover:bg-green-900/20 p-0 min-h-6 h-6 w-6 md:min-h-8 md:h-8 md:w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="md:w-4 md:h-4">
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Statistics Summary -->
        <div class="mt-6 pt-4 border-t border-neutral-600">
          <div class="flex justify-center items-center gap-8 text-center">
            <div>
              <div class="text-3xl font-bold text-yellow-400">{{ totalKills }}</div>
              <div class="text-sm text-gray-400">Total Kills</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-400">{{ uniqueShipsKilled }}</div>
              <div class="text-sm text-gray-400">Ship Types Killed</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-400">{{ favoriteTarget.ship || 'None' }}</div>
              <div class="text-sm text-gray-400">Favorite Target ({{ favoriteTarget.kills }} kills)</div>
            </div>
          </div>
        </div>

        <!-- Achievement-style Milestones -->
        <div class="mt-4 pt-4 border-t border-neutral-600">
          <h3 class="text-lg font-semibold text-white mb-3">Milestones</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="milestone in milestones" :key="milestone.name"
                 :class="[
                   'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                   milestone.achieved 
                     ? 'bg-yellow-600 text-yellow-100 border border-yellow-500' 
                     : 'bg-gray-700 text-gray-400 border border-gray-600'
                 ]">
              {{ milestone.name }}
              <span v-if="!milestone.achieved" class="ml-2 opacity-70">
                ({{ milestone.progress }}/{{ milestone.target }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { usePilotStore } from '../stores/PilotStore'
import classData from '../data/classes.json'

const store = usePilotStore()

// Manually defined array of enemy ships to track
const allEnemies = [
  { ship: "TIE Fighter", icon: "F" },
  { ship: "TIE Interceptor", icon: "I" },
  { ship: "TIE Advanced", icon: "A" },
  { ship: "TIE Bomber", icon: "B" },
  { ship: "TIE Defender", icon: "D" },
  { ship: "TIE Phantom", icon: "P" },
  { ship: "TIE Striker", icon: "T" },
  { ship: "TIE Reaper", icon: "V" },
  { ship: "TIE Advanced Prototype", icon: "R" },
  { ship: "TIE Brute", icon: "J" },
  { ship: "TIE Aggressor", icon: "`" },
  { ship: "TIE Punisher", icon: "N" },
  { ship: "Alpha-class Star Wing", icon: "&" },
  { ship: "Lambda-class Shuttle", icon: "l" },
  { ship: "VT-49 Decimator", icon: "d" },
  { ship: "Defense Tower", icon: "~" },
  { ship: "AT-AT", icon: "|" },
  { ship: "AT-ST", icon: "}" },
  
]

// Kill tracking - stored per pilot
const getKillCount = (shipIcon) => {
  if (!store.currentPilot?.shipKills) return 0
  return store.currentPilot.shipKills[shipIcon] || 0
}

const incrementKills = (shipIcon) => {
  store.incrementShipKills(shipIcon)
}

const decrementKills = (shipIcon) => {
  store.decrementShipKills(shipIcon)
}

// Statistics
const totalKills = computed(() => {
  if (!store.currentPilot?.shipKills) return 0
  return Object.values(store.currentPilot.shipKills).reduce((sum, kills) => sum + kills, 0)
})

const uniqueShipsKilled = computed(() => {
  if (!store.currentPilot?.shipKills) return 0
  return Object.values(store.currentPilot.shipKills).filter(kills => kills > 0).length
})

const favoriteTarget = computed(() => {
  if (!store.currentPilot?.shipKills) return { ship: null, kills: 0 }
  
  let maxKills = 0
  let favoriteShipIcon = null
  
  Object.entries(store.currentPilot.shipKills).forEach(([shipIcon, kills]) => {
    if (kills > maxKills) {
      maxKills = kills
      favoriteShipIcon = shipIcon
    }
  })
  
  if (!favoriteShipIcon) return { ship: null, kills: 0 }
  
  const ship = allEnemies.find(s => s.icon === favoriteShipIcon)
  return { ship: ship?.ship || favoriteShipIcon, kills: maxKills }
})

// Milestones/Achievements
const milestones = computed(() => {
  const total = totalKills.value
  const unique = uniqueShipsKilled.value
  
  return [
    {
      name: "First Blood",
      target: 1,
      progress: Math.min(total, 1),
      achieved: total >= 1
    },
    {
      name: "Ace Pilot",
      target: 5,
      progress: Math.min(total, 5),
      achieved: total >= 5
    },
    {
      name: "Squadron Killer",
      target: 10,
      progress: Math.min(total, 10),
      achieved: total >= 10
    },
    {
      name: "Wing Commander",
      target: 25,
      progress: Math.min(total, 25),
      achieved: total >= 25
    },
    {
      name: "Fleet Destroyer",
      target: 50,
      progress: Math.min(total, 50),
      achieved: total >= 50
    },
    {
      name: "Specialist",
      target: 3,
      progress: Math.min(unique, 3),
      achieved: unique >= 3
    },
    {
      name: "Versatile Hunter",
      target: 6,
      progress: Math.min(unique, 6),
      achieved: unique >= 6
    },
    {
      name: "Master of All",
      target: 10,
      progress: Math.min(unique, 10),
      achieved: unique >= 10
    }
  ]
})

// Helper functions
const getClassIcon = (className) => {
  return classData[className]?.icon || '?'
}

const getClassColor = (className) => {
  return classData[className]?.color || '#a8a8a8'
}
</script>
