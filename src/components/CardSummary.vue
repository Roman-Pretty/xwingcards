<template>
    <div @click="handleClick" @mouseenter="isHovered = true" @mouseleave="isHovered = false" :class="[
        'inria-sans-regular group bg-neutral-800 cursor-pointer w-full min-h-[5rem] rounded-lg shadow-md overflow-hidden flex flex-row transition-all duration-200 ease-in-out hover:bg-neutral-700 hover:shadow-lg relative border border-neutral-600',
    ]">

        <!-- Unequip overlay on hover - covers whole card -->
        <div
            class="absolute inset-0 bg-red-700/80 cursor-pointer text-white text-center flex items-center justify-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-40">
            Click to Unequip
        </div>

        <div v-if="unique" class="holographic-overlay pointer-events-none absolute inset-0 z-30" />

        <!-- Compact image section (left side) -->
        <div class="w-20 flex-shrink-0 relative overflow-hidden rounded-l-lg">
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
            
            <!-- Faction icon(s) - bookmark style -->
            <div class="absolute top-0 left-0 z-20 flex flex-row">
                <div v-for="(factionName, index) in displayedNonNeutralFactions" :key="factionName" 
                     :class="getFactionBookmarkClass(factionName)"
                     class="faction-bookmark-small">
                    <div class="faction-icon-content-small">
                        <span>{{ getFactionIcon(factionName) }}</span>
                    </div>
                </div>
            </div>

            <!-- Upgrade level indicator -->
            <div v-if="upgradeLevel > 0"
                class="absolute top-1 right-1 flex items-center justify-center w-[1.2rem] h-[1.2rem] text-xs font-semibold rounded-full bg-slate-800 bg-opacity-90 text-white select-none z-20">
                <span>+{{ upgradeLevel }}</span>
            </div>

            <!-- Flip indicator -->
            <div v-if="flippable" class="absolute bottom-1 left-1 text-white z-30 opacity-50 text-xs">
                <kbd class="kbd text-black kbd-xs bg-white">F</kbd>
            </div>

            <!-- Initiative indicator -->
            <div v-if="initiative && !flippable" class="absolute bottom-1 left-1 text-yellow-400 z-30 text-xs font-bold">
                In {{ initiative }}
            </div>

            <!-- Assist indicator -->
            <div v-if="assist" class="absolute bottom-1 right-1 text-gray-400 z-30 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-icon lucide-chevrons-up">
                    <path d="m17 11-5-5-5 5"/>
                    <path d="m17 18-5-5-5 5"/>
                </svg>
            </div>

            <!-- Regular image when image is provided -->
            <img v-if="displayedImage" :src="displayedImage" alt="Card art" class="w-full h-full object-cover z-10 relative" />
        </div>

        <!-- Main content section (right side) -->
        <div class="flex-1 p-3 flex flex-col justify-between">
            <!-- Header row -->
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold mb-1 truncate" :class="{
                        'text-purple-200': custom,
                        'text-white': !custom
                    }">
                        <span v-if="unique" class="font-[xwing] mr-1 text-sm">u</span>{{ displayedName }}
                    </h3>
                    <div class="flex items-center gap-2">
                        <div v-if="requires"
                            class="text-xs text-neutral-400 bg-neutral-700 px-2 py-1 rounded inline-block">
                            <span class="text-xs text-neutral-content leading-snug" v-html="displayedRequires"></span>
                        </div>
                        <!-- Attack stats (if applicable) -->
                        <div v-if="damage" class="flex items-center gap-2">
                            <div class="text-sm text-red-400 flex items-center gap-1">
                                <span class="font-[xwing] text-base">{{ arc }}</span>
                                <span class="font-semibold">{{ damage }}</span>
                                <span v-if="isMissile" class="font-[xwing] text-base">?</span>
                                <span class="ml-2 text-white/80">Range {{ ranged }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- Description -->
            <div class="flex-1">
                <p class="text-xs leading-relaxed line-clamp-3" :class="{
                    'text-purple-200': custom,
                    'text-neutral-300': !custom
                }" v-html="displayedDescription"></p>
            </div>

            <!-- Bottom row with tokens -->
            <div class="flex items-center justify-between mt-2">
                <!-- Energy/Force Display -->
                <div v-if="hasAnyToken" class="flex space-x-3 items-center">
                    <template v-if="displayedEnergy !== null">
                        <div class="flex items-center space-x-1 text-yellow-400 text-sm">
                            <span class="font-[xwing] text-base">{{ energyLetter }}</span>
                            <span v-if="displayedRecurringEnergy" class="font-[xwing] text-base">{{
                                displayedRecurringEnergy }}</span>
                            <span class="font-semibold">{{ displayedEnergy }}</span>
                        </div>
                    </template>

                    <template v-if="displayedForce !== null">
                        <div class="flex items-center space-x-1 text-force text-sm">
                            <span class="font-[xwing] text-base">{{ forceLetter }}</span>
                            <span v-if="displayedRecurringForce" class="font-[xwing] text-base">{{
                                displayedRecurringForce }}</span>
                            <span class="font-semibold">{{ displayedForce }}</span>
                        </div>
                    </template>
                </div>

                <!-- Empty space to push content left if no tokens -->
                <div v-else></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { tokenToLetterMap } from '../utils/mappings'

const props = defineProps({
    id: String,
    name: String,
    type: String,
    faction: [String, Array],
    cost: [Number, String],
    description: String,
    flippedName: String,
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
const recurringSymbols = ['', '`', '_', '', '']

const recurringSymbol = (count) => {
    const val = Number(count)
    if (val === -1) {
        return recurringSymbols[4]
    }
    return recurringSymbols[Math.min(Math.max(val, 0), 3)]
}

const displayedName = computed(() => {
    const baseName = flipped.value && props.flippable ? props.flippedName || props.name : props.name;
    return props.upgradeLevel > 0 ? `${baseName} (Upgraded)` : baseName;
});

const displayedImage = computed(() => {
    return flipped.value && props.flippable ? props.flippedImage || props.image : props.image;
});

const displayedDescription = computed(() => {
    const raw = flipped.value && props.flippable ? props.flippedDescription || props.description : props.description
    if (!raw) return ''

    // First, replace tokens, handling ! prefix for red color and @ prefix for light pinkish purple color
    let replaced = raw.replace(/([!@])?\{([^}]+)\}/g, (_, prefix, token) => {
        const letter = tokenToLetterMap[token.toLowerCase()] || '?';
        const span = `<span class="font-[xwing]">${letter}</span>`;

        if (prefix === '!') {
            return `<span class="text-red-400">${span}</span>`;
        } else if (prefix === '@') {
            return `<span class="text-pink-300">${span}</span>`;
        }
        return span;
    });

    // Then, bold full words directly before a colon (including the colon)
    replaced = replaced.replace(/\b(\w+):/g, '<span class="font-semibold">$1:</span>');

    return replaced;
})

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
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

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

.faction-icon {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.2rem;
    color: white;
    font-weight: light;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    font-size: 0.75rem;
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
        radial-gradient(1px 1px at 10px 15px, #fff, transparent),
        radial-gradient(1px 1px at 20px 35px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 45px 20px, #fff, transparent),
        radial-gradient(1px 1px at 65px 40px, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 80px 15px, #fff, transparent);
    background-repeat: repeat;
    background-size: 100px 50px;
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
    transform: translate(-50%, -50%);
    width: 100%;
    height: 90%;
    opacity: 0.25;
    font-family: 'xwing';
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: rgb(233, 213, 255); /* purple-200 equivalent */
    text-shadow: 
        0 0 8px rgba(233, 213, 255, 0.8),
        0 0 15px rgba(233, 213, 255, 0.4),
        0 0 22px rgba(233, 213, 255, 0.2);
    animation: symbolGlow 6s ease-in-out infinite, symbolPulse 4s ease-in-out infinite;
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
            transparent 15px
        ),
        repeating-linear-gradient(
            calc(var(--card-hash) * -0.12deg + 45deg),
            transparent 0px,
            rgba(64, 224, 255, 0.1) 1px,
            transparent 2px,
            transparent 12px
        );
    animation: hyperspaceMove 8s linear infinite, hyperspaceShimmer 12s ease-in-out infinite;
    z-index: 4;
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
    0% { transform: translateX(-75px) translateY(-15px); }
    100% { transform: translateX(75px) translateY(15px); }
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
            0 0 8px rgba(233, 213, 255, 0.8),
            0 0 15px rgba(233, 213, 255, 0.4),
            0 0 22px rgba(233, 213, 255, 0.2);
    }
    50% { 
        text-shadow: 
            0 0 12px rgba(233, 213, 255, 1),
            0 0 20px rgba(233, 213, 255, 0.6),
            0 0 30px rgba(233, 213, 255, 0.3);
    }
}

@keyframes symbolPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.faction-bookmark-small {
    position: relative;
    width: 1.5rem;
    height: 2rem;
    margin-right: 0.125rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.faction-bookmark-small::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
}

/* All factions use the same shape, just different colors */
.faction-bookmark-empire.faction-bookmark-small::before {
    background-color: var(--color-empire);
}

.faction-bookmark-force.faction-bookmark-small::before {
    background-color: var(--color-force);
}

.faction-bookmark-resistance.faction-bookmark-small::before {
    background-color: var(--color-resistance);
}

.faction-bookmark-firstorder.faction-bookmark-small::before {
    background-color: var(--color-firstorder);
}

.faction-bookmark-scum.faction-bookmark-small::before {
    background-color: var(--color-scum);
}

.faction-bookmark-republic.faction-bookmark-small::before {
    background-color: var(--color-republic);
}

.faction-bookmark-separatist.faction-bookmark-small::before {
    background-color: var(--color-separatist);
}

.faction-icon-content-small {
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
    font-size: 0.9rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
