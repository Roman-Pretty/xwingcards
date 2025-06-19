<template>
  <div>
    <div class="flex flex-row gap-4 flex-wrap max-w-full">
      <div v-for="rank in ranks" :key="rank.rank"
        class="flex flex-col items-center gap-2 bg-neutral-800 p-3 rounded flex-1 transition-transform duration-300 group"
        :class="{
          'bg-yellow-700 hover:cursor-default border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)]': getRankStatus(pilotRank, rank.rank) === 'current',
          'bg-yellow-800 hover:cursor-default': getRankStatus(pilotRank, rank.rank) === 'unlocked',
          'hover:bg-yellow-700 hover:scale-105 cursor-pointer': getRankStatus(pilotRank, rank.rank) === 'next',
          'opacity-40 pointer-events-none cursor-default': getRankStatus(pilotRank, rank.rank) === 'locked',
        }" @click="getRankStatus(pilotRank, rank.rank) === 'next' && onRankClick(rank)">
        <div class="flex items-center justify-between w-full p-1 border-b-2 border-b-white/10">
          <span>Rank {{ rank.rank }}</span>
          <span class="text-amber-500">In {{ rank.initiative }}</span>
        </div>

        <!-- Slots -->
        <span v-for="slot in rank.slots" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
          <template v-if="slot.includes('<')">
            {{ slot.split('<')[0] }} <sup class="text-xs -mt-2 -ml-2 line-through">{{ slot.split('<')[1] }}</sup>
          </template>
          <template v-else-if="slot.length > 1">
            {{ slot[0] }}
            <sup class="text-xs -mt-2 -ml-2">{{ slot.slice(1) }}</sup>
          </template>
          <template v-else>
            {{ slot }}
          </template>
        </span>

        <!-- Optional Slots -->
        <div v-if="rank.optionalslots?.length" class="flex flex-col items-center gap-1">
          <div v-for="(group, gIndex) in normalizeOptionalSlots(rank.optionalslots)" :key="'group-' + gIndex"
            class="flex items-center justify-center gap-1 flex-wrap">
            <span v-for="(slot, index) in group" :key="slot + '-' + index"
              class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
              <span class="inria-sans-light text-xl" v-if="index !== 0">/ </span>
              <template v-if="slot.includes('<')">
                {{ slot.split('<')[0] }} <sup class="text-xs -mt-2 -ml-2 line-through">{{ slot.split('<')[1] }}</sup>
              </template>
              <template v-else-if="slot.length > 1">
                {{ slot[0] }}
                <sup class="text-xs -mt-2 -ml-2">{{ slot.slice(1) }}</sup>
              </template>
              <template v-else>
                {{ slot }}
              </template>
            </span>
          </div>
        </div>

        <!-- Faction -->
        <div v-if="rank.faction?.length" class="flex items-center justify-center gap-2 flex-wrap">
          <span v-for="slot in rank.faction" :key="slot" class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
            {{ slot }}
          </span>
        </div>

        <!-- Other -->
        <div v-if="rank.other?.length" class="flex items-center justify-center gap-2 flex-wrap">
          <template v-for="(other, index) in rank.other" :key="index">
            <span class="font-[xwing] text-2xl font-extralight opacity-60 -mt-1">
              <template v-if="other.includes('<')">
                {{ other.split('<')[0] }}<span :class="{
                  'text-red-800 ': getRankStatus(pilotRank, rank.rank) === 'current',
                  'text-red-800': getRankStatus(pilotRank, rank.rank) === 'unlocked',
                  'text-red-400 group group-hover:text-red-300': getRankStatus(pilotRank, rank.rank) === 'next',
                  'text-red-400': getRankStatus(pilotRank, rank.rank) === 'locked',
                }">{{ other.split('<')[1] }}</span>
              </template>
              <template v-else>
                {{ other }}
              </template>
            </span>
          </template>
        </div>

        <div v-if="rank.ships?.length" class="flex items-center justify-center gap-2 flex-wrap">
          <span v-for="slot in rank.ships" :key="slot" class="font-[ships] text-2xl font-extralight opacity-60 -mt-1">
            {{ slot }}
          </span>
        </div>

        <span class="mt-auto">
          <span v-if="['next', 'locked'].includes(getRankStatus(pilotRank, rank.rank))">
            <span class="font-[xwing] text-lg ">Ì</span>{{ rank.xp }}
          </span>
          <span v-else class="opacity-20">Unlocked</span>
        </span>
      </div>
    </div>

    <!-- Confirm Rank Purchase Modal -->
    <dialog id="confirm_rank_modal" class="modal">
      <div class="modal-box bg-neutral-800 text-white">
        <h3 class="text-lg font-bold mb-2">Confirm Rank Upgrade</h3>
        <p class="mb-4">
          Are you sure you want to upgrade to Rank <strong>{{ pendingRank?.rank }}</strong> for
          <span class="font-[xwing] text-lg">Ì</span>{{ pendingRank?.xp }}?
        </p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button type="button" class="btn" @click="confirmRankPurchase">Confirm</button>
            <button class="btn btn-neutral" @click="cancelRankPurchase">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePilotStore } from '../stores/pilotStore'
import classData from '../data/classes.json'

const store = usePilotStore()
const pilotRank = computed(() => store.currentPilot?.rank ?? 0)
const currentPilot = computed(() => store.currentPilot)

const ranks = computed(() => {
  return classData[store.currentPilot?.class]?.ranks || []
})

function normalizeOptionalSlots(optionals) {
  if (!optionals) return [];
  if (!Array.isArray(optionals[0])) {
    return [optionals];
  }
  return optionals;
}

const getRankStatus = (pilotRank, thisRank) => {
  if (thisRank < pilotRank) return 'unlocked'
  if (thisRank === pilotRank) return 'current'
  if (thisRank === pilotRank + 1) return 'next'
  return 'locked'
}

const pendingRank = ref(null)

const onRankClick = (rank) => {
  if (!currentPilot.value) return
  if (rank.rank !== pilotRank.value + 1) return

  pendingRank.value = rank
  const modal = document.getElementById('confirm_rank_modal')
  if (modal?.showModal) {
    modal.showModal()
  }
}

function confirmRankPurchase() {
  if (!pendingRank.value) return
  const pilot = currentPilot.value
  if (!pilot) return

  if (pilot.xp >= pendingRank.value.xp) {
    pilot.xp -= pendingRank.value.xp
    pilot.rank = pendingRank.value.rank
  } else {
    alert('Not enough XP to upgrade rank.')
  }
  closeRankModal()
}

function cancelRankPurchase() {
  closeRankModal()
}

function closeRankModal() {
  const modal = document.getElementById('confirm_rank_modal')
  if (modal?.close) {
    modal.close()
  }
  pendingRank.value = null
}
</script>
