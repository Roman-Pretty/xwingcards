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
            <!-- Faction icon -->
            <div class="corner absolute top-1 left-1 z-20 flex items-center justify-cente">
                <div v-if="factionClass === 'empire'" class="faction-icon font-[xwing] bg-empire text-xs"><span>@</span>
                </div>
                <div v-else-if="factionClass === 'force'" class="faction-icon font-[xwing] bg-force text-xs">
                    <span>h</span></div>
                <div v-else-if="factionClass === 'resistance'" class="faction-icon font-[xwing] bg-resistance text-xs">
                    <span>!</span></div>
                <div v-else-if="factionClass === 'firstorder'" class="faction-icon font-[xwing] bg-firstorder text-xs">
                    <span>+</span></div>
                <div v-else-if="factionClass === 'scum'" class="faction-icon font-[xwing] bg-scum text-xs">
                    <span>#</span></div>
                <div v-else-if="factionClass === 'republic'" class="faction-icon font-[xwing] bg-republic text-xs">
                    <span>/</span></div>
                <div v-else-if="factionClass === 'separatist'" class="faction-icon font-[xwing] bg-separatist text-xs">
                    <span>.</span></div>
            </div>

            <!-- Upgrade level indicator -->
            <div v-if="upgradeLevel > 0"
                class="absolute top-1 right-1 flex items-center justify-center w-[1rem] h-[1rem] text-xs font-semibold rounded-full bg-slate-800 bg-opacity-90 text-white select-none z-20">
                <span>+{{ upgradeLevel }}</span>
            </div>

            <!-- Flip indicator -->
            <div v-if="flippable" class="absolute bottom-1 left-1 text-white z-30 opacity-50 text-xs">
                <kbd class="kbd text-black kbd-xs bg-white">F</kbd>
            </div>

            <img :src="displayedImage" alt="Card art" class="w-full h-full object-cover z-10 relative" />
        </div>

        <!-- Main content section (right side) -->
        <div class="flex-1 p-3 flex flex-col justify-between">
            <!-- Header row -->
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold text-white mb-1 truncate">
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
                                <span class="ml-2 text-white/80">{{ ranged }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- Description -->
            <div class="flex-1">
                <p class="text-xs text-neutral-300 leading-relaxed line-clamp-3" v-html="displayedDescription"></p>
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
    faction: String,
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

const factionClass = computed(() => (props.faction || '').toLowerCase() || 'neutral')
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
</style>
