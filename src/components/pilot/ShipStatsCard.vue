/**
 * ShipStatsCard Component
 * 
 * Displays a card-style representation of a ship with:
 * - Ship image and background icon
 * - Ship ability letters and description
 * - Combat statistics in a grid layout
 */
<template>
  <div class="bg-neutral-700 border border-neutral-600 rounded-2xl shadow-lg overflow-hidden flex flex-col aspect-[2/3] relative">
    <div class="relative h-1/3 bg-neutral-600 flex items-center justify-center overflow-hidden">
      <img 
        :src="shipStats.image" 
        alt="Ship Image" 
        class="w-full h-full object-cover" 
      />
    </div>
    
    <div class="relative h-2/3 p-4 flex flex-col justify-between text-center max-h-full">
      <!-- Background ship icon -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span class="font-[ships] text-white/5 text-[16rem] -mt-8">{{ shipIcon }}</span>
      </div>
      
      <!-- Ship content -->
      <div class="relative z-10">
        <ShipAbilityLetters :ability-letters="abilityLetters" />
        <div class="border-t border-gray-600/30 mx-4"></div>
        
        <h3 class="text-lg font-bold text-white mt-3 mb-2">{{ shipName }}</h3>
        <p 
          class="text-xs text-gray-300 leading-tight px-2 text-center" 
          v-html="processedDescription"
        ></p>
      </div>
      
      <!-- Ship ability -->
      <div v-if="shipStats.ability" class="relative z-10 flex-1 flex flex-col justify-center max-h-full">
        <div class="px-2">
          <div class="border-t border-gray-500 my-2"></div>
          <p 
            class="text-xs text-gray-300 leading-tight italic text-center" 
            v-html="processedAbility"
          ></p>
        </div>
      </div>
      
      <!-- Ship stats -->
      <ShipStats :ship-stats="shipStats" class="relative z-10" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePilotStore } from '../../stores/PilotStore'
import { tokenToLetterMap } from '../../utils/mappings'
import ShipAbilityLetters from './ShipAbilityLetters.vue'
import ShipStats from './ShipStats.vue'
import classData from '../../data/classes.json'
import shipData from '../../data/ships.json'

const store = usePilotStore()

/**
 * Component props
 */
const props = defineProps({
  /** Name of the ship to display */
  shipName: {
    type: String,
    required: true
  }
})

/**
 * Get ship statistics and data
 */
const shipStats = computed(() => {
  return shipData[props.shipName] || {
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
})

/**
 * Get ship ability letters with class-specific modifications
 */
const abilityLetters = computed(() => {
  let letters = shipStats.value?.abilityLetters || [
    { id: 1, symbol: 'C', color: 'text-white' },
    { id: 2, symbol: 'C', color: 'text-white' }
  ]
  
  // Replace 'f' with 'a' for Droid class pilots
  if (store.currentPilot?.class === 'Droid') {
    letters = letters.map(letter => ({
      ...letter,
      symbol: letter.symbol.replace(/f/g, 'a')
    }))
  }
  
  return letters
})

/**
 * Get ship icon from class data
 */
const shipIcon = computed(() => {
  for (const className of Object.keys(classData)) {
    const classInfo = classData[className]
    if (classInfo.ships) {
      const ship = classInfo.ships.find(s => s.ship === props.shipName)
      if (ship) return ship.icon
    }
  }
  return 'x'
})

/**
 * Process ship text by replacing tokens and applying formatting
 * @param {string} raw - Raw text with tokens
 * @returns {string} Processed HTML string
 */
const processShipText = (raw) => {
  if (!raw) return ''
  
  // Replace tokens with proper symbols and colors
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

  // Bold text before colons
  replaced = replaced.replace(/([^.!?]*?):/g, '<span class="font-semibold">$1:</span>')
  return replaced
}

/**
 * Get processed ship description
 */
const processedDescription = computed(() => {
  return processShipText(shipStats.value?.description || '')
})

/**
 * Get processed ship ability
 */
const processedAbility = computed(() => {
  return processShipText(shipStats.value?.ability || '')
})
</script>
