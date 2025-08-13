/**
 * ShipAbilityLetters Component
 * 
 * Displays ship ability letters with proper coloring and multi-character support
 */
<template>
  <div class="mb-3">
    <div class="flex justify-evenly items-center gap-2">
      <div 
        v-for="letter in abilityLetters" 
        :key="letter.id"
        class="font-[xwing] text-lg flex items-center justify-center"
      >
        <template v-if="letter.symbol.includes('*')">
          <span 
            v-for="(char, index) in letter.symbol.replace('*', '')" 
            :key="index"
            :class="index === 2 ? 'text-red-400' : letter.color"
          >
            {{ char }}
          </span>
        </template>
        <template v-else>
          <span :class="letter.color">{{ letter.symbol }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Component props
 */
defineProps({
  /** Array of ability letter objects with id, symbol, and color */
  abilityLetters: {
    type: Array,
    required: true
  }
})
</script>
