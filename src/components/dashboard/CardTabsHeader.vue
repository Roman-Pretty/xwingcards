/**
 * CardTabsHeader Component
 * 
 * Navigation tabs for Hand, Deck, and Store with search and filter
 */
<template>
  <div class="flex justify-between items-center flex-row">
    <!-- Tab Navigation -->
    <div class="join">
      <button 
        class="btn join-item"
        :class="{ 'btn-active': activeTab === 'hand', 'btn-neutral': activeTab !== 'hand' }"
        @click="$emit('switch-tab', 'hand')"
      >
        Hand
      </button>
      <button 
        class="btn join-item"
        :class="{ 'btn-active': activeTab === 'deck', 'btn-neutral': activeTab !== 'deck' }"
        @click="$emit('switch-tab', 'deck')"
      >
        Deck
      </button>
      <button 
        class="btn join-item"
        :class="{ 'btn-active': activeTab === 'store', 'btn-neutral': activeTab !== 'store' }"
        @click="$emit('switch-tab', 'store')"
      >
        Store
      </button>
    </div>

    <!-- Search and Filter Controls -->
    <div class="flex items-center gap-4">
      <!-- Search Input -->
      <div class="form-control">
        <input 
          type="text" 
          :value="searchQuery" 
          @input="$emit('update:search-query', $event.target.value)"
          placeholder="Search cards..." 
          :class="[
            'input input-bordered text-white bg-neutral-800 border-neutral-600 focus:border-neutral-400',
            isMobile ? 'input-xs w-32' : 'input-sm w-48'
          ]"
        />
      </div>

      <!-- Type Filter Dropdown -->
      <div class="dropdown dropdown-end">
        <div 
          tabindex="0" 
          role="button"
          class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center capitalize"
        >
          {{ selectedType === 'all' ? 'All' : selectedType }}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-chevron-down">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div 
          tabindex="0"
          :class="[
            'dropdown-content z-10 overflow-auto p-4 rounded-box shadow-md text-white bg-neutral-800 flex flex-wrap gap-2',
            isMobile ? 'h-[40vh] text-xs p-2 gap-1' : 'h-[50vh] text-sm'
          ]"
        >
          <button 
            @click="$emit('select-type', 'all')"
            :class="[
              'btn btn-ghost w-full flex flex-row justify-start items-center gap-2',
              selectedType === 'all' ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white',
              isMobile ? 'btn-xs gap-1' : ''
            ]"
          >
            <span class="font-[xwing] font-light -mt-1.5" :class="isMobile ? 'text-sm' : 'text-lg'">)</span>
            <span>All</span>
          </button>
          
          <button 
            v-for="type in typeOptions" 
            :key="type.name" 
            @click="$emit('select-type', type.name.toLowerCase())"
            :class="[
              'btn btn-ghost w-full flex flex-row justify-start items-center gap-2',
              selectedType === type.name.toLowerCase() ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white',
              isMobile ? 'btn-xs gap-1' : ''
            ]"
          >
            <span 
              class="font-[xwing] font-light -mt-1" 
              :class="isMobile ? 'text-sm' : 'text-lg'"
            >
              {{ type.symbol || tokenToLetterMap[type.name.toLowerCase()] || '?' }}
            </span>
            <span>{{ type.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tokenToLetterMap } from '../../utils/mappings'

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
  /** Whether in mobile mode */
  isMobile: {
    type: Boolean,
    default: false
  }
})

/**
 * Component events
 */
defineEmits(['switch-tab', 'update:search-query', 'select-type'])
</script>
