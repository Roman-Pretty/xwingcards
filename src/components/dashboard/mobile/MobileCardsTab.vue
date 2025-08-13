/**
 * MobileCardsTab Component
 * 
 * Mobile view for cards with tabs, search, and card display
 */
<template>
  <div class="flex-1 flex flex-col overflow-visible min-h-0 pb-20">
    <!-- Header with tabs and controls -->
    <div class="p-4 border-b-2 border-neutral-700">
      <CardTabsHeader
        :active-tab="activeTab"
        :search-query="searchQuery"
        :selected-type="selectedType"
        :type-options="typeOptions"
        :is-mobile="true"
        @switch-tab="$emit('switch-tab', $event)"
        @update:search-query="$emit('update:search-query', $event)"
        @select-type="$emit('select-type', $event)"
      />
    </div>

    <!-- Cards Section -->
    <section class="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0 relative" 
      :class="{
        'flex flex-row flex-wrap gap-4 justify-evenly content-start': activeTab !== 'hand',
        'flex flex-col': activeTab === 'hand'
      }"
    >
      <!-- Hand Tab - Compact Display -->
      <template v-if="activeTab === 'hand'">
        <div class="w-full space-y-3">
          <CardSummary 
            v-for="(card, index) in cardsToShow" 
            :key="card?.id || card?.name || index" 
            v-bind="card"
            :showXP="false" 
            :upgradeLevel="getCardUpgradeLevel(card.id)" 
            @click="$emit('select-card', card)" 
            class="w-full" 
          />
        </div>
      </template>

      <!-- Deck and Store Tabs - Regular Display -->
      <template v-else>
        <Card 
          v-for="(card, index) in cardsToShow" 
          :key="card?.id || card?.name || index" 
          v-bind="card"
          :showXP="activeTab === 'store'" 
          :owned="activeTab === 'store' && isCardOwned(card.id)"
          :canUpgrade="activeTab === 'store' && canUpgradeCard(card.id)"
          :upgradeLevel="getCardUpgradeLevel(card.id)"
          :mobile-mode="true"
          @click="$emit('select-card', card)" 
          :class="getCardClasses(card)"
        />
      </template>

      <!-- Empty State -->
      <EmptyStateMessage
        v-if="cardsToShow.length === 0"
        :active-tab="activeTab"
        :has-filters="hasFilters"
        :is-mobile="true"
        @clear-filters="$emit('clear-filters')"
      />
    </section>

    <!-- Quick Action Buttons - Fixed Position -->
    <QuickActionButtons :is-mobile="true" @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import Card from '../../cards/Card.vue'
import CardSummary from '../../cards/CardSummary.vue'
import CardTabsHeader from '../CardTabsHeader.vue'
import QuickActionButtons from '../QuickActionButtons.vue'
import EmptyStateMessage from '../EmptyStateMessage.vue'

/**
 * Component props
 */
defineProps({
  /** Currently active tab */
  activeTab: {
    type: String,
    required: true
  },
  /** Current search query */
  searchQuery: {
    type: String,
    required: true
  },
  /** Currently selected type filter */
  selectedType: {
    type: String,
    required: true
  },
  /** Available card type options */
  typeOptions: {
    type: Array,
    required: true
  },
  /** Cards to display */
  cardsToShow: {
    type: Array,
    required: true
  },
  /** Whether filters are applied */
  hasFilters: {
    type: Boolean,
    required: true
  },
  /** Function to get card upgrade level */
  getCardUpgradeLevel: {
    type: Function,
    required: true
  },
  /** Function to check if card is owned */
  isCardOwned: {
    type: Function,
    required: true
  },
  /** Function to check if card can be upgraded */
  canUpgradeCard: {
    type: Function,
    required: true
  },
  /** Function to check if card is taken */
  isCardTaken: {
    type: Function,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['switch-tab', 'update:search-query', 'select-type', 'clear-filters', 'select-card', 'navigate'])

/**
 * Get CSS classes for card based on state
 * @param {Object} card - Card object
 * @returns {Object} CSS class object
 */
function getCardClasses(card) {
  const props = getCurrentInstance().props
  return {
    'pointer-events-none opacity-50': 
      props.isCardOwned(card.id) && props.activeTab === 'store' && !props.canUpgradeCard(card.id),
    'opacity-50 cursor-not-allowed': 
      props.activeTab === 'deck' && props.isCardTaken(card.id),
    'cursor-pointer': 
      props.activeTab === 'deck' && !props.isCardTaken(card.id),
    'cursor-default': 
      props.activeTab !== 'deck',
    'border-2 border-blue-400 shadow-lg': 
      props.activeTab === 'store' && props.canUpgradeCard(card.id)
  }
}
</script>
