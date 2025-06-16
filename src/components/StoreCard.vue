<template>
  <div
    @click="purchaseCard"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'inria-sans-regular balatro-card group bg-neutral-900 cursor-pointer max-h-[44vh] aspect-[2/3] rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 ease-in-out transform-style-preserve-3d relative',
    ]"
  >
    <!-- Faction icon -->
    <div class="corner absolute top-2 left-2 z-20 flex items-center justify-center">
      <div v-if="factionClass === 'empire'" class="faction-icon bg-empire"><span>@</span></div>
      <div v-else-if="factionClass === 'force'" class="faction-icon bg-force"><span>h</span></div>
      <div v-else-if="factionClass === 'resistance'" class="faction-icon bg-resistance"><span>!</span></div>
      <div v-else-if="factionClass === 'firstorder'" class="faction-icon bg-firstorder"><span>+</span></div>
      <div v-else-if="factionClass === 'scum'" class="faction-icon bg-scum"><span>#</span></div>
      <div v-else-if="factionClass === 'republic'" class="faction-icon bg-republic"><span>/</span></div>
      <div v-else-if="factionClass === 'separatists'" class="faction-icon bg-separatists"><span>.</span></div>
    </div>

    <!-- Cost badge -->
    <div class="absolute top-2 right-2 pr-2 pl-1 pb-1 text-xs font-semibold rounded-full bg-black bg-opacity-70 text-white select-none z-20">
      <span>
        <span class="font-[xwing] text-lg font-light">Ì</span>{{ cost }}
      </span>
    </div>

    <!-- Flip indicator -->
    <div v-if="flippable" class="absolute bottom-2 left-2 transform text-white z-30 opacity-50 text-sm">
      <kbd class="kbd text-black kbd-sm bg-white">F</kbd> Flip
    </div>

    <div class="gloss absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none transition-all duration-400 ease-in-out" />

    <div v-if="unique" class="holographic-overlay pointer-events-none absolute inset-0 z-30" />

    <figure class="relative rounded-t-lg overflow-hidden h-1/2">
      <img :src="displayedImage" alt="Card art" class="w-full h-full object-cover z-10 relative" />
    </figure>

    <div class="relative p-2 text-center h-1/2 flex flex-col justify-start">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span class="font-[xwing] text-[18rem] text-white/2 -mt-[6rem] leading-none">{{ typeLetter }}</span>
      </div>

      <h2 class="text-md font-bold text-white mb-1">
        <span v-if="unique" class="font-[xwing] mr-1">u</span>{{ displayedName }}
      </h2>
      <p class="text-sm text-neutral-content leading-snug" v-html="displayedDescription"></p>
    </div>

    <!-- Energy/Force Display -->
    <div v-if="hasAnyToken" class="absolute bottom-2 right-2 flex space-x-2 items-center select-none z-30">
      <template v-if="displayedEnergy !== null">
        <span class="flex items-center space-x-1 text-yellow-400">
          <span class="font-[xwing] -mt-1 text-lg leading-none">{{ energyLetter }}</span>
          <span v-if="displayedRecurringEnergy" class="font-[xwing] text-lg leading-none">{{ displayedRecurringEnergy }}</span>
          <span class="font-semibold text-lg">{{ displayedEnergy }}</span>
        </span>
      </template>

      <template v-if="displayedForce !== null">
        <span class="flex items-center space-x-1 text-[#72bbe3]">
          <span class="font-[xwing] -mt-1 text-lg leading-none">{{ forceLetter }}</span>
          <span v-if="displayedRecurringForce" class="font-[xwing] text-lg leading-none">{{ displayedRecurringForce }}</span>
          <span class="font-semibold text-lg">{{ displayedForce }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePilotStore } from '../stores/pilotStore'
import { tokenToLetterMap } from '../utils/mappings'

const props = defineProps({
  name: String,
  flippedName: String,
  type: String,
  cost: [Number, String],
  faction: String,
  description: String,
  flippedDescription: String,
  image: String,
  flippedImage: String,
  force: [Number, String],
  recurringForce: [Number, String],
  energy: [Number, String],
  recurringEnergy: [Number, String],
  flippedForce: [Number, String],
  flippedRecurringForce: [Number, String],
  flippedEnergy: [Number, String],
  flippedRecurringEnergy: [Number, String],
  unique: Boolean,
  flippable: Boolean,
})

const isHovered = ref(false)
const flipped = ref(false)

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))

function handleKeyDown(e) {
  if (e.key.toLowerCase() === 'f' && isHovered.value && props.flippable) {
    flipped.value = !flipped.value
  }
}

const pilotStore = usePilotStore()
const factionClass = computed(() => (props.faction || '').toLowerCase() || 'neutral')
const typeLetter = computed(() => tokenToLetterMap[(props.type || '').toLowerCase()] || '?')
const energyLetter = 'g'
const forceLetter = 'h'
const recurringSymbols = ['', '`', '_', '']

const recurringSymbol = (count) => {
  const val = Number(count) || 0
  return recurringSymbols[Math.min(val, 3)]
}

const displayedName = computed(() => flipped.value && props.flippable ? props.flippedName || props.name : props.name)
const displayedImage = computed(() => flipped.value && props.flippable ? props.flippedImage || props.image : props.image)

const displayedDescription = computed(() => {
  const raw = flipped.value && props.flippable ? props.flippedDescription || '' : props.description || ''
  return raw.replace(/\{([^}]+)\}/g, (_, token) => {
    const letter = tokenToLetterMap[token.toLowerCase()] || '?'
    return `<span class="font-[xwing]">${letter}</span>`
  })
})

const displayedEnergy = computed(() => {
  const val = flipped.value ? props.flippedEnergy : props.energy
  return val != null ? Number(val) : null
})
const displayedForce = computed(() => {
  const val = flipped.value ? props.flippedForce : props.force
  return val != null ? Number(val) : null
})
const displayedRecurringEnergy = computed(() => recurringSymbol(flipped.value ? props.flippedRecurringEnergy : props.recurringEnergy))
const displayedRecurringForce = computed(() => recurringSymbol(flipped.value ? props.flippedRecurringForce : props.recurringForce))

const hasAnyToken = computed(() =>
  displayedEnergy.value != null || displayedForce.value != null
)

const purchaseCard = () => {
  console.log(`Purchased card: ${props.name}`)
  // TODO: Hook in your store transaction or action here
}
</script>

<style scoped>
@keyframes holoMove {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}

.holographic-overlay {
  background: linear-gradient(130deg,
      rgba(255, 0, 255, 0.15),
      rgba(0, 255, 255, 0.15),
      rgba(255, 255, 0, 0.15),
      rgba(255, 0, 255, 0.15));
  background-size: 400% 400%;
  mix-blend-mode: screen;
  animation: holoMove 12s linear infinite;
  opacity: 0.7;
}

.balatro-card {
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.balatro-card:hover {
  transform: scale(1.05) rotateX(2deg) rotateY(-2deg);
  z-index: 10;
  box-shadow: 0 0 1.5rem rgba(255, 255, 255, 0.2);
}

.balatro-card:hover .gloss {
  left: 90%;
}

.faction-icon {
  font-family: 'xwing';
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);
}

.faction-icon span {
  color: white;
  opacity: 0.8;
  font-size: 1.75rem;
  margin-top: -0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
