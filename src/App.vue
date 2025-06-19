<template>
  <main class="bg-neutral-900 w-full h-screen p-4 flex flex-row gap-4 inria-sans-regular overflow-hidden">
    <!-- If no pilots, show create pilot view -->
    <CreatePilot v-if="!hasPilots || creatingPilot" @cancel="creatingPilot = false" @created="onPilotCreated" />
    <!-- Otherwise show normal UI -->
    <template v-else>
      <!-- XP Modal -->
      <dialog id="my_modal_1" class="modal">
        <div class="modal-box bg-neutral-800 text-white">
          <h3 class="text-lg font-bold mb-2">Add XP to {{ store.currentPilot?.name }}</h3>
          <input v-model.number="xpToAdd" type="number" min="1" class="input input-bordered w-full mb-4 text-white"
            placeholder="Enter XP amount" />
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button type="button" class="btn" @click="confirmAddXP">Confirm</button>
              <button class="btn btn-neutral">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- Purchase Confirmation Modal -->
      <dialog id="confirm_card_purchase_modal" class="modal">
        <div class="modal-box bg-neutral-800 text-white">
          <h3 class="text-lg font-bold mb-2">Confirm Card Purchase</h3>
          <p class="mb-4">
            Are you sure you want to buy
            <strong>{{ pendingCard?.name }}</strong> for
            <span class="font-[xwing] text-lg">Ì</span>{{ pendingCard?.cost }}?
          </p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <button type="button" class="btn" @click="confirmCardPurchase">
                Confirm
              </button>
              <button class="btn btn-neutral" @click="cancelCardPurchase">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- Left Side: Level -->
      <div
        class="flex-1 border-2 border-neutral-700 rounded-2xl p-4 flex flex-col justify-between text-white overflow-hidden">
        <div class="flex flex-col justify-between h-full">
          <div class="flex-1">
            <div class="flex flex-row justify-between w-full items-center">
              <div class="flex flex-row gap-4">
                <div class="text-xl flex flex-row gap-2 items-center cursor-default">
                  <span class="font-[xwing] text-3xl -mt-2" :style="{ color: color }">{{ icon }}</span>
                  <span class="font-bold" :style="{ color: color }">The {{ store.currentPilot?.class }}</span>
                </div>

                <!-- XP icon + value -->
                <div class="text-xl flex flex-row items-center cursor-default text-yellow-300">
                  <span class="font-[xwing] text-3xl -mt-2">Ì</span>
                  <span class="font-bold">{{ store.currentPilot?.xp }}</span>
                </div>

                <div v-if="store.currentPilot?.class === 'Force User' && forceCount < 1"
                  class="text-xl flex flex-row items-center cursor-default text-force gap-1">
                  <span class="font-[xwing] text-xl -mt-1">h</span>
                  <span class="font-bold">1</span>
                </div>

                <!-- Force -->
                <div v-if="forceCount > 0" class="text-xl flex flex-row items-center cursor-default text-force gap-1">
                  <span class="font-[xwing] text-xl -mt-1">h`</span>
                  <span class="font-bold">{{ forceCount }}</span>
                </div>

              </div>
              <div class="flex flex-row-reverse gap-2 items-center">
                <button class="btn" @click="openModal">Add XP</button>

                <PilotTabs @add-pilot="creatingPilot = true" />
              </div>
            </div>
          </div>

          <!-- Bottom Content -->
          <div class="flex flex-col w-full mt-auto">
            <div>
              <div class="w-full flex flex-row items-center justify-between mb-4">
                <h2 class="text-lg ">Loadout</h2>
                <div v-for="(count, symbol) in unlockedFactionCounts" :key="symbol" :style="{ color }"
                  class="text-xl flex flex-row items-center gap-1 cursor-default ">
                  <span class="font-[xwing] font-light text-2xl -mt-1.5">
                    {{ symbol }}
                  </span>
                  <span class="font-bold">{{ getFactionSlots(symbol) }} / {{ count }}</span>

                </div>
              </div>
              <Slots />
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

      <!-- Right Side: Card UI -->
      <div class="flex-1 flex flex-col overflow-visible min-h-0">
        <div class="p-4 border-2 border-neutral-700 rounded-2xl flex justify-between items-center flex-row">
          <div class="join">
            <button class="btn join-item" :class="{
              'btn-active': activeTab === 'hand',
              'btn-neutral': activeTab !== 'hand',
            }" @click="activeTab = 'hand'">
              Hand
            </button>
            <button class="btn join-item" :class="{
              'btn-active': activeTab === 'deck',
              'btn-neutral': activeTab !== 'deck',
            }" @click="activeTab = 'deck'">
              Deck
            </button>
            <button class="btn join-item" :class="{
              'btn-active': activeTab === 'store',
              'btn-neutral': activeTab !== 'store',
            }" @click="activeTab = 'store'">
              Store
            </button>
          </div>
          <div class="flex items-center gap-2">

            <!-- Styled Type Filter Dropdown -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button"
                class="text-white gap-2 hover:opacity-70 cursor-pointer duration-200 transition-opacity mb-1 flex flex-row items-center capitalize">
                {{ selectedType }}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-chevron-down-icon lucide-chevron-down">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              <div tabindex="0"
                class="dropdown-content z-10 h-[50vh] overflow-auto p-4 rounded-box shadow-md text-sm text-white bg-neutral-800 flex flex-wrap gap-2">
                <button @click="selectedType = 'all'" :class="[
                  'btn btn-ghost  w-full flex flex-row justify-start items-center gap-2',
                  selectedType === 'all' ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white'
                ]">
                  <span class="font-[xwing] text-lg font-light -mt-1.5">
                    )
                  </span>
                  <span>All</span>
                </button>
                <button v-for="type in typeOptions" :key="type.name" @click="selectedType = type.name.toLowerCase()"
                  :class="[
                    'btn btn-ghost  w-full flex flex-row justify-start items-center gap-2',
                    selectedType === type.name.toLowerCase() ? 'bg-yellow-600 border-yellow-400 text-white' : 'text-white '
                  ]">
                  <span class="font-[xwing] text-lg font-light -mt-1.5">
                    {{ type.symbol || tokenToLetterMap[type.name.toLowerCase()] || '?' }}
                  </span>
                  <span>{{ type.name }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Scrollable Cards List -->
        <section class="flex-1 overflow-y-auto p-4 flex flex-row flex-wrap gap-6 justify-center pb-16 pt-8 min-h-0">
          <Card v-for="(card, index) in cardsToShow" :key="card?.id || card?.name || index" v-bind="card"
            :showXP="activeTab === 'store'" :owned="activeTab === 'store' && store.isCardOwnedByCurrentPilot(card.id)"
            :draggable="activeTab === 'deck' && !store.isCardTaken(card.id)" @dragstart="onDragStart(card.id, $event)"
            @click="select(card)" :class="{
              'pointer-events-none opacity-50': store.isCardOwnedByCurrentPilot(card.id) && activeTab === 'store',
              'opacity-50 cursor-not-allowed': activeTab === 'deck' && store.isCardTaken(card.id),
              'cursor-grab hover:scale-105 transition-transform duration-150 ease-in-out':
                activeTab === 'deck' && !store.isCardTaken(card.id),
              'cursor-default': activeTab !== 'deck',
            }" />

          <div v-if="cardsToShow.length === 0 && activeTab === 'hand'"
            class="text-white text-center text-lg opacity-70 font-medium flex items-center justify-center w-2/3">
            You have no equipped cards. You can equip cards from your deck or purchase new ones from the
            store.<br /><br />
            Drag cards from your deck to their respective slots to equip them.
          </div>
          <div v-if="cardsToShow.length === 0 && activeTab === 'deck'"
            class="text-white text-center text-lg opacity-70 font-medium w-full flex items-center justify-center">
            Purchase cards from the store to add them to your deck.
          </div>
        </section>

      </div>
    </template>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import RankList from "./components/RankList.vue";
import Card from "./components/Card.vue";
import PilotTabs from "./components/PilotTabs.vue";
import Ships from "./components/Ships.vue";
import Slots from "./components/Slots.vue";
import classData from "./data/classes.json";
import { usePilotStore } from "./stores/pilotStore";
import { useCardFilter } from "./composables/useCardFilter";
import CreatePilot from "./components/CreatePilot.vue";
import { tokenToLetterMap } from "./utils/mappings";

const store = usePilotStore();


// compute how many of each faction‐symbol the pilot has unlocked by rank
const unlockedFactionCounts = computed(() => {
  const pilot = store.currentPilot;
  if (!pilot) return {};
  const classInfo = classData[pilot.class];
  if (!classInfo) return {};

  // all ranks up to current
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

const { byAllowedFactions } = useCardFilter();

const selectedType = ref('all');

const typeOptions = [
  { name: "Talent" },
  { name: "Configuration" },
  { name: "Title" },
  { name: "Illicit" },
  { name: "Astromech" },
  { name: "Crew" },
  { name: "Device" },
  { name: "Modification" },
  { name: "Title" },
  { name: "Torpedo" },
  { name: "Missile" },
  { name: "Cannon" },
  { name: "Sensor" },
  { name: "Tech" },
  { name: "Configuration" },
  { name: "Force" },
  { name: "Ace" },
  { name: "Sensitive" },
];

const activeTab = ref("hand");
const creatingPilot = ref(false);

const hasPilots = computed(() => store.pilots.length > 0);

watch(
  () => store.pilots.length,
  (newLen) => {
    if (newLen === 0) {
      creatingPilot.value = true;
    }
  },
  { immediate: true }
);

// Updated cardsToShow logic with hand tab support:
const cardsToShow = computed(() => {
  if (activeTab.value === "hand") {
    // Get equipped cards in slots
    const slotCardIds = Object.values(store.currentPilot?.slotCards || {});
    // Filter to only cards that exist in cards.json and belong to the pilot's owned cards
    const equippedCards = slotCardIds
      .map(id => store.ownedCards.find(c => c.id === id))
      .filter(Boolean);

    if (selectedType.value === 'all') {
      return equippedCards;
    }

    return equippedCards.filter(card => card.type?.toLowerCase() === selectedType.value);
  }

  if (activeTab.value === "deck") {
    let baseCards = store.ownedCards;
    if (selectedType.value === 'all') return baseCards;
    return baseCards.filter(card => card.type?.toLowerCase() === selectedType.value);
  }

  // Store tab
  const className = store.currentPilot?.class;
  const classInfo = classData[className];
  const allowedFactions = classInfo?.factions?.map((f) => f.toLowerCase()) || [];
  let baseCards = byAllowedFactions(allowedFactions);

  if (selectedType.value === 'all') return baseCards;
  return baseCards.filter(card => card.type?.toLowerCase() === selectedType.value);
});

const icon = computed(() => {
  return classData[store.currentPilot?.class]?.icon || "";
});

const color = computed(() => {
  return classData[store.currentPilot?.class]?.color || "amber";
});

const getFactionSlots = (symbol) => store.getMappedFactionSlots(symbol);


function onDragStart(cardId, event) {
  if (activeTab.value !== "deck") {
    event.preventDefault();
    return;
  }
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", cardId);
}

// XP Modal Logic
const xpToAdd = ref(null);

function openModal() {
  const modal = document.getElementById("my_modal_1");
  if (modal?.showModal) {
    modal.showModal();
  }
}

function confirmAddXP() {
  if (xpToAdd.value > 0) {
    store.currentPilot.xp += xpToAdd.value;
    const modal = document.getElementById("my_modal_1");
    modal?.close();
    xpToAdd.value = null;
  }
}

const pendingCard = ref(null);
function select(card) {
  if (activeTab.value === "store") {
    // Prevent buying if already owned
    if (store.isCardTaken(card.id)) {
      alert("You already own this card.");
      return;
    }

    pendingCard.value = card;
    const modal = document.getElementById("confirm_card_purchase_modal");
    if (modal?.showModal) {
      modal.showModal();
      document.body.style.overflow = "hidden";
    }
  } else {
    store.selectCard(card.id, { unique: card.unique });
  }
}

// Confirm buying the card
function confirmCardPurchase() {
  if (!pendingCard.value) return;

  const cardCost = pendingCard.value.cost || 0;
  if (store.currentPilot.xp < cardCost) {
    alert("Not enough XP to buy this card.");
    return;
  }

  store.addCardToDeck(pendingCard.value.id);
  store.currentPilot.xp -= cardCost;

  const modal = document.getElementById("confirm_card_purchase_modal");
  modal?.close();
  document.body.style.overflow = ""; // re-enable scroll
  pendingCard.value = null;
}

function cancelCardPurchase() {
  const modal = document.getElementById("confirm_card_purchase_modal");
  modal?.close();
  document.body.style.overflow = "";
  pendingCard.value = null;
}

function onPilotCreated(newPilot) {
  creatingPilot.value = false;
  store.pilots.push(newPilot);
  store.currentPilotId = newPilot.id;
}

const forceCount = computed(() => {
  const pilot = store.currentPilot;
  if (!pilot || !pilot.slotCards) return 0;

  return Object.values(pilot.slotCards)
    .map(cardId => store.ownedCards.find(c => c.id === cardId))
    .filter(card => card?.type?.toLowerCase() === 'force' || card?.type?.toLowerCase() === 'sensitive')
    .length;
});

</script>