/**
 * GroupStatistics Component
 * 
 * Displays summary statistics for the selected pilot group
 */
<template>
  <div class="flex justify-center items-center gap-6 text-center">
    <StatisticItem
      :value="averageRank"
      label="Average Rank"
      color="yellow"
      size="2xl"
    />
    <StatisticItem
      :value="selectedCount"
      label="Selected Pilots"
      color="blue"
      size="xl"
    />
    <StatisticItem
      :value="totalXp"
      label="Total XP"
      color="green"
      size="xl"
    />
  </div>
</template>

<script setup>
import StatisticItem from './StatisticItem.vue'

/**
 * Component props
 */
defineProps({
  /** Average rank of selected pilots */
  averageRank: {
    type: Number,
    required: true
  },
  /** Number of selected pilots */
  selectedCount: {
    type: Number,
    required: true
  },
  /** Total XP of selected pilots */
  totalXp: {
    type: Number,
    required: true
  }
})
</script>
