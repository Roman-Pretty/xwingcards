<template>
  <div class="flex flex-row gap-4 flex-wrap">
    <div v-for="rank in ranks" :key="rank.rank"
      class="flex flex-col items-center gap-2 bg-neutral-800 p-3 rounded flex-1 cursor-pointer transition-transform duration-300"
      :class="{
        'bg-yellow-700 hover:cursor-auto border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)]': getRankStatus(pilotRank, rank.rank) === 'current',
        'bg-yellow-800 hover:cursor-auto': getRankStatus(pilotRank, rank.rank) === 'unlocked',
        'hover:bg-yellow-700 hover:scale-105': getRankStatus(pilotRank, rank.rank) === 'next',
        'opacity-40 pointer-events-none cursor-default': getRankStatus(pilotRank, rank.rank) === 'locked',
      }"
      @click="getRankStatus(pilotRank, rank.rank) === 'next' && onRankClick(rank)"
    >
      <div class="flex items-center justify-between w-full p-1 border-b-2 border-b-white/10">
        <span>Rank {{ rank.rank }}</span>
        <span class="text-amber-500">In {{ rank.initiative }}</span>
      </div>

      <div v-if="rank.slots?.length" class="flex items-center justify-center gap-2 flex-wrap">
        <span v-for="slot in rank.slots" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
          {{ slot }}
        </span>
      </div>

      <div v-if="rank.optionalslots?.length" class="flex items-center justify-center gap-2 flex-wrap">
        <span v-for="(slot, index) in rank.optionalslots" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
          <span class="inria-sans-light text-xl" v-if="index !== 0">/ </span>{{ slot }}
        </span>
      </div>

      <div v-if="rank.faction?.length" class="flex items-center justify-center gap-2 flex-wrap">
        <span v-for="slot in rank.faction" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
          {{ slot }}
        </span>
      </div>

      <div v-if="rank.ships?.length" class="flex items-center justify-center gap-2 flex-wrap">
        <span v-for="slot in rank.ships" :key="slot" class="font-[ships] text-2xl font-extralight opacity-60 -mt-1">
          {{ slot }}
        </span>
      </div>

      <span class="mt-auto">
        <span v-if="['next', 'locked'].includes(getRankStatus(pilotRank, rank.rank))">{{ rank.xp }}</span>
        <span v-else class="opacity-20">Unlocked</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePilotStore } from '../stores/pilotStore'

const store = usePilotStore()
const pilotRank = computed(() => store.currentPilot?.rank ?? 0)

const ranks = [
  { rank: 1, xp: 'FREE', initiative: 2, faction: ['!'] },
  { rank: 2, xp: '9 XP', initiative: 3, optionalslots: ['x', 'E'], ships: ['a', 'h', 'b'] },
  { rank: 3, xp: '12 XP', initiative: 4, ships: ['{'], slots: ['m'] },
  { rank: 4, xp: '15 XP', initiative: 5, optionalslots: ['x', 'E', 'F'], faction: ['!'], ships: ['w', 'E'] },
  { rank: 5, xp: '18 XP', initiative: 6, slots: ['m', 'x'] },
  { rank: 6, xp: '21 XP', initiative: 7, slots: [')'] },
]

const getRankStatus = (pilotRank, thisRank) => {
  if (thisRank < pilotRank) return 'unlocked'
  if (thisRank === pilotRank) return 'current'
  if (thisRank === pilotRank + 1) return 'next'
  return 'locked'
}

const onRankClick = (rank) => {
  console.log('Clicked on rank:', rank.rank)
}
</script>
