/**
 * DesktopLoadoutPanel Component
 * 
 * Desktop left panel containing pilot info, loadout, ships, and rank
 */
<template>
  <div class="flex-1 border-2 border-neutral-700 rounded-2xl flex flex-col justify-between text-white overflow-hidden">
    <div class="flex flex-col justify-between h-full">
      <!-- Pilot Header -->
      <div class="flex-1 p-4">
        <PilotHeader
          :pilot-class="pilotClass"
          :class-icon="classIcon"
          :class-color="classColor"
          :pilot-xp="pilotXp"
          :force-count="forceCount"
          :show-base-force="showBaseForce"
          :show-force-count="showForceCount"
          @add-xp="$emit('add-xp')"
          @add-pilot="$emit('add-pilot')"
        />
      </div>

      <!-- Loadout, Ships, and Rank Sections -->
      <div class="flex flex-col w-full p-4 overflow-x-auto">
        <!-- Loadout Section -->
        <div>
          <LoadoutHeader
            :faction-counts="factionCounts"
            :used-slots="usedSlots"
          />
          <Slots class="w-full" :currently-dragged-card="currentlyDraggedCard" />
        </div>

        <!-- Ships Section -->
        <div>
          <h2 class="text-lg mb-4">Ships</h2>
          <Ships />
        </div>

        <!-- Rank Section -->
        <div>
          <h2 class="text-lg mb-4">Rank</h2>
          <RankList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PilotHeader from '../PilotHeader.vue'
import LoadoutHeader from '../LoadoutHeader.vue'
import Slots from '../../slots/Slots.vue'
import Ships from '../../sections/Ships.vue'
import RankList from '../../sections/RankList.vue'

/**
 * Component props
 */
defineProps({
  /** Pilot class name */
  pilotClass: {
    type: String,
    required: true
  },
  /** Pilot class icon */
  classIcon: {
    type: String,
    required: true
  },
  /** Pilot class color */
  classColor: {
    type: String,
    required: true
  },
  /** Current pilot XP */
  pilotXp: {
    type: Number,
    required: true
  },
  /** Force count from equipped cards */
  forceCount: {
    type: Number,
    default: 0
  },
  /** Whether to show base force for Force Users */
  showBaseForce: {
    type: Boolean,
    default: false
  },
  /** Whether to show force count display */
  showForceCount: {
    type: Boolean,
    default: false
  },
  /** Unlocked faction counts */
  factionCounts: {
    type: Object,
    required: true
  },
  /** Used faction slots */
  usedSlots: {
    type: Object,
    required: true
  },
  /** Currently dragged card */
  currentlyDraggedCard: {
    type: Object,
    default: null
  }
})

/**
 * Component events
 */
defineEmits(['add-xp', 'add-pilot'])
</script>
