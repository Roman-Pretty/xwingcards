<template>
  <div @click="handleClick" @mouseenter="isHovered = true" @mouseleave="isHovered = false" :class="[
    'inria-sans-regular balatro-card group bg-neutral-900 cursor-pointer rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 ease-in-out transform-style-preserve-3d relative self-start',
    {
      'w-[48%] 2xl:w-[31%] aspect-[2/3]': !mobileMode,
      'w-[70%] aspect-[2/3]': mobileMode,
      'custom-card': !displayedImage
    }
  ]">

    <div
      class="gloss absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none transition-all duration-400 ease-in-out" />

    <div v-if="unique" class="holographic-overlay pointer-events-none absolute inset-0 z-30" />

    <!-- Faction icon(s) - bookmark style -->
    <div class="absolute top-0 left-2 z-20 flex flex-row gap-1">
      <div v-for="(factionName, index) in displayedNonNeutralFactions" :key="factionName" 
           :class="getFactionBookmarkClass(factionName)"
           class="faction-bookmark">
        <div class="faction-icon-content">
          <span>{{ getFactionIcon(factionName) }}</span>
        </div>
      </div>
    </div>

    <!-- Cost badge -->
    <div v-if="showXP"
      class="absolute top-2 right-2 flex items-center justify-center w-[2rem] h-[2rem] text-sm font-semibold rounded-full bg-neutral-950 bg-opacity-70 text-white select-none z-20">
      <span>
        {{ cost }}
      </span>
    </div>

    <!-- Upgrade level indicator -->
    <div v-if="upgradeLevel > 0 && showXP"
      class="absolute top-2 right-11 flex items-center justify-center w-[2rem] h-[2rem] text-xs font-semibold rounded-full bg-slate-800 bg-opacity-90 text-white select-none z-20">
      <span>
        +{{ upgradeLevel }}
      </span>
    </div>  

    <div v-if="upgradeLevel > 0 && !showXP"
      class="absolute top-2 right-2 flex items-center justify-center w-[2rem] h-[2rem] text-xs font-semibold rounded-full bg-slate-800 bg-opacity-90 text-white select-none z-20">
      <span>
        +{{ upgradeLevel }}
      </span>
    </div>  

    <!-- Flip indicator -->
    <div v-if="flippable" class="absolute bottom-2 left-2 transform text-white z-30 opacity-50 text-sm">
      <kbd class="kbd text-black kbd-sm bg-white">F</kbd> Flip
    </div>

    <!-- Initiative indicator -->
    <div v-if="initiative && !flippable" class="absolute bottom-2 left-4 transform text-yellow-400 z-30 2xl:text-md text-lg font-bold">
      In {{ initiative }}
    </div>

    <!-- Requires indicator -->
    <div v-if="requires"
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white z-30 opacity-50 text-sm border-x-1 border-t-1 px-1 rounded-t">
      <p class="text-sm 2xl:text-xs text-neutral-content leading-snug" :class="{ 'text-sm 2xl:text-xs': !mobileMode, 'text-[0.5rem]': mobileMode }" v-html="displayedRequires"></p>
    </div>


    <figure class="relative rounded-t-lg overflow-hidden" :class="{ 'h-1/2': !mobileMode, 'h-1/3': mobileMode }">
      <!-- Custom procedural background when no image is provided -->
      <div v-if="!displayedImage" class="custom-space-background">
        <div class="stars-field"></div>
        <div class="nebula-glow"></div>
        <div class="card-type-symbol" :style="{ '--card-hash': cardHash }">{{ typeLetter }}</div>
        <div class="hyperspace-lines"></div>
        <!-- Background overlay to cover the faction icon like regular images -->
        <div class="image-background-overlay"></div>
        <!-- Top half background to match card background and prevent lower content overlap -->
        <div class="top-half-background"></div>
      </div>
      
      <!-- Custom holographic overlay when no image is provided -->
      <div v-if="!displayedImage" class="custom-holographic-overlay pointer-events-none absolute inset-0 z-20" />
      
      <!-- Owned badge with upgrade status -->
      <div v-if="owned"
        class="absolute bottom-0 left-0 transform z-20 w-full text-center"
        :class="{
          'bg-yellow-600 text-white text-sm': canUpgrade,
          'bg-yellow-900 text-white/80 text-sm': !canUpgrade && upgradeLevel > 0,
          'bg-neutral-900 text-white/80 text-sm': !canUpgrade && upgradeLevel === 0,
          'text-xs': mobileMode
        }">
        <span v-if="canUpgrade">Owned (Upgradeable)</span>
        <span v-else-if="upgradeLevel > 0">Fully Upgraded</span>
        <span v-else>Owned</span>
      </div>
      
      <!-- Regular image when image is provided -->
      <img v-if="displayedImage" :src="displayedImage" alt="Card art" class="w-full h-full object-cover z-10 relative" />
    </figure>

    <!-- Card content -->
    <div class="relative text-center flex flex-col justify-start" :class="{ 
      'h-1/2 p-2': !mobileMode, 
      'h-2/3 p-1': mobileMode 
    }">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span class="font-[xwing] text-white/2 leading-none" :class="{ 
          'text-[18rem] -mt-[6rem]': !mobileMode, 
          'text-[12rem] -mt-[4rem]': mobileMode 
        }">{{ typeLetter }}</span>
      </div>

      <h2 class="font-bold mb-1" :class="{ 
        'text-md': !mobileMode, 
        'text-xs': mobileMode,
        'text-purple-200': custom,
        'text-white': !custom
      }">
        <span v-if="unique" class="font-[xwing] mr-1">u</span>{{ displayedName }}
      </h2>
      <div v-if="damage" class="text-red-400 mb-1 flex flex-row items-center justify-center gap-1" :class="{ 'text-md': !mobileMode, 'text-xs': mobileMode }">
        <span class="font-[xwing] -mt-1">{{ arc }}</span>
        <span class="font-semibold">{{ damage }}</span>
        <span v-if="isMissile" class="font-[xwing] -mt-1">?</span>
        <span class="ml-3 font-semibold text-white/80">{{ ranged }}</span>
      </div>
      <p class="leading-snug" :class="{ 
        '2xl:text-xs text-sm': !mobileMode, 
        'text-sm leading-tight': mobileMode,
        'text-purple-200': custom,
        'text-neutral-content': !custom
      }" v-html="displayedDescription"></p>
    </div>

    <!-- Energy/Force Display -->
    <div v-if="hasAnyToken" class="absolute bottom-2 right-2 flex space-x-2 items-center select-none z-30">
      <template v-if="displayedEnergy !== null">
        <span class="flex items-center space-x-1 text-yellow-400">
          <span class="font-[xwing] -mt-1 text-lg leading-none">{{ energyLetter }}</span>
          <span v-if="displayedRecurringEnergy" class="font-[xwing] text-lg leading-none">{{ displayedRecurringEnergy
            }}</span>
          <span class="font-semibold text-lg">{{ displayedEnergy }}</span>
        </span>
      </template>

      <template v-if="displayedForce !== null">
        <span class="flex items-center space-x-1 text-[#72bbe3]">
          <span class="font-[xwing] -mt-1 text-lg leading-none">{{ forceLetter }}</span>
          <span v-if="displayedRecurringForce" class="font-[xwing] text-lg leading-none">{{ displayedRecurringForce
            }}</span>
          <span class="font-semibold text-lg">{{ displayedForce }}</span>
        </span>
      </template>
    </div>

    <!-- Assist indicator -->
    <div v-if="assist" :class="{
      'absolute bottom-2': !hasAnyToken,
      'absolute bottom-8': hasAnyToken
    }" class="right-2 transform text-gray-400 z-30 2xl:text-md text-lg font-bold">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-icon lucide-chevrons-up">
        <path d="m17 11-5-5-5 5"/>
        <path d="m17 18-5-5-5 5"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { tokenToLetterMap } from '../utils/mappings'

const props = defineProps({
  id: String,
  name: String,
  flippedName: String,
  type: String,
  cost: [Number, String],
  faction: [String, Array],
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
  showXP: Boolean,
  damage: String,
  ranged: String,
  arc: String,
  isMissile: Boolean,
  requires: String,
  owned: {
    type: Boolean,
    default: false,
  },
  canUpgrade: {
    type: Boolean,
    default: false,
  },
  upgradeLevel: {
    type: Number,
    default: 0,
  },
  initiative: [Number, String],
  assist: Boolean,
  mobileMode: {
    type: Boolean,
    default: false,
  },
  custom: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['card-click'])

const isHovered = ref(false)
const flipped = ref(false)

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))

function handleKeyDown(e) {
  if (e.key.toLowerCase() === 'f' && isHovered.value && props.flippable) {
    flipped.value = !flipped.value
  }
}



const factionClass = computed(() => {
  if (Array.isArray(props.faction)) {
    return props.faction[0]?.toLowerCase() || 'neutral'
  }
  return (props.faction || '').toLowerCase() || 'neutral'
})

const displayedFactions = computed(() => {
  if (Array.isArray(props.faction)) {
    return props.faction.map(f => f.toLowerCase())
  }
  return props.faction ? [props.faction.toLowerCase()] : ['neutral']
})

const displayedNonNeutralFactions = computed(() => {
  return displayedFactions.value.filter(f => f !== 'neutral')
})

// Faction icon mappings
const factionIcons = {
  'empire': '@',
  'force': 'h', 
  'resistance': '!',
  'firstorder': '+',
  'scum': '#',
  'republic': '/',
  'separatist': '.',
  'neutral': ''
}

function getFactionIcon(faction) {
  return factionIcons[faction] || ''
}

function getFactionBookmarkClass(faction) {
  return `faction-bookmark-${faction}`
}
const typeLetter = computed(() => tokenToLetterMap[(props.type || '').toLowerCase()] || '?')
const energyLetter = 'g'
const forceLetter = 'h'
const recurringSymbols = ['', '`', '_', '', '']

const recurringSymbol = (count) => {
  const val = Number(count)
  if (val === -1) {
    return recurringSymbols[4]
  }
  return recurringSymbols[Math.min(Math.max(val, 0), 3)]
}


const displayedName = computed(() => {
  const baseName = flipped.value && props.flippable ? props.flippedName || props.name : props.name;
  return baseName;
});
const displayedImage = computed(() => flipped.value && props.flippable ? props.flippedImage || props.image : props.image)
const displayedDescription = computed(() => {
  const raw = flipped.value && props.flippable ? props.flippedDescription || '' : props.description || '';

  // First, replace tokens, handling ! prefix for red color
  let replaced = raw.replace(/(!)?\{([^}]+)\}/g, (_, exclamation, token) => {
    const letter = tokenToLetterMap[token.toLowerCase()] || '?';
    const span = `<span class="font-[xwing]">${letter}</span>`;

    if (exclamation) {
      return `<span class="text-red-400">${span}</span>`;
    }
    return span;
  });

  // Then, bold full words directly before a colon (including the colon)
  // \b(\w+):  matches a whole word before colon, capturing the word + colon
  replaced = replaced.replace(/\b(\w+):/g, '<span class="font-semibold">$1:</span>');

  return replaced;
});



const displayedRequires = computed(() => {
  const raw = props.requires || ''
  return raw.replace(/\{([^}]+)\}/g, (_, token) => {
    const letter = tokenToLetterMap[token.toLowerCase()] || '?'
    return `<span class="font-[xwing]">${letter}</span>`
  })
})

const displayedEnergy = computed(() => {
  const val = flipped.value ? props.flippedEnergy : props.energy
  if (val == null) return null;
  const baseEnergy = Number(val);
  return baseEnergy + (props.upgradeLevel || 0);
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

const cardHash = computed(() => {
  // Create a simple hash from the card ID for unique visual variations
  let hash = 0;
  const str = props.id || props.name || 'default';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 1000;
})

function handleClick() {
  emit('card-click', {
    id: props.id,
    name: props.name,
    cost: Number(props.cost),
  })
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

.custom-holographic-overlay {
  background: linear-gradient(45deg,
      rgba(128, 0, 255, 0.2),
      rgba(255, 0, 128, 0.2),
      rgba(0, 255, 255, 0.2),
      rgba(255, 128, 0, 0.2),
      rgba(128, 0, 255, 0.2));
  background-size: 600% 600%;
  mix-blend-mode: color-dodge;
  animation: customHolo 20s ease-in-out infinite;
  opacity: 0.3;
}

@keyframes customHolo {
  0%, 100% {
    background-position: 0% 50%;
    filter: hue-rotate(0deg) saturate(150%);
  }
  25% {
    background-position: 100% 0%;
    filter: hue-rotate(90deg) saturate(200%);
  }
  50% {
    background-position: 100% 100%;
    filter: hue-rotate(180deg) saturate(150%);
  }
  75% {
    background-position: 0% 100%;
    filter: hue-rotate(270deg) saturate(200%);
  }
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

.faction-bookmark {
  position: relative;
  width: 2.5rem;
  height: 3rem;
  margin-right: 0.25rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.faction-bookmark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
}

/* All factions use the same shape now, just different colors */
.faction-bookmark-empire::before {
  background-color: var(--color-empire);
}

.faction-bookmark-force::before {
  background-color: var(--color-force);
}

.faction-bookmark-resistance::before {
  background-color: var(--color-resistance);
}

.faction-bookmark-firstorder::before {
  background-color: var(--color-firstorder);
}

.faction-bookmark-scum::before {
  background-color: var(--color-scum);
}

.faction-bookmark-republic::before {
  background-color: var(--color-republic);
}

.faction-bookmark-separatist::before {
  background-color: var(--color-separatist);
}

.faction-icon-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-family: 'xwing';
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.faction-icon {
  font-family: 'xwing';
  width: 2rem;
  height: 2rem;
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


.custom-space-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  overflow: hidden;
}

.stars-field {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #fff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: starsTwinkle 8s ease-in-out infinite;
  z-index: 2;
}

.nebula-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--card-hash, 300) * 0.1% calc(var(--card-hash, 300) * 0.08%), 
    rgba(147, 51, 234, 0.3) 0%, 
    rgba(59, 7, 100, 0.2) 30%, 
    transparent 70%);
  animation: nebulaShift 15s ease-in-out infinite;
  z-index: 3;
}

.card-type-symbol {
  position: absolute;
  width: 100%;
  height: 90%;
  opacity: 0.25;
  font-family: 'xwing';
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  color: rgb(233, 213, 255); /* purple-200 equivalent */
  text-shadow: 
    0 0 15px rgba(233, 213, 255, 0.8),
    0 0 30px rgba(233, 213, 255, 0.4),
    0 0 45px rgba(233, 213, 255, 0.2);
  animation: symbolGlow 10s ease-in-out infinite, symbolPulse 8s ease-in-out infinite;
  z-index: 5;
}

.top-half-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(23, 23, 23); /* bg-neutral-900 equivalent */
  z-index: 1;
}

.image-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, 
    rgba(15, 15, 35, 0.8) 0%,
    rgba(26, 26, 46, 0.6) 50%,
    transparent 100%);
  z-index: 10;
}

.hyperspace-lines {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      calc(var(--card-hash) * 0.18deg),
      transparent 0px,
      rgba(255,255,255,0.15) 1px,
      transparent 2px,
      transparent 30px
    ),
    repeating-linear-gradient(
      calc(var(--card-hash) * -0.12deg + 45deg),
      transparent 0px,
      rgba(64, 224, 255, 0.1) 1px,
      transparent 2px,
      transparent 25px
    ),
    repeating-linear-gradient(
      calc(var(--card-hash) * 0.24deg + 90deg),
      transparent 0px,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 3px,
      transparent 40px
    );
  animation: hyperspaceMove 8s linear infinite, hyperspaceShimmer 12s ease-in-out infinite;
  z-index: 4;
}

@keyframes starsTwinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes nebulaShift {
  0%, 100% { 
    filter: hue-rotate(0deg) brightness(1);
    transform: scale(1) rotate(0deg);
  }
  33% { 
    filter: hue-rotate(60deg) brightness(1.2);
    transform: scale(1.1) rotate(2deg);
  }
  66% { 
    filter: hue-rotate(-60deg) brightness(0.8);
    transform: scale(0.9) rotate(-2deg);
  }
}

@keyframes hyperspaceMove {
  0% { transform: translateX(-150px) translateY(-30px); }
  100% { transform: translateX(150px) translateY(30px); }
}

@keyframes hyperspaceShimmer {
  0%, 100% { 
    opacity: 1;
    filter: brightness(1);
  }
  50% { 
    opacity: 0.6;
    filter: brightness(1.4);
  }
}

@keyframes symbolGlow {
  0%, 100% { 
    text-shadow: 
      0 0 15px rgba(233, 213, 255, 0.8),
      0 0 30px rgba(233, 213, 255, 0.4),
      0 0 45px rgba(233, 213, 255, 0.2);
  }
  50% { 
    text-shadow: 
      0 0 20px rgba(233, 213, 255, 1),
      0 0 40px rgba(233, 213, 255, 0.6),
      0 0 60px rgba(233, 213, 255, 0.3);
  }
}

@keyframes symbolPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
