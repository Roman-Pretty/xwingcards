/**
 * DesktopCardsPanel Component
 * 
 * Desktop right panel for cards with tabs, search, and card display
 */
<template>
  <div class="flex-1 flex flex-col overflow-visible min-h-0">
    <!-- Header -->
    <div class="p-4 border-2 border-neutral-700 rounded-2xl">
      <CardTabsHeader
        :active-tab="activeTab"
        :search-query="searchQuery"
        :selected-type="selectedType"
        :type-options="typeOptions"
        :is-mobile="false"
        @switch-tab="$emit('switch-tab', $event)"
        @update:search-query="$emit('update:search-query', $event)"
        @select-type="$emit('select-type', $event)"
      />
    </div>

    <!-- Cards Section -->
    <section class="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-16 pt-8 min-h-0 relative" 
      :class="{
        'flex flex-row flex-wrap gap-6 justify-evenly content-start': activeTab !== 'hand',
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
          :draggable="activeTab === 'deck' && !isCardTaken(card.id)" 
          @dragstart="$emit('drag-start', card.id, $event)"
          @dragend="$emit('drag-end', $event)" 
          @click="$emit('select-card', card)" 
          :class="getCardClasses(card)"
          @contextmenu.prevent="$emit('right-click-card', card, $event)" 
        />
      </template>

      <!-- Empty State -->
      <EmptyStateMessage
        v-if="cardsToShow.length === 0"
        :active-tab="activeTab"
        :has-filters="hasFilters"
        :is-mobile="false"
        @clear-filters="$emit('clear-filters')"
      />
    </section>

    <!-- Quick Action Buttons - Fixed Position -->
    <QuickActionButtons :is-mobile="false" @navigate="$emit('navigate', $event)" />

    <!-- Context Menu -->
    <div 
      v-if="showContextMenu && contextCard" 
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
      class="absolute z-50 bg-neutral-800 text-white border border-neutral-600 rounded shadow-lg p-2"
      @click.outside="$emit('close-context-menu')"
    >
      <div class="font-semibold cursor-default mb-2 pr-10">Give card to:</div>
      <div v-for="pilot in otherPilots" :key="pilot.id">
        <button 
          class="p-1 px-2 rounded cursor-pointer text-left w-full flex flex-start hover:bg-neutral-700"
          @click="$emit('give-card-to-pilot', pilot.id)"
        >
          {{ pilot.name }}
        </button>
      </div>
    </div>
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
  },
  /** Whether to show context menu */
  showContextMenu: {
    type: Boolean,
    default: false
  },
  /** Context menu X position */
  contextMenuX: {
    type: Number,
    default: 0
  },
  /** Context menu Y position */
  contextMenuY: {
    type: Number,
    default: 0
  },
  /** Card for context menu */
  contextCard: {
    type: Object,
    default: null
  },
  /** Other pilots for context menu */
  otherPilots: {
    type: Array,
    default: () => []
  }
})

/**
 * Component events
 */
defineEmits([
  'switch-tab', 
  'update:search-query', 
  'select-type', 
  'clear-filters', 
  'select-card', 
  'navigate',
  'drag-start',
  'drag-end',
  'right-click-card',
  'close-context-menu',
  'give-card-to-pilot'
])

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
    'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out': 
      props.activeTab === 'deck' && !props.isCardTaken(card.id),
    'cursor-default': 
      props.activeTab !== 'deck',
    'border-2 border-blue-400 shadow-lg': 
      props.activeTab === 'store' && props.canUpgradeCard(card.id)
  }
}
</script>
