<template>
  <div class="flex flex-row gap-4 flex-wrap">
    <div v-for="rank in ranks" :key="rank.rank"
      class="flex flex-col items-center gap-2 bg-neutral-800 p-3 rounded flex-1 cursor-pointer transition-transform duration-300"
      :class="{
        'bg-yellow-700 hover:cursor-auto border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)]': getRankStatus(pilotRank, rank.rank) === 'current',
        'bg-yellow-800 hover:cursor-auto': getRankStatus(pilotRank, rank.rank) === 'unlocked',
        'hover:bg-yellow-700 hover:scale-105': getRankStatus(pilotRank, rank.rank) === 'next',
        'opacity-40 pointer-events-none cursor-default': getRankStatus(pilotRank, rank.rank) === 'locked',
      }" @click="getRankStatus(pilotRank, rank.rank) === 'next' && onRankClick(rank)">
      <div class="flex items-center justify-between w-full p-1 border-b-2 border-b-white/10">
        <span>Rank {{ rank.rank }}</span>
        <span class="text-amber-500">In {{ rank.initiative }}</span>
      </div>

      <!-- Slots -->
      <span v-for="slot in rank.slots" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
        <template v-if="slot.includes('<')">
          {{ slot.split('<')[0] }} <sup class="text-xs -mt-2 line-through">{{ slot.split('<')[1] }}</sup>
        </template>
        <template v-else-if="slot.length > 1">
          {{ slot[0] }}
          <sup class="text-xs -mt-2">{{ slot.slice(1) }}</sup>
        </template>
        <template v-else>
          {{ slot }}
        </template>
      </span>

      <!-- Optional Slots -->
      <div v-if="rank.optionalslots?.length" class="flex items-center justify-center gap-2 flex-wrap">
        <span v-for="(slot, index) in rank.optionalslots" :key="slot"
          class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
          <span class="inria-sans-light text-xl" v-if="index !== 0">/ </span>
          <template v-if="slot.includes('<')">
            {{ slot.split('<')[0] }} <sup class="text-xs -mt-2 line-through">{{ slot.split('<')[1] }}</sup>
          </template>
          <template v-else-if="slot.length > 1">
            {{ slot[0] }}
            <sup class="text-xs -mt-2">{{ slot.slice(1) }}</sup>
          </template>
          <template v-else>
            {{ slot }}
          </template>
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
import classData from '../data/classes.json'


const store = usePilotStore()
const pilotRank = computed(() => store.currentPilot?.rank ?? 0)


const ranks = computed(() => {
  return classData[store.currentPilot?.class]?.ranks || []
})

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
