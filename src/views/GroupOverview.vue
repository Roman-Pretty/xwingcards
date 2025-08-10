<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-col gap-4 inria-sans-regular overflow-hidden">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-2xl font-bold text-white">Group Overview</h1>
      <button class="btn btn-ghost text-white" @click="$router.push('/dashboard')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
        Close
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <!-- AI Difficulty Adjustments Card - Full Width -->
      <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">AI Difficulty Adjustments</h2>
          
          <!-- Pilot Selection Dropdown -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button"
              class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center">
              {{ selectedPilots.length }} of {{ store.pilots.length }} pilots
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-chevron-down">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <div tabindex="0"
              class="dropdown-content z-10 h-[40vh] overflow-auto p-2 rounded-box shadow-md text-xs text-white bg-neutral-950 flex flex-col gap-1 w-80">
              <div class="text-sm cursor-default text-white mb-2 px-2">Include in Average Rank Calculation:</div>
              
              <!-- Pilot selection buttons -->
              <label v-for="pilot in store.pilots" :key="pilot.id" 
                     class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-neutral-700 transition-colors duration-150">
                <input type="checkbox" 
                       :checked="selectedPilotIds.includes(pilot.id)"
                       @change="togglePilot(pilot.id)"
                       class="checkbox checkbox-xs checkbox-primary">
                <span class="font-[xwing] text-xl -mt-1" :style="{ color: getClassColor(pilot.class) }">
                  {{ getClassIcon(pilot.class) }}
                </span>
                <span class="flex-1 truncate text-md">{{ pilot.name }}</span>
                <span class="text-md text-gray-400">Rank {{ pilot.rank }}</span>
              </label>
              
              <!-- Action buttons -->
              <div class="flex justify-between items-center mt-2 pt-2 border-t border-neutral-700 px-2">
                <div class="text-xs text-gray-400 cursor-default">
                  {{ selectedPilots.length }} selected
                </div>
                <div class="flex gap-1">
                  <button @click="selectAllPilots" class="btn btn-xs btn-ghost text-gray-400 hover:text-white">
                    All
                  </button>
                  <button @click="clearAllPilots" class="btn btn-xs btn-ghost text-gray-400 hover:text-white">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1">
          <!-- Standard AI -->
          <div class="bg-green-900/30 border border-green-700 rounded-lg p-4 flex flex-col"
               :class="{ 'opacity-50': averageRank >= 3 }">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-green-400">Standard AI</h3>
              <span class="text-xs px-2 py-1 rounded" 
                    :class="averageRank < 3 ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'">
                {{ averageRank < 3 ? 'ACTIVE' : 'INACTIVE' }}
              </span>
            </div>
            <p class="text-sm text-green-200 flex-1">AI operates at normal difficulty levels. Base game experience.</p>
          </div>

          <!-- Enhanced AI (Rank 3+) -->
          <div class="rounded-lg p-4 border flex flex-col"
               :class="averageRank >= 3 ? 
                 'bg-green-900/30 border-green-700' : 
                 'bg-gray-900/30 border-gray-700 opacity-60'">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold" :class="averageRank >= 3 ? 'text-green-400' : 'text-gray-400'">
                Enhanced AI
              </h3>
              <span class="text-xs px-2 py-1 rounded" 
                    :class="averageRank >= 3 ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'">
                {{ averageRank >= 3 ? 'UNLOCKED' : 'LOCKED' }}
              </span>
            </div>
            <ul class="text-sm space-y-1 flex-1" :class="averageRank >= 3 ? 'text-green-200' : 'text-gray-400'">
              <li class="flex items-center gap-1">
                <span class="font-[ships] text-3xl pt-1">F</span> when <span class="font-[xwing]">2</span>, may <span class="font-[xwing]">1</span> or <span class="font-[xwing]">3</span> to swerve to get a shot
              </li>
            </ul>
            <div v-if="averageRank < 3" class="text-xs text-gray-500 mt-2 italic w-full text-center">
              Unlocks at Average Rank 3
            </div>
          </div>
          
          <!-- Veteran AI (Rank 4+) -->
          <div class="rounded-lg p-4 border flex flex-col"
               :class="averageRank >= 4 ? 
                 'bg-green-900/30 border-green-700' : 
                 'bg-gray-900/30 border-gray-700 opacity-60'">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold" :class="averageRank >= 4 ? 'text-green-400' : 'text-gray-400'">
                Veteran AI
              </h3>
              <span class="text-xs px-2 py-1 rounded" 
                    :class="averageRank >= 4 ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'">
                {{ averageRank >= 4 ? 'UNLOCKED' : 'LOCKED' }}
              </span>
            </div>
            <ul class="text-sm space-y-1 flex-1" :class="averageRank >= 4 ? 'text-green-200' : 'text-gray-400'">
              <li class="flex items-center gap-1">
                <span class="font-[ships] text-3xl pt-1">F</span> gain 1 Hull & Predator
              </li>
            </ul>
            <div v-if="averageRank < 4" class="text-xs text-gray-500 mt-2 italic w-full text-center">
              Unlocks at Average Rank 4
            </div>
          </div>
          
          <!-- Ace AI (Rank 5+) -->
          <div class="rounded-lg p-4 border flex flex-col"
               :class="averageRank >= 5 ? 
                 'bg-green-900/30 border-green-700' : 
                 'bg-gray-900/30 border-gray-700 opacity-60'">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold" :class="averageRank >= 5 ? 'text-green-400' : 'text-gray-400'">
                Ace AI
              </h3>
              <span class="text-xs px-2 py-1 rounded" 
                    :class="averageRank >= 5 ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'">
                {{ averageRank >= 5 ? 'UNLOCKED' : 'LOCKED' }}
              </span>
            </div>
            <ul class="text-sm space-y-1 flex-1" :class="averageRank >= 5 ? 'text-green-200' : 'text-gray-400'">
              <li>All Non-Elites gain 1 shield and predator</li>
            </ul>
            <div v-if="averageRank < 5" class="text-xs text-gray-500 mt-2 italic w-full text-center">
              Unlocks at Average Rank 5
            </div>
          </div>

          <!-- Legendary AI (Rank 6+) -->
          <div class="rounded-lg p-4 border flex flex-col"
               :class="averageRank >= 6 ? 
                 'bg-green-900/30 border-green-700' : 
                 'bg-gray-900/30 border-gray-700 opacity-60'">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold" :class="averageRank >= 6 ? 'text-green-400' : 'text-gray-400'">
                Legendary AI
              </h3>
              <span class="text-xs px-2 py-1 rounded" 
                    :class="averageRank >= 6 ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'">
                {{ averageRank >= 6 ? 'UNLOCKED' : 'LOCKED' }}
              </span>
            </div>
            <ul class="text-sm space-y-1 flex-1" :class="averageRank >= 6 ? 'text-green-200' : 'text-gray-400'">
              <li>Elites gain 1 shield and predator</li>
            </ul>
            <div v-if="averageRank < 6" class="text-xs text-gray-500 mt-2 italic w-full text-center">
              Unlocks at Average Rank 6
            </div>
          </div>
        </div>

        <!-- Current Group Status -->
        <div class="mt-6 pt-4 border-t border-neutral-600 flex-1">
          <div class="flex justify-center items-center gap-6 text-center">
            <div>
              <div class="text-2xl font-bold text-yellow-400">{{ averageRank }}</div>
              <div class="text-sm text-gray-400">Average Rank</div>
            </div>
            <div>
              <div class="text-xl font-bold text-blue-400">{{ selectedPilots.length }}</div>
              <div class="text-sm text-gray-400">Selected Pilots</div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-400">{{ totalXP }}</div>
              <div class="text-sm text-gray-400">Total XP</div>
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
const selectedPilotIds = ref([])

// Initialize with all pilots selected
onMounted(() => {
  selectedPilotIds.value = store.pilots.map(pilot => pilot.id)
})

// Computed properties for statistics
const totalPilots = computed(() => store.pilots.length)

const selectedPilots = computed(() => {
  return store.pilots.filter(pilot => selectedPilotIds.value.includes(pilot.id))
})

const averageRank = computed(() => {
  if (selectedPilots.value.length === 0) return 0
  const total = selectedPilots.value.reduce((sum, pilot) => sum + pilot.rank, 0)
  return Math.ceil(total / selectedPilots.value.length)
})

const totalXP = computed(() => {
  return selectedPilots.value.reduce((sum, pilot) => sum + pilot.xp, 0)
})

// Pilot selection methods
const togglePilot = (pilotId) => {
  const index = selectedPilotIds.value.indexOf(pilotId)
  if (index > -1) {
    selectedPilotIds.value.splice(index, 1)
  } else {
    selectedPilotIds.value.push(pilotId)
  }
}

const selectAllPilots = () => {
  selectedPilotIds.value = store.pilots.map(pilot => pilot.id)
}

const clearAllPilots = () => {
  selectedPilotIds.value = []
}

// Helper functions
const getClassIcon = (className) => {
  return classData[className]?.icon || '?'
}

const getClassColor = (className) => {
  return classData[className]?.color || '#a8a8a8'
}
</script>
