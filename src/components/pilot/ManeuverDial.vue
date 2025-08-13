/**
 * ManeuverDial Component
 * 
 * Displays a ship's maneuver dial showing available maneuvers by speed and difficulty
 */
<template>
  <div class="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
    <h3 class="text-lg font-semibold text-white mb-4">Maneuver Dial</h3>
    
    <div class="inline-block">
      <div class="space-y-1">
        <div v-for="speed in [5, 4, 3, 2, 1, 0]" :key="speed" class="flex items-center">
          <span class="text-sm font-bold text-white w-6 text-center mr-2">{{ speed }}</span>
          <div class="flex">
            <div 
              v-for="maneuver in getManeuverRow(speed)" 
              :key="maneuver.type" 
              class="w-6 h-6 flex items-center justify-center text-sm font-bold font-[xwing] border border-gray-600 mr-1"
              :class="getManeuverBackgroundClass(maneuver.difficulty)"
            >
              <span :class="getManeuverTextClass(maneuver.difficulty)">
                {{ maneuver.symbol }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import shipData from '../../data/ships.json'

/**
 * Component props
 */
const props = defineProps({
  /** Name of the ship */
  shipName: {
    type: String,
    required: true
  }
})

/**
 * Maneuver templates for each position on the dial
 */
const MANEUVER_TEMPLATES = [
  { type: 'sloop', symbol: ':' },    // Position 0: left sloop
  { type: 'bl', symbol: '4' },       // Position 1: bank left
  { type: 'tl', symbol: '7' },       // Position 2: turn left
  { type: 'st', symbol: '8' },       // Position 3: straight
  { type: 'tr', symbol: '9' },       // Position 4: turn right
  { type: 'br', symbol: '6' },       // Position 5: bank right
  { type: 'sloop', symbol: ';' },    // Position 6: right sloop
  { type: 'kturn', symbol: '2' }     // Position 7: kturn
]

/**
 * Difficulty mapping from numeric values to names
 */
const DIFFICULTY_MAP = {
  0: 'none',      // hidden/not available
  1: 'easy',      // blue
  2: 'normal',    // white
  3: 'hard',      // red
  4: 'advanced'   // pink
}

/**
 * Get maneuver row for specific speed
 * @param {number} speed - Speed value (0-5)
 * @returns {Array} Array of maneuver objects
 */
const getManeuverRow = (speed) => {
  const ship = shipData[props.shipName]
  const maneuverArray = ship?.maneuverDial?.[speed]
  
  if (!maneuverArray) {
    return MANEUVER_TEMPLATES.map(template => ({
      ...template,
      difficulty: 'none'
    }))
  }
  
  return maneuverArray.map((item, index) => {
    const template = MANEUVER_TEMPLATES[index]
    
    if (typeof item === 'object' && item !== null) {
      let symbol, type
      
      if (item.type === 'sloop') {
        symbol = speed === 0 ? '5' : (index === 0 ? '1' : '3')
        type = 'sloop'
      } else if (item.type === 'talon' || item.type === 't') {
        symbol = speed === 0 ? '5' : (index === 0 ? ':' : ';')
        type = 'talon'
      } else {
        symbol = speed === 0 ? getSpeed0Symbol(template.type, index) : template.symbol
        type = item.type || template.type
      }
      
      return {
        type,
        symbol,
        difficulty: DIFFICULTY_MAP[item.difficulty] || 'none'
      }
    }
    
    return {
      type: template.type,
      symbol: speed === 0 ? getSpeed0Symbol(template.type, index) : template.symbol,
      difficulty: DIFFICULTY_MAP[item] || 'none'
    }
  })
}

/**
 * Get symbol for speed 0 maneuvers
 * @param {string} type - Maneuver type
 * @param {number} index - Position index
 * @returns {string} Symbol character
 */
const getSpeed0Symbol = (type, index) => {
  const speed0Map = {
    'sloop': 'K',
    'bl': 'K',
    'tl': 'J',
    'st': '5',
    'tr': 'L',
    'br': 'K',
    'kturn': 'K'
  }
  return speed0Map[type] || 'K'
}

/**
 * Get background class for maneuver difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {string} CSS class
 */
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

/**
 * Get text color class for maneuver difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {string} CSS class
 */
const getManeuverTextClass = (difficulty) => {
  const classes = {
    'easy': 'text-blue-500',
    'normal': 'text-white',
    'hard': 'text-red-500',
    'advanced': 'text-violet-300',
    'none': 'text-transparent'
  }
  return classes[difficulty] || classes.none
}
</script>
