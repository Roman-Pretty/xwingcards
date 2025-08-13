<template>
  <div class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-6 ">
      <div class="max-w-4xl px-6 mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Create New Pilot</h1>
          <p class="text-gray-400">Configure your pilot's identity, class, and starting ship</p>
        </div>
        <button
          v-if="store.pilots.length > 0"
          @click="goBack"
          class="btn btn-ghost text-gray-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
          Cancel
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6">
        <form @submit.prevent="createPilot" class="space-y-8">

          <!-- Step 1: Pilot Name -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h2 class="text-xl font-semibold text-white">Pilot Identity</h2>
            </div>

            <div class="ml-11">
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Pilot Name</label>
              <input
                v-model="name"
                id="name"
                type="text"
                required
                placeholder="Enter your pilot's name..."
                maxlength="50"
                class="input input-bordered w-full max-w-md bg-neutral-700 text-white placeholder-gray-400 border-neutral-600 focus:border-blue-500"
                :class="{ 'border-red-500': nameError }"
                @input="validateName"
              />
              <div v-if="nameError" class="text-red-400 text-sm mt-1">{{ nameError }}</div>
              <div v-else-if="name" class="text-green-400 text-sm mt-1">✓ Name is suitable!</div>
            </div>
          </div>

          <!-- Step 2: Pilot Class Selection -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h2 class="text-xl font-semibold text-white">Choose Your Path</h2>
            </div>

            <div class="ml-11 space-y-4">
              <p class="text-gray-400 text-sm">Select a pilot class that defines your abilities and available ships.</p>

              <div class="grid gap-4">
                <div
                  v-for="(info, key) in classes"
                  :key="key"
                  class="relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden"
                  :class="{
                    'ring-2 ring-opacity-100': pilotClass === key,
                    'hover:scale-[1.01]': pilotClass !== key
                  }"
                  :style="{
                    ringColor: pilotClass === key ? info.color : 'transparent'
                  }"
                  @click="selectClass(key)"
                >
                  <!-- Background Image -->
                  <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    :style="{
                      backgroundImage: `url(${info.image || '/fallback-image.png'})`
                    }"
                  ></div>

                  <!-- Overlay for better text readability -->
                  <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>

                  <!-- Selection overlay -->
                  <div
                    v-if="pilotClass === key"
                    class="absolute inset-0 transition-all duration-300"
                    :style="{
                      backgroundColor: info.color + '20',
                      boxShadow: `inset 0 0 0 2px ${info.color}`
                    }"
                  ></div>

                  <div class="relative bg-neutral-700/0 border-2 transition-all duration-300 rounded-lg h-full"
                       :class="{
                         'border-opacity-100': pilotClass === key,
                         'border-neutral-600/50 group-hover:border-gray-400/50': pilotClass !== key
                       }"
                       :style="{
                         borderColor: pilotClass === key ? info.color : ''
                       }">

                    <!-- Class Header -->
                    <div class="p-6 h-full flex flex-col">
                      <div class="flex items-center gap-4 mb-4">
                        <div class="flex items-center gap-3 flex-1">
                          <span class="font-[xwing] text-4xl drop-shadow-lg" :style="{ color: info.color }">{{ info.icon }}</span>
                          <div>
                            <h3 class="text-2xl font-bold text-white drop-shadow-lg">The {{ key }}</h3>
                            <p class="text-sm text-gray-200 drop-shadow">{{ info.description || 'A skilled pilot ready for combat.' }}</p>
                          </div>
                        </div>

                        <!-- Selection Indicator -->
                        <div class="flex-shrink-0">
                          <div v-if="pilotClass === key" class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg" :style="{ backgroundColor: info.color }">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
                              <path d="M20 6 9 17l-5-5"/>
                            </svg>
                          </div>
                          <div v-else class="w-7 h-7 border-2 border-white/70 rounded-full shadow-lg"></div>
                        </div>
                      </div>

                      <!-- Available Ships Preview -->
                      <div class="flex-1">
                        <div class="text-sm text-gray-200 mb-3 font-medium drop-shadow">Additional Ships:</div>
                        <div class="flex gap-3 overflow-x-auto pb-2">
                          <div
                            v-for="ship in getDisplayShips(info.ships)"
                            :key="ship.ship"
                            class="flex-shrink-0 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center min-w-[90px] shadow-lg"
                          >
                            <div class="font-[ships] text-2xl mb-2 text-gray-200">{{ ship.icon }}</div>
                            <div class="text-xs text-gray-300 mb-2 font-medium">{{ ship.ship }}</div>
                            <div class="flex justify-center gap-1 text-xs font-[xwing] text-gray-400">
                              <span v-for="(slot, idx) in ship.slots" :key="idx">{{ slot }}</span>
                            </div>
                          </div>
                          <div v-if="getRemainingShipsCount(info.ships) > 0" class="flex-shrink-0 flex items-center text-gray-300 text-sm px-2 font-medium drop-shadow">
                            +{{ getRemainingShipsCount(info.ships) }} more
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="classError" class="text-red-400 text-sm">{{ classError }}</div>
              <div v-else-if="pilotClass" class="text-green-400 text-sm">✓ Class selected!</div>
            </div>
          </div>

          <!-- Step 3: Starting Ship -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h2 class="text-xl font-semibold text-white">Choose Starting Ship</h2>
            </div>

            <div class="ml-11 space-y-4">
              <p class="text-gray-400 text-sm">Your starting ship determines your initial loadout slots and experience points.</p>

              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="ship in availableShips"
                  :key="ship.value"
                  class="group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden"
                  :class="{
                    'ring-2 ring-yellow-500 ring-opacity-100 scale-[1.02]': startingShip === ship.value,
                    'hover:scale-[1.01]': startingShip !== ship.value
                  }"
                  @click="selectShip(ship.value)"
                >
                  <div class="bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 transition-all duration-300 rounded-lg h-full shadow-lg"
                       :class="{
                         'border-yellow-500 shadow-yellow-500/20': startingShip === ship.value,
                         'border-neutral-600 group-hover:border-gray-500 group-hover:shadow-lg': startingShip !== ship.value
                       }">

                    <div class="p-6 h-full flex flex-col">
                      <div class="flex items-start gap-4 mb-4">
                        <!-- Ship Icon -->
                        <div class="font-[ships] text-5xl text-gray-300 flex-shrink-0 drop-shadow-lg">{{ ship.icon }}</div>

                        <!-- Ship Info -->
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-3">
                            <h3 class="text-xl font-bold text-white">{{ ship.label }}</h3>
                            <div v-if="startingShip === ship.value" class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            </div>
                            <div v-else class="w-6 h-6 border-2 border-gray-400 rounded-full group-hover:border-gray-300 transition-colors"></div>
                          </div>

                          <!-- Starting XP -->
                          <div class="flex items-center gap-2 mb-4">
                            <span class="text-sm text-gray-400 font-medium">Starting XP:</span>
                            <div class="flex items-center gap-1 text-yellow-300 font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
                              <span class="font-[xwing] text-lg font-light">Ì</span>
                              <span>{{ ship.xp }}</span>
                            </div>
                          </div>

                          <!-- Slots -->
                          <div class="mb-4">
                            <span class="text-sm text-gray-400 font-medium block mb-3">Loadout Slots:</span>
                            <div class="flex flex-wrap gap-2">
                              <span
                                v-for="(slot, i) in ship.slots"
                                :key="i"
                                class="inline-flex items-center justify-center w-9 h-9 bg-neutral-600 rounded-lg text-white font-[xwing] text-sm shadow-md border border-neutral-500"
                              >
                                {{ slot }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Ship Description -->
                      <div class="mt-auto">
                        <div class="text-sm text-gray-300 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <p class="leading-relaxed">{{ getShipDescription(ship.value) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="shipError" class="text-red-400 text-sm">{{ shipError }}</div>
              <div v-else-if="startingShip" class="text-green-400 text-sm">✓ Ship selected!</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                v-if="store.pilots.length > 0"
                type="button"
                class="btn btn-ghost flex-1 sm:flex-none sm:w-32"
                @click="goBack"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                class="btn btn-primary flex-1 sm:flex-none sm:w-40"
                :disabled="!canCreate"
                :class="{ 'btn-disabled': !canCreate }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create Pilot
              </button>
            </div>

            <!-- Form Summary -->
            <div v-if="name || pilotClass || startingShip" class="mt-4 pt-4 border-t border-neutral-700">
              <div class="text-sm text-gray-400 mb-2">Summary:</div>
              <div class="flex flex-wrap gap-4 text-sm">
                <span v-if="name" class="text-white">
                  <span class="text-gray-400">Name:</span> {{ name }}
                </span>
                <span v-if="pilotClass" class="text-white">
                  <span class="text-gray-400">Class:</span> {{ pilotClass }}
                </span>
                <span v-if="startingShip" class="text-white">
                  <span class="text-gray-400">Ship:</span> {{ startingShip }}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePilotStore } from "../stores/PilotStore";
import classData from "../data/classes.json";

const router = useRouter();
const store = usePilotStore();

// Form data
const classes = ref(classData);
const name = ref("");
const pilotClass = ref("");
const startingShip = ref("X-Wing");

// Form validation errors
const nameError = ref("");
const classError = ref("");
const shipError = ref("");

// Form validation
const canCreate = computed(() => {
  return name.value.trim().length > 0 &&
         pilotClass.value &&
         startingShip.value &&
         !nameError.value &&
         !classError.value &&
         !shipError.value;
});

// Ship options with descriptions
const availableShips = [
  {
    label: "X-Wing",
    value: "X-Wing",
    icon: "x",
    slots: ["A", "P", "m", "n"],
    xp: 10
  },
  {
    label: "Y-Wing",
    value: "Y-Wing",
    icon: "y",
    slots: ["A", "P", "U", "B", "Y", "m"],
    xp: 16
  }
];

// Validation functions
function validateName() {
  nameError.value = "";
  const trimmedName = name.value.trim();

  if (trimmedName.length === 0) {
    return;
  }

  if (trimmedName.length < 2) {
    nameError.value = "Name must be at least 2 characters long";
    return;
  }

  if (trimmedName.length > 50) {
    nameError.value = "Name must be less than 50 characters";
    return;
  }

  // Check for duplicate names
  const existingPilot = store.pilots.find(p =>
    p.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existingPilot) {
    nameError.value = "A pilot with this name already exists";
    return;
  }

  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s\-'_.]+$/.test(trimmedName)) {
    nameError.value = "Name contains invalid characters";
    return;
  }
}

function selectClass(key) {
  pilotClass.value = key;
  classError.value = "";
}

function selectShip(shipValue) {
  startingShip.value = shipValue;
  shipError.value = "";
}

function getShipDescription(shipType) {
  const descriptions = {
    "X-Wing": "A versatile fighter with balanced offense and defense. Perfect for new pilots with its reliable performance and moderate upgrade capacity.",
    "Y-Wing": "A heavy bomber with extensive upgrade options. Ideal for pilots who prefer tactical flexibility and powerful ordnance capabilities."
  };
  return descriptions[shipType] || "A reliable starfighter ready for combat.";
}

// Helper functions for ship display logic
function getDisplayShips(ships) {
  const rank3AndAbove = ships.filter(s => s.rank >= 3);
  const rank2AndBelow = ships.filter(s => s.rank < 3);

  // If there are ships with rank >= 3, show those, otherwise show rank < 3
  const shipsToShow = rank3AndAbove.length > 0 ? rank3AndAbove : rank2AndBelow;
  return shipsToShow.slice(0, 4);
}

function getRemainingShipsCount(ships) {
  const rank3AndAbove = ships.filter(s => s.rank >= 3);
  const rank2AndBelow = ships.filter(s => s.rank < 3);

  // If there are ships with rank >= 3, show those, otherwise show rank < 3
  const totalShipsToShow = rank3AndAbove.length > 0 ? rank3AndAbove.length : rank2AndBelow.length;
  return Math.max(0, totalShipsToShow - 4);
}

// Navigation
function goBack() {
  if (store.pilots.length > 0) {
    router.push('/dashboard');
  }
  // If no pilots exist, stay on create pilot page
}

// Form submission
function createPilot() {
  // Final validation
  validateName();

  if (!pilotClass.value) {
    classError.value = "Please select a pilot class";
  }

  if (!startingShip.value) {
    shipError.value = "Please select a starting ship";
  }

  // Check if form is valid
  if (!canCreate.value) {
    // Scroll to first error
    const firstError = document.querySelector('.text-red-400');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    const xp = availableShips.find(ship => ship.value === startingShip.value)?.xp || 10;

    const newPilot = {
      id: Date.now().toString(),
      name: name.value.trim(),
      class: pilotClass.value,
      rank: 1,
      xp,
      selectedCards: [],
      slotCards: {},
      ownedCards: [],
      ships: [startingShip.value],
      selectedShip: startingShip.value,
      slots: [],
      usedFactionSlots: {},
    };

    // Add pilot to store
    store.pilots.push(newPilot);
    store.currentPilotId = newPilot.id;

    // Navigate to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Error creating pilot:', error);

    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg';
    errorMessage.textContent = 'Failed to create pilot. Please try again.';
    document.body.appendChild(errorMessage);

    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
}
</script>
