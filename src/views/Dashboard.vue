<template>
  <main class="bg-neutral-900 w-full h-screen inria-sans-regular overflow-hidden"
    :class="{ 
      'p-4 flex flex-row gap-4': !isMobile, 
      'flex flex-col': isMobile
    }">
    
    <!-- Desktop layout -->
    <div v-if="!isMobile"
      class="flex-1 border-2 border-neutral-700 rounded-2xl  flex flex-col justify-between text-white overflow-hidden">
      <div class="flex flex-col justify-between h-full ">
        <div class="flex-1 p-4">
          <div class="flex flex-row justify-between w-full items-center">
            <div class="flex flex-row gap-4">
              <div class="text-xl flex flex-row gap-2 items-center cursor-default">
                <span class="font-[xwing] text-3xl -mt-2" :style="{ color: color }">{{ icon }}</span>
                <span class="font-bold" :style="{ color: color }">The {{ store.currentPilot?.class }}</span>
              </div>

              <div class="text-xl flex flex-row items-center cursor-default text-yellow-300">
                <span class="font-[xwing] text-3xl -mt-2">Ì</span>
                <span class="font-bold">{{ store.currentPilot?.xp }}</span>
              </div>

              <div v-if="store.currentPilot?.class === 'Force User' && forceCount < 1"
                class="text-xl flex flex-row items-center cursor-default text-force gap-1">
                <span class="font-[xwing] text-xl -mt-1">h</span>
                <span class="font-bold">1</span>
              </div>

              <div v-if="forceCount > 0" class="text-xl flex flex-row items-center cursor-default text-force gap-1">
                <span class="font-[xwing] text-xl -mt-1">h`</span>
                <span class="font-bold">{{ forceCount }}</span>
              </div>
            </div>
            <div class="flex flex-row-reverse gap-2 items-center">
              <button class="btn" @click="openModal">Add XP</button>
              <PilotTabs @add-pilot="$router.push('/create-pilot')" />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full p-4 overflow-x-auto">
          <div>
            <div class="w-full flex flex-row items-center justify-start gap-4 mb-4">
              <h2 class="text-lg mr-auto">Loadout</h2>
              <div v-for="(count, symbol) in unlockedFactionCounts" :key="symbol" :style="{ color: getFactionColor(symbol) }"
                class="text-xl flex flex-row items-center gap-1 cursor-default ">
                <span class="font-[xwing] font-light text-2xl -mt-1.5">{{ symbol }}</span>
                <span class="font-bold">{{ getFactionSlots(symbol) }} / {{ count }}</span>
              </div>
            </div>
            <Slots class="w-full" :currently-dragged-card="currentlyDraggedCard" />
          </div>
          <div>
            <h2 class="text-lg mb-4">Ships</h2>
            <Ships />
          </div>
          <div>
            <h2 class="text-lg mb-4">Rank</h2>
            <RankList />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile layout - Loadout tab content -->
    <div v-if="isMobile && mobileActiveTab === 'loadout'" class="flex-1 p-4 text-white overflow-y-auto pb-20">
      <div class="flex flex-row justify-between w-full items-center mb-4">
        <div class="flex flex-row gap-4">
          <div class="text-lg flex flex-row gap-2 items-center cursor-default">
            <span class="font-[xwing] text-2xl -mt-2" :style="{ color: color }">{{ icon }}</span>
            <span class="font-bold" :style="{ color: color }">The {{ store.currentPilot?.class }}</span>
          </div>

          <div class="text-lg flex flex-row items-center cursor-default text-yellow-300">
            <span class="font-[xwing] text-2xl -mt-2">Ì</span>
            <span class="font-bold">{{ store.currentPilot?.xp }}</span>
          </div>
        </div>
        <div class="flex flex-row-reverse gap-2 items-center">
          <button class="btn btn-sm" @click="openModal">Add XP</button>
          <PilotTabs @add-pilot="$router.push('/create-pilot')" />
        </div>
      </div>

      <div>
        <div class="w-full flex flex-row items-center justify-between mb-4">
          <h2 class="text-lg ">Loadout</h2>
          <div v-for="(count, symbol) in unlockedFactionCounts" :key="symbol" :style="{ color: getFactionColor(symbol) }"
            class="text-lg flex flex-row items-center gap-1 cursor-default ">
            <span class="font-[xwing] font-light text-xl -mt-1.5">{{ symbol }}</span>
            <span class="font-bold">{{ getFactionSlots(symbol) }} / {{ count }}</span>
          </div>
        </div>
        <Slots class="w-full" :currently-dragged-card="currentlyDraggedCard" :mobile-mode="true" />
      </div>
      <div class="mt-6">
        <h2 class="text-lg mb-4">Ships</h2>
        <Ships />
      </div>
      <div class="mt-6">
        <h2 class="text-lg mb-4">Rank</h2>
        <RankList />
      </div>
    </div>

    <!-- Mobile layout - Cards tab content -->
    <div v-if="isMobile && mobileActiveTab === 'cards'" class="flex-1 flex flex-col overflow-visible min-h-0 pb-20">
      <div class="p-4 border-b-2 border-neutral-700 flex justify-between items-center flex-row">
        <div class="join">
          <button class="btn join-item btn-sm"
            :class="{ 'btn-active': activeTab === 'hand', 'btn-neutral': activeTab !== 'hand' }"
            @click="switchTab('hand')">Hand</button>
          <button class="btn join-item btn-sm"
            :class="{ 'btn-active': activeTab === 'deck', 'btn-neutral': activeTab !== 'deck' }"
            @click="switchTab('deck')">Deck</button>
          <button class="btn join-item btn-sm"
            :class="{ 'btn-active': activeTab === 'store', 'btn-neutral': activeTab !== 'store' }"
            @click="switchTab('store')">Store</button>
        </div>

        <div class="flex items-center gap-2">
          <!-- Search input -->
          <div class="form-control">
            <input type="text" v-model="searchQuery" placeholder="Search..." 
              class="input input-bordered input-xs w-32 text-white bg-neutral-800 border-neutral-600 focus:border-neutral-400" />
          </div>

          <!-- Type filter dropdown -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button"
              class="text-white gap-1 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center capitalize text-sm">
              {{ selectedType === 'all' ? 'All' : selectedType }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-chevron-down">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <div tabindex="0"
              class="dropdown-content z-10 h-[40vh] overflow-auto p-2 rounded-box shadow-md text-xs text-white bg-neutral-800 flex flex-wrap gap-1">
              <button @click="selectType('all')"
                :class="['btn btn-ghost btn-xs w-full flex flex-row justify-start items-center gap-1', selectedType === 'all' ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white']">
                <span class="font-[xwing] text-sm font-light -mt-1">)</span>
                <span>All</span>
              </button>
              <button v-for="type in typeOptions" :key="type.name" @click="selectType(type.name.toLowerCase())"
                :class="['btn btn-ghost btn-xs w-full flex flex-row justify-start items-center gap-1', selectedType === type.name.toLowerCase() ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white']">
                <span class="font-[xwing] text-sm font-light -mt-1">{{ type.symbol ||
                  tokenToLetterMap[type.name.toLowerCase()] || '?' }}</span>
                <span>{{ type.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0" :class="{
        'flex flex-row flex-wrap gap-4 justify-evenly': activeTab !== 'hand',
        'flex flex-col': activeTab === 'hand'
      }">
        <!-- Pilot Overview, Group Overview and Settings buttons -->
        <div class="btn btn-square btn-sm absolute bottom-20 right-28 z-50 shadow shadow-black"
          @click="$router.push('/pilot-overview')">
          <span class="font-[xwing] text-2xl font-light pb-1.5">x</span>
        </div>
        <div class="btn btn-square btn-sm absolute bottom-20 right-16 z-50 shadow shadow-black"
          @click="$router.push('/group-overview')">
          <span class="font-[xwing] text-2xl font-light pb-1.5">!</span>
        </div>
        <div class="btn btn-square btn-sm absolute bottom-20 right-4 z-50 shadow shadow-black"
          @click="$router.push('/settings')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-settings-icon lucide-settings">
            <path
              d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        
        <!-- Hand tab uses CardSummary for compact display -->
        <template v-if="activeTab === 'hand'">
          <div class="w-full space-y-3">
            <CardSummary v-for="(card, index) in cardsToShow" :key="card?.id || card?.name || index" v-bind="card"
              :showXP="false" :upgradeLevel="store.getCardUpgradeLevel(card.id)" @click="select(card)" class="w-full" />
          </div>
        </template>

        <!-- Deck and Store tabs use regular Card component -->
        <template v-else>
          <Card v-for="(card, index) in cardsToShow" :key="card?.id || card?.name || index" v-bind="card"
            :showXP="activeTab === 'store'" :owned="activeTab === 'store' && store.isCardOwnedByCurrentPilot(card.id)"
            :canUpgrade="activeTab === 'store' && store.canUpgradeCard(card.id)"
            :upgradeLevel="store.getCardUpgradeLevel(card.id)"
            :draggable="!isMobile && activeTab === 'deck' && !store.isCardTaken(card.id)" 
            :mobile-mode="isMobile"
            @dragstart="!isMobile && onDragStart(card.id, $event)"
            @dragend="!isMobile && onDragEnd" @click="select(card)" :class="{
              'pointer-events-none opacity-50': store.isCardOwnedByCurrentPilot(card.id) && activeTab === 'store' && !store.canUpgradeCard(card.id),
              'opacity-50 cursor-not-allowed': activeTab === 'deck' && store.isCardTaken(card.id),
              'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out': !isMobile && activeTab === 'deck' && !store.isCardTaken(card.id),
              'cursor-pointer': isMobile && activeTab === 'deck' && !store.isCardTaken(card.id),
              'cursor-default': activeTab !== 'deck',
              'border-2 border-blue-400 shadow-lg': activeTab === 'store' && store.canUpgradeCard(card.id),
            }" @contextmenu.prevent="!isMobile && onRightClickCard(card, $event)" />
        </template>

        <div v-if="cardsToShow.length === 0 && activeTab === 'hand'"
          class="text-white h-full text-center text-sm opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No equipped cards match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            You have no equipped cards. You can equip cards from your deck or purchase new ones from the store.<br /><br />
            <span v-if="!isMobile">Drag cards from your deck to their respective slots on the left side of the screen to equip them.</span>
            <span v-else>Tap cards in your deck to equip them.</span>
          </div>
        </div>
        <div v-if="cardsToShow.length === 0 && activeTab === 'deck'"
          class="text-white text-center text-sm opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No cards in your deck match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            Purchase cards from the store to add them to your deck.
          </div>
        </div>
        <div v-if="cardsToShow.length === 0 && activeTab === 'store'"
          class="text-white text-center text-sm opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No cards in the store match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            No cards available in the store.
          </div>
        </div>
      </section>
    </div>

    <!-- Desktop cards section -->
    <div v-if="!isMobile" class="flex-1 flex flex-col overflow-visible min-h-0">
      <div class="p-4 border-2 border-neutral-700 rounded-2xl flex justify-between items-center flex-row">
        <div class="join">
          <button class="btn join-item"
            :class="{ 'btn-active': activeTab === 'hand', 'btn-neutral': activeTab !== 'hand' }"
            @click="switchTab('hand')">Hand</button>
          <button class="btn join-item"
            :class="{ 'btn-active': activeTab === 'deck', 'btn-neutral': activeTab !== 'deck' }"
            @click="switchTab('deck')">Deck</button>
          <button class="btn join-item"
            :class="{ 'btn-active': activeTab === 'store', 'btn-neutral': activeTab !== 'store' }"
            @click="switchTab('store')">Store</button>
        </div>

        <div class="flex items-center gap-4">
          <!-- Search input -->
          <div class="form-control">
            <input type="text" v-model="searchQuery" placeholder="Search cards..." 
              class="input input-bordered input-sm w-48 text-white bg-neutral-800 border-neutral-600 focus:border-neutral-400" />
          </div>

          <!-- Type filter dropdown -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button"
              class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center capitalize">
              {{ selectedType }}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-chevron-down">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <div tabindex="0"
              class="dropdown-content z-10 h-[50vh] overflow-auto p-4 rounded-box shadow-md text-sm text-white bg-neutral-800 flex flex-wrap gap-2">
              <button @click="selectType('all')"
                :class="['btn btn-ghost w-full flex flex-row justify-start items-center gap-2', selectedType === 'all' ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white']">
                <span class="font-[xwing] text-lg font-light -mt-1.5">)</span>
                <span>All</span>
              </button>
              <button v-for="type in typeOptions" :key="type.name" @click="selectType(type.name.toLowerCase())"
                :class="['btn btn-ghost w-full flex flex-row justify-start items-center gap-2', selectedType === type.name.toLowerCase() ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white']">
                <span class="font-[xwing] text-lg font-light -mt-1.5">{{ type.symbol ||
                  tokenToLetterMap[type.name.toLowerCase()] || '?' }}</span>
                <span>{{ type.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-16 pt-8 min-h-0" :class="{
        'flex flex-row flex-wrap gap-6 justify-evenly': activeTab !== 'hand',
        'flex flex-col': activeTab === 'hand'
      }">
        <div class="btn btn-square absolute bottom-4 right-28 z-50 shadow shadow-black"
          @click="$router.push('/pilot-overview')">
          <span class="font-[xwing] text-2xl font-light pb-1.5">x</span>
        </div>
        <div class="btn btn-square absolute bottom-4 right-16 z-50 shadow shadow-black"
          @click="$router.push('/group-overview')">
          <span class="font-[xwing] text-2xl font-light pb-1.5">!</span>
        </div>
        <div class="btn btn-square absolute bottom-4 right-4 z-50 shadow shadow-black"
          @click="$router.push('/settings')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-settings-icon lucide-settings">
            <path
              d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <!-- Hand tab uses CardSummary for compact display -->
        <template v-if="activeTab === 'hand'">
          <div class="w-full space-y-3">
            <CardSummary v-for="(card, index) in cardsToShow" :key="card?.id || card?.name || index" v-bind="card"
              :showXP="false" :upgradeLevel="store.getCardUpgradeLevel(card.id)" @click="select(card)" class="w-full" />
          </div>
        </template>

        <!-- Deck and Store tabs use regular Card component -->
        <template v-else>
          <Card v-for="(card, index) in cardsToShow" :key="card?.id || card?.name || index" v-bind="card"
            :showXP="activeTab === 'store'" :owned="activeTab === 'store' && store.isCardOwnedByCurrentPilot(card.id)"
            :canUpgrade="activeTab === 'store' && store.canUpgradeCard(card.id)"
            :upgradeLevel="store.getCardUpgradeLevel(card.id)"
            :draggable="activeTab === 'deck' && !store.isCardTaken(card.id)" @dragstart="onDragStart(card.id, $event)"
            @dragend="onDragEnd" @click="select(card)" :class="{
              'pointer-events-none opacity-50': store.isCardOwnedByCurrentPilot(card.id) && activeTab === 'store' && !store.canUpgradeCard(card.id),
              'opacity-50 cursor-not-allowed': activeTab === 'deck' && store.isCardTaken(card.id),
              'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out': activeTab === 'deck' && !store.isCardTaken(card.id),
              'cursor-default': activeTab !== 'deck',
              'border-2 border-blue-400 shadow-lg': activeTab === 'store' && store.canUpgradeCard(card.id),
            }" @contextmenu.prevent="onRightClickCard(card, $event)" />
        </template>

        <div v-if="cardsToShow.length === 0 && activeTab === 'hand'"
          class="text-white h-full text-center text-lg opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No equipped cards match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            You have no equipped cards. You can equip cards from your deck or purchase new ones from the
            store.<br /><br />
            Drag cards from your deck to their respective slots on the left side of the screen to equip them.
          </div>
        </div>
        <div v-if="cardsToShow.length === 0 && activeTab === 'deck'"
          class="text-white text-center text-lg opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No cards in your deck match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            Purchase cards from the store to add them to your deck.
          </div>
        </div>
        <div v-if="cardsToShow.length === 0 && activeTab === 'store'"
          class="text-white text-center text-lg opacity-70 font-medium flex items-center justify-center w-full">
          <div v-if="searchQuery || selectedType !== 'all'">
            No cards in the store match your current filters.<br />
            <button @click="clearFilters" class="btn btn-sm btn-outline mt-2">Clear Filters</button>
          </div>
          <div v-else>
            No cards available in the store.
          </div>
        </div>
      </section>

      <div v-if="showContextMenu && contextCard" :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
        class="absolute z-50 bg-neutral-800 text-white border border-neutral-600 rounded shadow-lg p-2"
        @click.outside="showContextMenu = false">
        <div class="font-semibold cursor-default mb-2 pr-10">Give card to:</div>
        <div v-for="pilot in otherPilots" :key="pilot.id">
          <button class="p-1 px-2 rounded cursor-pointer text-left w-full flex flex-start hover:bg-neutral-700"
            @click="giveCardToPilot(pilot.id)">
            {{ pilot.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile bottom tabs -->
    <div v-if="isMobile" class="fixed bottom-0 left-0 right-0  z-40">
      <div role="tablist" class="tabs tabs-box w-full justify-center">
        <a 
          role="tab"
          @click="mobileActiveTab = 'loadout'"
          :class="[
            'tab flex-1',
            mobileActiveTab === 'loadout' ? 'tab-active' : ''
          ]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield mr-2">
            <path d="M20 13c0 5-3.5 7.5-8 10-4.5-2.5-8-5-8-10V6l8-3 8 3v7Z"/>
          </svg>
          Loadout
        </a>
        <a 
          role="tab"
          @click="mobileActiveTab = 'cards'"
          :class="[
            'tab flex-1',
            mobileActiveTab === 'cards' ? 'tab-active' : ''
          ]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers mr-2">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
          </svg>
          Cards
        </a>
      </div>
    </div>

    <!-- Modal Components -->
    <CardPurchaseModal ref="cardPurchaseModal" :card="pendingCard" :is-upgrade="isPendingCardUpgrade"
      :upgrade-level="pendingCardUpgradeLevel" @confirm="confirmCardPurchase" @cancel="cancelCardPurchase" />

    <AddXpModal ref="addXpModal" :pilot-name="store.currentPilot?.name || 'Unknown Pilot'" @confirm="confirmAddXP"
      @cancel="closeAddXpModal" />

    <CardSwapModal ref="cardSwapModal" :card-name="pendingTransfer?.cardName"
      :target-pilot-name="pendingTransfer?.targetPilotName" :your-upgrade-level="pendingTransfer?.yourUpgradeLevel"
      :target-upgrade-level="pendingTransfer?.targetUpgradeLevel" @confirm="confirmCardSwap" @cancel="cancelCardSwap" />

    <CardEquipModal ref="cardEquipModal" :card="pendingMobileCard" :available-slots="availableSlots" 
      @equip="equipCardToSlot" @cancel="cancelMobileCardSelection" />

    <FactionSelectionModal ref="factionSelectionModal" :card-name="pendingFactionCard?.name" 
      :card-id="pendingFactionCard?.cardId"
      :factions="pendingFactionCard?.factions" @confirm="confirmFactionSelection" @cancel="cancelFactionSelection" />
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import Card from "../components/Card.vue";
import CardSummary from "../components/CardSummary.vue";
import PilotTabs from "../components/PilotTabs.vue";
import RankList from "../components/RankList.vue";
import Ships from "../components/Ships.vue";
import Slots from "../components/Slots.vue";
import CardPurchaseModal from "../components/ui/CardPurchaseModal.vue";
import AddXpModal from "../components/ui/AddXpModal.vue";
import CardSwapModal from "../components/ui/CardSwapModal.vue";
import CardEquipModal from "../components/ui/CardEquipModal.vue";
import FactionSelectionModal from "../components/ui/FactionSelectionModal.vue";

import classData from "../data/classes.json";

import { useCardFilter } from "../composables/useCardFilter";
import { usePilotStore } from "../stores/PilotStore";

import { tokenToLetterMap } from "../utils/mappings";

// Router and Store
const router = useRouter();
const store = usePilotStore();

// Component refs
const cardPurchaseModal = ref(null);
const addXpModal = ref(null);
const cardSwapModal = ref(null);
const cardEquipModal = ref(null);
const factionSelectionModal = ref(null);

// UI state
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextCard = ref(null);
const selectedType = ref("all");
const activeTab = ref("hand");
const pendingCard = ref(null);
const currentlyDraggedCard = ref(null);
const pendingTransfer = ref(null); // For card swap modal
const pendingFactionCard = ref(null); // For faction selection modal
const searchQuery = ref("");

// Mobile state
const isMobile = ref(false);
const mobileActiveTab = ref('loadout');
const pendingMobileCard = ref(null);

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Computed
const otherPilots = computed(() =>
  store.pilots.filter(p => p.id !== store.currentPilotId)
);

const equippedCardIds = computed(() => {
  return new Set(Object.values(store.currentPilot?.slotCards || {}));
});

const icon = computed(() => {
  return classData[store.currentPilot?.class]?.icon || "";
});

const color = computed(() => {
  return classData[store.currentPilot?.class]?.color || "amber";
});

// Available slots for mobile card equipping
const availableSlots = computed(() => {
  const pilot = store.currentPilot;
  if (!pilot || !pendingMobileCard.value) return [];
  
  console.log('Pending mobile card:', pendingMobileCard.value);
  
  const cardType = pendingMobileCard.value.type?.toLowerCase();
  console.log('Card type:', cardType);
  
  const slots = [];
  
  // Get class data for the pilot
  const classInfo = classData[pilot.class];
  if (!classInfo) {
    console.log('No class info found for:', pilot.class);
    return [];
  }
  
  // Get current ship data
  const shipEntry = classInfo.ships.find(s => s.ship === pilot.selectedShip);
  const shipSlots = shipEntry?.slots || [];
  const lockedSlots = shipEntry?.lockedSlots || [];
  
  console.log('Ship slots:', shipSlots);
  console.log('Selected ship:', pilot.selectedShip);
  
  // Get rank data
  const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
  const rankSlots = rankData?.slots || [];
  const optionalSlots = rankData?.optionalslots || [];
  
  console.log('Rank slots:', rankSlots);
  console.log('Optional slots:', optionalSlots);
  
  // Combine all fixed slots (ship + rank)
  const allFixedSlots = [...shipSlots, ...rankSlots];
  
  console.log('All fixed slots:', allFixedSlots);
  
  // Create a mapping of card types to slot letters
  const cardTypeToSlotMap = {
    'ace': 'x',
    'talent': 'E', 
    'astromech': 'A',
    'modification': 'm',
    'missile': 'M',
    'title': 't',
    'torpedo': 'P',
    'cannon': 'C',
    'crew': 'W',
    'force': 'F',
    'illicit': 'I',
    'tech': 'X',
    'sensitive': 'Î',
    'tactical': 'Z',
    'turret': 'U',
    'payload': 'B',
    'sensor': 'S',
    'configuration': 'n'
  };
  
  // Create a mapping of slot letters to readable names
  const slotLetterToNameMap = {
    'x': 'Ace',
    'E': 'Talent', 
    'A': 'Astromech',
    'm': 'Modification',
    'M': 'Missile',
    't': 'Title',
    'P': 'Torpedo',
    'C': 'Cannon',
    'Y': 'Gunner',
    'W': 'Crew',
    'F': 'Force',
    'I': 'Illicit',
    'X': 'Tech',
    'Î': 'Sensitive',
    'Z': 'Tactical',
    'U': 'Turret',
    'B': 'Payload',
    'S': 'Sensor',
    'n': 'Configuration'
  };
  
  const expectedSlotLetter = cardTypeToSlotMap[cardType];
  console.log('Expected slot letter for', cardType, ':', expectedSlotLetter);
  
  // Check fixed slots
  allFixedSlots.forEach((slot, index) => {
    const slotKey = `fixed-${index}`;
    console.log('Checking slot:', slot, 'against expected:', expectedSlotLetter);
    
    // Check if this slot type can accept the card type
    if (slot === expectedSlotLetter) {
      const currentCard = pilot.slotCards?.[slotKey];
      const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null;
      
      console.log('Found matching slot:', slotKey, 'occupied by:', currentCardInfo?.name);
      
      slots.push({
        key: slotKey,
        name: slotLetterToNameMap[slot] || slot,
        icon: slot,
        occupied: !!currentCard,
        occupiedCard: currentCardInfo?.name
      });
    }
  });
  
  // Check optional slots
  if (Array.isArray(optionalSlots)) {
    optionalSlots.forEach((slotGroup, groupIndex) => {
      if (Array.isArray(slotGroup)) {
        slotGroup.forEach((slot, slotIndex) => {
          const slotKey = `optional-${groupIndex}`;
          
          if (slot === expectedSlotLetter) {
            const currentCard = pilot.slotCards?.[slotKey];
            const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null;
            
            console.log('Found matching optional slot:', slotKey);
            
            slots.push({
              key: slotKey,
              name: slotLetterToNameMap[slot] || slot,
              icon: slot,
              occupied: !!currentCard,
              occupiedCard: currentCardInfo?.name
            });
          }
        });
      } else {
        // Single optional slot
        const slotKey = `optional-${groupIndex}`;
        
        if (slotGroup === expectedSlotLetter) {
          const currentCard = pilot.slotCards?.[slotKey];
          const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null;
          
          console.log('Found matching single optional slot:', slotKey);
          
          slots.push({
            key: slotKey,
            name: slotLetterToNameMap[slotGroup] || slotGroup,
            icon: slotGroup,
            occupied: !!currentCard,
            occupiedCard: currentCardInfo?.name
          });
        }
      }
    });
  }
  
  console.log('Available slots found:', slots);
  return slots;
});

// Function to get faction color based on symbol
function getFactionColor(symbol) {
  const factionColors = {
    "@": "#609bca", // empire
    "h": "#f9a8d4", // force
    "!": "#ff9900", // resistance
    "+": "#870000", // firstorder
    "#": "#2ec22b", // scum
    "/": "#ff6048", // republic  
    ".": "#72b8f0"  // separatists 
  };
  return factionColors[symbol] || "#6b7280";
}

const unlockedFactionCounts = computed(() => {
  const pilot = store.currentPilot;
  if (!pilot) return {};
  const classInfo = classData[pilot.class];
  if (!classInfo) return {};

  const ranks = classInfo.ranks.filter(r => r.rank <= pilot.rank);
  const counts = {};
  for (const r of ranks) {
    if (!r.faction) continue;
    for (const sym of r.faction) {
      counts[sym] = (counts[sym] || 0) + 1;
    }
  }
  return counts;
});

const forceCount = computed(() => {
  const pilot = store.currentPilot;
  if (!pilot || !pilot.slotCards) return 0;

  return Object.values(pilot.slotCards)
    .map(cardId => store.ownedCards.find(c => c.id === cardId))
    .filter(card => card?.type?.toLowerCase() === 'force' || card?.type?.toLowerCase() === 'sensitive')
    .length;
});

const isPendingCardUpgrade = computed(() => {
  if (!pendingCard.value) return false;
  return store.isCardOwnedByCurrentPilot(pendingCard.value.id) && store.canUpgradeCard(pendingCard.value.id);
});

const pendingCardUpgradeLevel = computed(() => {
  if (!pendingCard.value) return 0;
  return store.getCardUpgradeLevel(pendingCard.value.id);
});

const { byAllowedFactions } = useCardFilter();

// Card filtering
const cardsToShow = computed(() => {
  let baseCards = [];

  if (activeTab.value === "hand") {
    const slotCardIds = Object.values(store.currentPilot?.slotCards || {});
    baseCards = slotCardIds
      .map(id => {
        const cardInfo = store.getCardDisplayInfo(id);
        return cardInfo;
      })
      .filter(Boolean);
  } else if (activeTab.value === "deck") {
    baseCards = store.ownedCards.map(card => {
      const cardInfo = store.getCardDisplayInfo(card.id);
      return cardInfo || card;
    });
  } else if (activeTab.value === "store") {
    // Store tab - show regular cards (not upgraded display)
    const className = store.currentPilot?.class;
    const classInfo = classData[className];
    const allowedFactions = classInfo?.factions?.map(f => f.toLowerCase()) || [];
    baseCards = byAllowedFactions(allowedFactions);
  }

  // Apply type filter
  if (selectedType.value !== 'all') {
    baseCards = baseCards.filter(card => card.type?.toLowerCase() === selectedType.value);
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    baseCards = baseCards.filter(card => {
      // Handle both string and array factions
      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
      const factionMatch = cardFactions.some(faction => 
        faction?.toLowerCase().includes(query) ||
        // Treat "rebel" as equivalent to "neutral"
        (query === 'rebel' && faction?.toLowerCase() === 'neutral')
      );
      
      return (
        card.name?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query) ||
        card.type?.toLowerCase().includes(query) ||
        factionMatch
      );
    });
  }

  return baseCards;
});

// Card types
const typeOptions = [
  { name: "Ace" },
  { name: "Astromech" },
  { name: "Cannon" },
  { name: "Configuration" },
  { name: "Crew" },
  { name: "Force" },
  { name: "Gunner" },
  { name: "Illicit" },
  { name: "Missile" },
  { name: "Modification" },
  { name: "Payload" },
  { name: "Sensor" },
  { name: "Sensitive" },
    { name: "Tactical" },
  { name: "Talent" },
  { name: "Tech" },
  { name: "Title" },
  { name: "Torpedo" },
  { name: "Turret" }
].sort((a, b) => a.name.localeCompare(b.name));

// Methods
function switchTab(tab) {
  activeTab.value = tab;
  // Reset filters when switching tabs
  searchQuery.value = "";
  selectedType.value = "all";
}

function selectType(type) {
  selectedType.value = type;
  // Optional: clear search when changing type filter for better UX
  // searchQuery.value = "";
}

function clearFilters() {
  searchQuery.value = "";
  selectedType.value = "all";
}

function onRightClickCard(card, event) {
  if (activeTab.value !== "deck") return;
  if (equippedCardIds.value.has(card.id)) return;

  contextCard.value = card;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenu.value = true;
}

function giveCardToPilot(targetPilotId) {
  const currentPilot = store.currentPilot;
  const targetPilot = store.pilots.find(p => p.id === targetPilotId);
  const cardId = contextCard.value?.id;
  if (!cardId || !currentPilot || !targetPilot) return;

  // Check if target pilot already owns this card
  if (targetPilot.ownedCards.includes(cardId)) {
    const currentUpgradeLevel = currentPilot.cardUpgrades?.[cardId] || 0;
    const targetUpgradeLevel = targetPilot.cardUpgrades?.[cardId] || 0;

    if (currentUpgradeLevel === targetUpgradeLevel) {
      alert(`${targetPilot.name} already owns this card at the same upgrade level.`);
      showContextMenu.value = false;
      contextCard.value = null;
      return;
    }

    // Different upgrade levels - offer swap
    pendingTransfer.value = {
      cardId,
      targetPilotId,
      currentPilot,
      targetPilot,
      cardName: contextCard.value.name,
      targetPilotName: targetPilot.name,
      yourUpgradeLevel: currentUpgradeLevel,
      targetUpgradeLevel: targetUpgradeLevel
    };

    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      cardSwapModal.value?.open();
    }, 0);

    showContextMenu.value = false;
    contextCard.value = null;
    return;
  }

  // Normal transfer - remove from current pilot and add to target pilot
  const index = currentPilot.ownedCards.indexOf(cardId);
  if (index !== -1) {
    currentPilot.ownedCards.splice(index, 1);

    // Transfer upgrade level
    const upgradeLevel = currentPilot.cardUpgrades?.[cardId] || 0;
    if (upgradeLevel > 0) {
      if (!currentPilot.cardUpgrades) currentPilot.cardUpgrades = {};
      delete currentPilot.cardUpgrades[cardId];

      if (!targetPilot.cardUpgrades) targetPilot.cardUpgrades = {};
      targetPilot.cardUpgrades[cardId] = upgradeLevel;
    }
  }

  if (!targetPilot.ownedCards.includes(cardId)) {
    targetPilot.ownedCards.push(cardId);
  }

  showContextMenu.value = false;
  contextCard.value = null;
}

document.addEventListener("click", () => {
  showContextMenu.value = false;
});

function getFactionSlots(symbol) {
  return store.getMappedFactionSlots(symbol);
}

function onDragStart(cardId, event) {
  if (activeTab.value !== "deck") {
    event.preventDefault();
    return;
  }

  // Store the currently dragged card
  const draggedCard = store.ownedCards.find(c => c.id === cardId);
  currentlyDraggedCard.value = draggedCard;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", cardId);
  
  // Use the entire card element as the drag image instead of just the image
  const cardElement = event.target.closest('.card') || event.currentTarget;
  if (cardElement) {
    event.dataTransfer.setDragImage(cardElement, cardElement.offsetWidth / 2, cardElement.offsetHeight / 2);
  }
}

function onDragEnd(event) {
  // Clear the currently dragged card after a brief delay to allow drop events to process
  setTimeout(() => {
    currentlyDraggedCard.value = null;
  }, 100);
}

// XP Modal
function openModal() {
  addXpModal.value?.open();
}

function confirmAddXP(amount) {
  if (amount > 0) {
    store.currentPilot.xp += amount;
  }
}

function closeAddXpModal() {
  // Modal component handles closing itself
}

// Card selection
function select(card) {
  if (activeTab.value === "store") {
    const isOwned = store.isCardOwnedByCurrentPilot(card.id);
    const canUpgrade = store.canUpgradeCard(card.id);

    if (isOwned && !canUpgrade) {
      alert("You already own this card and cannot upgrade it further.");
      return;
    }

    pendingCard.value = card;
    cardPurchaseModal.value?.open();
  } else if (activeTab.value === "hand") {
    // For hand tab, unequip the card
    unequipCard(card.id);
  } else if (activeTab.value === "deck") {
    // For deck tab on mobile, show card selector modal
    if (isMobile.value && !store.isCardTaken(card.id)) {
      // Check initiative requirement before showing the selection modal
      if (!store.canEquipInitiativeCard(card.id)) {
        const warning = store.getInitiativeRequirementText(card.id);
        alert(`Cannot equip this card: ${warning}`);
        return;
      }
      
      // Check faction requirement before showing the selection modal  
      if (!store.canEquipFactionCard(card.id)) {
        const warning = store.getFactionRequirementText(card.id);
        alert(`Cannot equip this card: ${warning}`);
        return;
      }
      
      showMobileCardSelection(card);
    }
    // On desktop, cards are equipped via drag-and-drop to slots
  }
}

// Mobile card equipping
function showMobileCardSelection(card) {
  pendingMobileCard.value = card;
  cardEquipModal.value?.open();
}

function cancelMobileCardSelection() {
  pendingMobileCard.value = null;
}

function equipCardToSlot(slotKey) {
  if (!pendingMobileCard.value) return;
  
  // Check initiative requirement before equipping
  if (!store.canEquipInitiativeCard(pendingMobileCard.value.id)) {
    const warning = store.getInitiativeRequirementText(pendingMobileCard.value.id);
    alert(`Cannot equip this card: ${warning}`);
    pendingMobileCard.value = null;
    return;
  }
  
  // Check if card requires faction selection
  if (store.requiresFactionSelection(pendingMobileCard.value.id)) {
    const availableFactions = store.getAvailableFactionsForCard(pendingMobileCard.value.id);
    if (availableFactions.length === 0) {
      alert("Cannot equip this card: No available faction slots.");
      pendingMobileCard.value = null;
      return;
    } else if (availableFactions.length === 1) {
      // Only one faction available, equip directly
      equipCardWithSpecificFaction(slotKey, availableFactions[0]);
      return;
    } else {
      // Multiple factions available, show selection modal
      pendingFactionCard.value = {
        name: pendingMobileCard.value.name,
        cardId: pendingMobileCard.value.id,
        factions: availableFactions,
        slotKey: slotKey
      };
      factionSelectionModal.value?.open();
      return;
    }
  }
  
  // Check faction requirement before equipping (for legacy single-faction cards)
  if (!store.canEquipFactionCard(pendingMobileCard.value.id)) {
    const warning = store.getFactionRequirementText(pendingMobileCard.value.id);
    alert(`Cannot equip this card: ${warning}`);
    pendingMobileCard.value = null;
    return;
  }
  
  const success = store.assignCardToSlot(slotKey, pendingMobileCard.value.id);
  if (success !== false) {
    pendingMobileCard.value = null;
    // Switch to loadout tab to show the equipped card
    mobileActiveTab.value = 'loadout';
  } else {
    alert("Could not equip this card to the selected slot.");
  }
}

function equipCardWithSpecificFaction(slotKey, faction) {
  if (!pendingMobileCard.value) return;
  
  const success = store.assignCardToSlot(slotKey, pendingMobileCard.value.id);
  if (success !== false) {
    // Store the faction choice
    store.equipCardWithFaction(pendingMobileCard.value.id, faction);
    pendingMobileCard.value = null;
    // Switch to loadout tab to show the equipped card
    mobileActiveTab.value = 'loadout';
  } else {
    alert("Could not equip this card to the selected slot.");
  }
}

function confirmFactionSelection(faction) {
  if (!pendingFactionCard.value) return;
  
  equipCardWithSpecificFaction(pendingFactionCard.value.slotKey, faction);
  pendingFactionCard.value = null;
}

function cancelFactionSelection() {
  pendingMobileCard.value = null;
  pendingFactionCard.value = null;
}

// Unequip card from hand tab
function unequipCard(cardId) {
  const pilot = store.currentPilot;
  if (!pilot?.slotCards) return;

  // Find which slot the card is in
  const slotKey = Object.keys(pilot.slotCards).find(key => pilot.slotCards[key] === cardId);

  if (slotKey) {
    store.removeCardFromSlot(slotKey);
  }
}

function confirmCardPurchase() {
  if (!pendingCard.value) return;

  const cardCost = pendingCard.value.cost || 0;
  if (store.currentPilot.xp < cardCost) {
    alert("Not enough XP to buy this card.");
    return;
  }

  const isOwned = store.isCardOwnedByCurrentPilot(pendingCard.value.id);

  if (isOwned) {
    // This is an upgrade
    const success = store.upgradeCard(pendingCard.value.id);
    if (!success) {
      alert("Cannot upgrade this card further.");
      return;
    }
  } else {
    // This is a new purchase
    store.addCardToDeck(pendingCard.value.id);
  }

  store.currentPilot.xp -= cardCost;
  pendingCard.value = null;
}

function cancelCardPurchase() {
  pendingCard.value = null;
}

// Card swap functions
function confirmCardSwap() {
  if (!pendingTransfer.value) return;

  const { cardId, currentPilot, targetPilot, yourUpgradeLevel, targetUpgradeLevel } = pendingTransfer.value;

  // Initialize cardUpgrades if they don't exist
  if (!currentPilot.cardUpgrades) currentPilot.cardUpgrades = {};
  if (!targetPilot.cardUpgrades) targetPilot.cardUpgrades = {};

  // Swap upgrade levels
  currentPilot.cardUpgrades[cardId] = targetUpgradeLevel;
  targetPilot.cardUpgrades[cardId] = yourUpgradeLevel;

  pendingTransfer.value = null;
}

function cancelCardSwap() {
  pendingTransfer.value = null;
}
</script>
