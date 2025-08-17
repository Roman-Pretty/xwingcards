<!--
  PilotOverview View
  
  Main view component for displaying detailed pilot information including:
  - Ship overview with stats and maneuver dial
  - Kill tracking system with statistics and milestones
  
  @component PilotOverview
  @requires PilotStore - For accessing current pilot data
  @requires ShipOverviewCard - Ship details and stats display
  @requires KillTrackerCard - Kill tracking and statistics
-->
<template>
  <main class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <header class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-3 lg:p-6">
      <div class="max-w-full lg:max-w-4xl px-2 lg:px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
        <div>
          <h1 class="text-lg lg:text-2xl font-bold text-white mb-1 lg:mb-2">Pilot Overview</h1>
          <p class="text-gray-400 text-xs lg:text-base">Track your pilot's ship kill statistics and milestones</p>
        </div>
        <button class="btn btn-ghost text-white text-sm lg:text-base mt-2 lg:mt-0 self-end lg:self-auto" @click="$router.push('/dashboard')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
          <span class="hidden sm:inline">Close</span>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-full lg:max-w-4xl mx-auto p-2 lg:p-6 space-y-3 lg:space-y-6">
        <ShipOverviewCard :selected-ship="store.currentPilot?.selectedShip" />
        <KillTrackerCard />
      </div>
    </div>
  </main>
</template>

/**
 * PilotOverview View Script
 * 
 * Main logic for the pilot overview page. Handles displaying ship information
 * and kill tracking functionality using componentized structure.
 * 
 * @requires PilotStore - For accessing and managing pilot data
 * @requires ShipOverviewCard - Component for ship display
 * @requires KillTrackerCard - Component for kill tracking
 */
<script setup>
import { usePilotStore } from '../stores/PilotStore'
import ShipOverviewCard from '../components/pilot/ShipOverviewCard.vue'
import KillTrackerCard from '../components/pilot/KillTrackerCard.vue'

/**
 * Pilot store instance for accessing current pilot data
 */
const store = usePilotStore()
</script>
