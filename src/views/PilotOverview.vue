<template>
  <main class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-6">
      <div class="max-w-4xl px-6 mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Pilot Overview</h1>
          <p class="text-gray-400">Track your pilot's ship kill statistics and milestones</p>
        </div>
        <button class="btn btn-ghost text-white" @click="$router.push('/dashboard')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
          Close
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6 space-y-6">
        
        <!-- Ship Overview Section -->
        <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Ship Overview</h2>
          
          <div v-if="store.currentPilot?.selectedShip" class="flex gap-6">
            <!-- Ship Card (Left Side) -->
            <div class="flex-shrink-0 w-80">
              <div class="bg-neutral-700 border border-neutral-600 rounded-2xl shadow-lg overflow-hidden flex flex-col aspect-[2/3] relative">
                <!-- Ship Image/Icon -->
                <div class="relative h-1/3 bg-neutral-600 flex items-center justify-center overflow-hidden">
                  <!-- Actual ship image -->
                  <img :src="getShipStats(store.currentPilot.selectedShip).image" 
                       alt="Ship Image" 
                       class="w-full h-full object-cover" />
                </div>
                
                <!-- Ship Details -->
                <div class="relative h-2/3 p-4 flex flex-col justify-between text-center max-h-full">
                  <!-- Background type symbol -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                    <span class="font-[ships] text-white/5 text-[16rem] -mt-8">{{ getShipIcon(store.currentPilot.selectedShip) }}</span>
                  </div>
                  
                  <!-- Top content: Ship Ability Letters with divider -->
                  <div class="relative z-10">
                    <!-- Ship Ability Letters -->
                    <div class="mb-3">
                      <div class="flex justify-evenly items-center gap-2">
                        <div v-for="letter in getShipAbilityLetters(store.currentPilot.selectedShip)" 
                             :key="letter.id"
                             class="font-[xwing] text-lg flex items-center justify-center">
                          <template v-if="letter.symbol.includes('*')">
                            <!-- Multi-character symbol with red third character -->
                            <span v-for="(char, index) in letter.symbol.replace('*', '')" 
                                  :key="index"
                                  :class="index === 2 ? 'text-red-400' : letter.color">
                              {{ char }}
                            </span>
                          </template>
                          <template v-else>
                            <!-- Single character symbol -->
                            <span :class="letter.color">{{ letter.symbol }}</span>
                          </template>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Faint divider beneath top symbols -->
                    <div class="border-t border-gray-600/30 mx-4"></div>
                    
                    <!-- Ship Title just under divider -->
                    <h3 class="text-lg font-bold text-white mt-3 mb-2">{{ store.currentPilot.selectedShip }}</h3>
                    
                    <!-- Description just beneath ship name -->
                    <p class="text-xs text-gray-300 leading-tight px-2 text-center" v-html="getProcessedShipDescription(store.currentPilot.selectedShip)"></p>
                  </div>
                  
                  <!-- Middle content: Ship ability -->
                  <div class="relative z-10 flex-1 flex flex-col justify-center max-h-full">
                    <!-- Ship Ability (if exists) -->
                    <div v-if="getShipStats(store.currentPilot.selectedShip).ability" class="px-2">
                      <div class="border-t border-gray-500 my-2"></div>
                      <p class="text-xs text-gray-300 leading-tight italic text-center" v-html="getProcessedShipAbility(store.currentPilot.selectedShip)"></p>
                    </div>
                  </div>
                  
                  <!-- Ship Stats at bottom -->
                  <div class="relative z-10">
                    <div class="grid gap-2" :class="getStatsGridClass(store.currentPilot.selectedShip)">
                      <!-- Primary Attack -->
                      <div class="flex items-center justify-center gap-1">
                        <span class="font-[xwing] text-red-400 text-lg pb-1">{{ getShipStats(store.currentPilot.selectedShip).arc }}</span>
                        <span class="text-lg font-bold text-red-400">{{ getShipStats(store.currentPilot.selectedShip).attack }}</span>
                        <!-- Secondary Attack -->
                        <template v-if="getShipStats(store.currentPilot.selectedShip).secondAttack">
                          <span class="font-[xwing] text-red-400 text-lg pb-1 ml-2">{{ getShipStats(store.currentPilot.selectedShip).secondArc || getShipStats(store.currentPilot.selectedShip).arc }}</span>
                          <span class="text-lg font-bold text-red-400">{{ getShipStats(store.currentPilot.selectedShip).secondAttack }}</span>
                        </template>
                      </div>
                      <!-- Agility (if exists) -->
                      <div v-if="getShipStats(store.currentPilot.selectedShip).agility !== undefined" class="flex items-center justify-center gap-1">
                        <span class="font-[xwing] text-green-400 text-lg pb-1">e</span>
                        <span class="text-lg font-bold text-green-400">{{ getShipStats(store.currentPilot.selectedShip).agility }}</span>
                      </div>
                      <!-- Hull (if exists) -->
                      <div v-if="getShipStats(store.currentPilot.selectedShip).hull !== undefined" class="flex items-center justify-center gap-1">
                        <span class="font-[xwing] text-yellow-400 text-lg pb-1">&</span>
                        <span class="text-lg font-bold text-yellow-400">{{ getShipStats(store.currentPilot.selectedShip).hull }}</span>
                      </div>
                      <!-- Shields (if exists) -->
                      <div v-if="getShipStats(store.currentPilot.selectedShip).shields !== undefined" class="flex items-center justify-center gap-1">
                        <span class="font-[xwing] text-blue-400 text-lg pb-1">*</span>
                        <span class="text-lg font-bold text-blue-400">{{ getShipStats(store.currentPilot.selectedShip).shields }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Maneuver Dial (Right Side) -->
            <div class="flex-1">
              <div class="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-white mb-4">Maneuver Dial</h3>
                
                <!-- Larger Maneuver grid (8 wide) -->
                <div class="inline-block">
                  <div class="space-y-1">
                    <div v-for="speed in [5, 4, 3, 2, 1, 0]" :key="speed" class="flex items-center">
                      <span class="text-sm font-bold text-white w-6 text-center mr-2">{{ speed }}</span>
                      <div class="flex">
                        <div v-for="maneuver in getManeuverRow(store.currentPilot.selectedShip, speed)" :key="maneuver.type" 
                             class="w-6 h-6 flex items-center justify-center text-sm font-bold font-[xwing] border border-gray-600 mr-1"
                             :class="getManeuverBackgroundClass(maneuver.difficulty)">
                          <span :class="getManeuverTextClass(maneuver.difficulty)">{{ maneuver.symbol }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Notes Section -->
              <div v-if="getShipNotes(store.currentPilot.selectedShip).length > 0" class="bg-neutral-700 border border-neutral-600 rounded-lg p-4 mt-4">
                <h3 class="text-lg font-semibold text-white mb-4">Notes</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-300">
                  <li v-for="note in getShipNotes(store.currentPilot.selectedShip)" :key="note" class="text-sm">
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            <p>No ship selected. Select a ship from the dashboard to see it here.</p>
          </div>
        </div>

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
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 md:gap-4 flex-1 overflow-y-auto">
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
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { usePilotStore } from '../stores/PilotStore'
import { tokenToLetterMap } from '../utils/mappings'
import classData from '../data/classes.json'
import shipData from '../data/ships.json'

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

// Ship data and helper functions
const getShipStats = (shipName) => {
  return shipData[shipName] || {
    attack: 2,
    agility: 2,
    hull: 3,
    shields: 1,
    arc: "{",
    description: "A standard fighter craft with balanced capabilities.",
    abilityLetters: [
      { id: 1, symbol: 'C', color: 'text-white' },
      { id: 2, symbol: 'C', color: 'text-white' }
    ]
  }
}

const getShipAbilityLetters = (shipName) => {
  const ship = shipData[shipName]
  return ship?.abilityLetters || [
    { id: 1, symbol: 'C', color: 'text-white' },
    { id: 2, symbol: 'C', color: 'text-white' }
  ]
}

// Text processing functions for ship descriptions and abilities
const processShipText = (raw) => {
  if (!raw) return ''
  
  // First, replace tokens, handling ! prefix for red color and @ prefix for light pinkish purple color
  let replaced = raw.replace(/([!@])?\{([^}]+)\}/g, (_, prefix, token) => {
    const letter = tokenToLetterMap[token.toLowerCase()] || '?'
    const span = `<span class="font-[xwing]">${letter}</span>`

    if (prefix === '!') {
      return `<span class="text-red-400">${span}</span>`
    } else if (prefix === '@') {
      return `<span class="text-pink-300">${span}</span>`
    }
    return span
  })

  // Then, bold full words directly before a colon (including the colon)
  replaced = replaced.replace(/\b(\w+):/g, '<span class="font-semibold">$1:</span>')

  return replaced
}

const getProcessedShipDescription = (shipName) => {
  const ship = shipData[shipName]
  return processShipText(ship?.description || '')
}

const getProcessedShipAbility = (shipName) => {
  const ship = shipData[shipName]
  return processShipText(ship?.ability || '')
}

const getShipIcon = (shipName) => {
  // Find ship icon from classes data
  for (const className of Object.keys(classData)) {
    const classInfo = classData[className]
    if (classInfo.ships) {
      const ship = classInfo.ships.find(s => s.ship === shipName)
      if (ship) return ship.icon
    }
  }
  return 'x' // default fallback
}

// Function to determine grid class based on number of stats
const getStatsGridClass = (shipName) => {
  const ship = getShipStats(shipName)
  let statCount = 1 // Always have attack
  
  if (ship.agility !== undefined) statCount++
  if (ship.hull !== undefined) statCount++
  if (ship.shields !== undefined) statCount++
  
  switch(statCount) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-2'
    case 3: return 'grid-cols-3'
    case 4: return 'grid-cols-4'
    default: return 'grid-cols-4'
  }
}

// Maneuver dial functions
const getManeuverRow = (shipName, speed) => {
  const ship = shipData[shipName]
  if (ship?.maneuverDial?.[speed]) {
    const maneuverArray = ship.maneuverDial[speed]
    
    // Define the symbols and types for each position
    const maneuverTemplates = [
      { type: 'sloop', symbol: speed === 0 ? 'K' : ':' },    // Position 0: sloop (left side, uses 1 normally, 5 at speed 0)
      { type: 'bl', symbol: speed === 0 ? 'K' : '4' },       // Position 1: bank left
      { type: 'tl', symbol: speed === 0 ? 'J' : '7' },       // Position 2: turn left
      { type: 'st', symbol: speed === 0 ? '5' : '8' },       // Position 3: straight
      { type: 'tr', symbol: speed === 0 ? 'L' : '9' },       // Position 4: turn right
      { type: 'br', symbol: speed === 0 ? 'K' : '6' },       // Position 5: bank right
      { type: 'sloop', symbol: speed === 0 ? 'K' : ';' },    // Position 6: sloop (right side, uses 3 normally, 5 at speed 0)
      { type: 'kturn', symbol: speed === 0 ? 'K' : '2' }     // Position 7: kturn
    ]
    
    // Convert numeric difficulty ratings to difficulty names
    const difficultyMap = {
      0: 'none',      // hidden/not available
      1: 'easy',      // blue
      2: 'normal',    // white
      3: 'hard',      // red
      4: 'advanced'   // pink
    }
    
    return maneuverArray.map((item, index) => {
      // Handle both simple numbers and objects for sloop/talon specification
      if (typeof item === 'object' && item !== null) {
        // Object format: { difficulty: 1, type: 'sloop' } or { difficulty: 1, type: 'talon' }
        let symbol, type
        
        if (item.type === 'sloop') {
          // Sloop: 1 for left (position 0), 3 for right (position 6), but 5 at speed 0
          symbol = speed === 0 ? '5' : (index === 0 ? '1' : '3')
          type = 'sloop'
        } else if (item.type === 'talon' || item.type === 't') {
          // Talon/troll: : for left (position 0), ; for right (position 6), but 5 at speed 0
          symbol = speed === 0 ? '5' : (index === 0 ? ':' : ';')
          type = 'talon'
        } else {
          // Fallback to template
          symbol = maneuverTemplates[index].symbol
          type = item.type || maneuverTemplates[index].type
        }
        
        return {
          type: type,
          symbol: symbol,
          difficulty: difficultyMap[item.difficulty] || 'none'
        }
      } else {
        // Simple number format
        const difficultyRating = item
        return {
          type: maneuverTemplates[index].type,
          symbol: maneuverTemplates[index].symbol,
          difficulty: difficultyMap[difficultyRating] || 'none'
        }
      }
    })
  }
  
  // Default fallback maneuver row
  return [
    { type: 'sloop', symbol: '1', difficulty: 'none' },     // Left sloop
    { type: 'bl', symbol: '4', difficulty: 'none' },
    { type: 'tl', symbol: '7', difficulty: 'none' },
    { type: 'st', symbol: '8', difficulty: 'normal' },
    { type: 'tr', symbol: '9', difficulty: 'none' },
    { type: 'br', symbol: '6', difficulty: 'none' },
    { type: 'sloop', symbol: '3', difficulty: 'none' },     // Right sloop
    { type: 'kturn', symbol: ':', difficulty: 'none' }
  ]
}

const getManeuverClass = (difficulty) => {
  const classes = {
    'easy': 'bg-blue-500 text-white',    // Blue for easy (1)
    'normal': 'bg-white text-black',     // White for normal (2)
    'hard': 'bg-red-500 text-white',
    'advanced': 'bg-violet-300 text-white',
    'none': 'bg-gray-800 text-gray-600'
  }
  
  return classes[difficulty] || classes.none
}

const getManeuverBackgroundClass = (difficulty) => {
  const classes = {
    'easy': 'bg-neutral-800',
    'normal': 'bg-neutral-800',
    'hard': 'bg-neutral-800',
    'advanced': 'bg-neutral-800',
    'none': 'bg-transparent border-transparent'
  }
  
  return classes[difficulty] || classes.none
}

const getManeuverTextClass = (difficulty) => {
  const classes = {
    'easy': 'text-blue-500',    // Blue text for easy (1)
    'normal': 'text-white',     // White text for normal (2)
    'hard': 'text-red-500',
    'advanced': 'text-violet-300',
    'none': 'text-transparent'
  }
  
  return classes[difficulty] || classes.none
}

const getShipNotes = (shipName) => {
  const ship = shipData[shipName]
  return ship?.notes || []
}
</script>
