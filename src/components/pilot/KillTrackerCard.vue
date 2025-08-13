/**
 * KillTrackerCard Component
 * 
 * Tracks and displays pilot kill statistics with interactive counters,
 * statistics summaries, and achievement milestones
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col h-full">
    <KillTrackerHeader 
      :pilot-name="currentPilot?.name"
      :pilot-class="currentPilot?.class"
      :pilot-rank="currentPilot?.rank"
    />
    
    <KillGrid 
      :enemies="allEnemies"
      :get-kill-count="getKillCount"
      :increment-kills="incrementKills"
      :decrement-kills="decrementKills"
      class="flex-1"
    />
    
    <KillStatistics 
      :total-kills="totalKills"
      :unique-ships-killed="uniqueShipsKilled"
      :favorite-target="favoriteTarget"
      :milestones="milestones"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePilotStore } from '../../stores/PilotStore'
import KillTrackerHeader from './KillTrackerHeader.vue'
import KillGrid from './KillGrid.vue'
import KillStatistics from './KillStatistics.vue'

const store = usePilotStore()

/**
 * Available enemy ships to track
 */
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
  { ship: "AT-ST", icon: "}" }
]

/**
 * Current pilot data
 */
const currentPilot = computed(() => store.currentPilot)

/**
 * Get kill count for specific ship
 * @param {string} shipIcon - Ship icon identifier
 * @returns {number} Number of kills
 */
const getKillCount = (shipIcon) => {
  if (!store.currentPilot?.shipKills) return 0
  return store.currentPilot.shipKills[shipIcon] || 0
}

/**
 * Increment kill count for ship
 * @param {string} shipIcon - Ship icon identifier
 */
const incrementKills = (shipIcon) => {
  store.incrementShipKills(shipIcon)
}

/**
 * Decrement kill count for ship
 * @param {string} shipIcon - Ship icon identifier
 */
const decrementKills = (shipIcon) => {
  store.decrementShipKills(shipIcon)
}

/**
 * Total number of kills across all ships
 */
const totalKills = computed(() => {
  if (!store.currentPilot?.shipKills) return 0
  return Object.values(store.currentPilot.shipKills).reduce((sum, kills) => sum + kills, 0)
})

/**
 * Number of unique ship types killed
 */
const uniqueShipsKilled = computed(() => {
  if (!store.currentPilot?.shipKills) return 0
  return Object.values(store.currentPilot.shipKills).filter(kills => kills > 0).length
})

/**
 * Most frequently killed ship type
 */
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

/**
 * Achievement milestones based on kill statistics
 */
const milestones = computed(() => {
  const total = totalKills.value
  const unique = uniqueShipsKilled.value
  
  return [
    { name: "First Blood", target: 1, progress: Math.min(total, 1), achieved: total >= 1 },
    { name: "Ace Pilot", target: 5, progress: Math.min(total, 5), achieved: total >= 5 },
    { name: "Squadron Killer", target: 10, progress: Math.min(total, 10), achieved: total >= 10 },
    { name: "Wing Commander", target: 25, progress: Math.min(total, 25), achieved: total >= 25 },
    { name: "Fleet Destroyer", target: 50, progress: Math.min(total, 50), achieved: total >= 50 },
    { name: "Specialist", target: 3, progress: Math.min(unique, 3), achieved: unique >= 3 },
    { name: "Versatile Hunter", target: 6, progress: Math.min(unique, 6), achieved: unique >= 6 },
    { name: "Master of All", target: 10, progress: Math.min(unique, 10), achieved: unique >= 10 }
  ]
})
</script>
