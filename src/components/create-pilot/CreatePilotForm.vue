/**
 * CreatePilotForm Component
 * 
 * Main form container for creating a new pilot with three steps:
 * 1. Pilot identity (name)
 * 2. Class selection
 * 3. Starting ship selection
 */
<template>
  <div class="bg-neutral-900 w-full h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 bg-neutral-800 border-b border-neutral-700 p-6">
      <div class="max-w-4xl px-6 mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Create New Pilot</h1>
          <p class="text-gray-400">Configure your pilot's identity, class, and starting ship</p>
        </div>
        <button 
          v-if="hasExistingPilots" 
          @click="$emit('go-back')" 
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
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- Step 1: Pilot Name -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h2 class="text-xl font-semibold text-white">Pilot Identity</h2>
            </div>
            
            <div class="ml-11">
              <label for="pilot-name" class="block text-sm font-medium text-gray-300 mb-2">Pilot Name</label>
              <input 
                id="pilot-name"
                v-model="formData.name" 
                type="text" 
                required 
                placeholder="Enter your pilot's name..."
                maxlength="50"
                class="input input-bordered w-full max-w-md bg-neutral-700 text-white placeholder-gray-400 border-neutral-600 focus:border-blue-500"
                :class="{ 'border-red-500': errors.name }"
                @input="handleNameInput"
              />
              <div v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</div>
              <div v-else-if="formData.name" class="text-green-400 text-sm mt-1">✓ Name is suitable!</div>
            </div>
          </div>
          
          <!-- Step 2: Class Selection -->
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
                    'ring-2 ring-opacity-100': formData.pilotClass === key,
                    'hover:scale-[1.01]': formData.pilotClass !== key
                  }"
                  :style="{
                    ringColor: formData.pilotClass === key ? info.color : 'transparent'
                  }"
                  @click="selectClass(key)"
                >
                  <div class="bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 transition-all duration-300 rounded-lg h-full shadow-lg p-6"
                       :class="{
                         'border-opacity-100': formData.pilotClass === key,
                         'border-neutral-600 group-hover:border-gray-500': formData.pilotClass !== key
                       }"
                       :style="{
                         borderColor: formData.pilotClass === key ? info.color : ''
                       }">
                    
                    <div class="flex items-center gap-4 mb-4">
                      <span class="font-[xwing] text-4xl" :style="{ color: info.color }">{{ info.icon }}</span>
                      <div class="flex-1">
                        <h3 class="text-2xl font-bold text-white">The {{ key }}</h3>
                        <p class="text-sm text-gray-300">{{ info.description || 'A skilled pilot ready for combat.' }}</p>
                      </div>
                      <div v-if="formData.pilotClass === key" class="w-7 h-7 rounded-full flex items-center justify-center" :style="{ backgroundColor: info.color }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                      <div v-else class="w-7 h-7 border-2 border-white/70 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="errors.class" class="text-red-400 text-sm">{{ errors.class }}</div>
              <div v-else-if="formData.pilotClass" class="text-green-400 text-sm">✓ Class selected!</div>
            </div>
          </div>

          <!-- Step 3: Ship Selection -->
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
                    'ring-2 ring-yellow-500 ring-opacity-100 scale-[1.02]': formData.startingShip === ship.value,
                    'hover:scale-[1.01]': formData.startingShip !== ship.value
                  }"
                  @click="selectShip(ship.value)"
                >
                  <div class="bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 transition-all duration-300 rounded-lg h-full shadow-lg p-6"
                       :class="{
                         'border-yellow-500 shadow-yellow-500/20': formData.startingShip === ship.value,
                         'border-neutral-600 group-hover:border-gray-500': formData.startingShip !== ship.value
                       }">
                    
                    <div class="flex items-start gap-4 mb-4">
                      <div class="font-[ships] text-5xl text-gray-300 flex-shrink-0">{{ ship.icon }}</div>
                      
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-3">
                          <h3 class="text-xl font-bold text-white">{{ ship.label }}</h3>
                          <div v-if="formData.startingShip === ship.value" class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M20 6 9 17l-5-5"/>
                            </svg>
                          </div>
                          <div v-else class="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                        </div>
                        
                        <div class="flex items-center gap-2 mb-4">
                          <span class="text-sm text-gray-400">Starting XP:</span>
                          <div class="flex items-center gap-1 text-yellow-300 font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
                            <span class="font-[xwing] text-lg">Ì</span>
                            <span>{{ ship.xp }}</span>
                          </div>
                        </div>
                        
                        <div class="mb-4">
                          <span class="text-sm text-gray-400 block mb-2">Loadout Slots:</span>
                          <div class="flex flex-wrap gap-2">
                            <span 
                              v-for="(slot, i) in ship.slots" 
                              :key="i"
                              class="inline-flex items-center justify-center w-9 h-9 bg-neutral-600 rounded-lg text-white font-[xwing] text-sm"
                            >
                              {{ slot }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="text-sm text-gray-300 bg-black/20 rounded-lg p-4">
                      {{ ship.description }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="errors.ship" class="text-red-400 text-sm">{{ errors.ship }}</div>
              <div v-else-if="formData.startingShip" class="text-green-400 text-sm">✓ Ship selected!</div>
            </div>
          </div>
          
          <!-- Form Actions -->
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <button 
                v-if="hasExistingPilots"
                type="button" 
                class="btn btn-ghost flex-1 sm:flex-none sm:w-32" 
                @click="$emit('go-back')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create Pilot
              </button>
            </div>
            
            <!-- Form Summary -->
            <div v-if="formData.name || formData.pilotClass || formData.startingShip" class="mt-4 pt-4 border-t border-neutral-700">
              <div class="text-sm text-gray-400 mb-2">Summary:</div>
              <div class="flex flex-wrap gap-4 text-sm">
                <span v-if="formData.name" class="text-white">
                  <span class="text-gray-400">Name:</span> {{ formData.name }}
                </span>
                <span v-if="formData.pilotClass" class="text-white">
                  <span class="text-gray-400">Class:</span> {{ formData.pilotClass }}
                </span>
                <span v-if="formData.startingShip" class="text-white">
                  <span class="text-gray-400">Ship:</span> {{ formData.startingShip }}
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
import { ref, computed } from 'vue'
import { usePilotValidation } from '../../composables/usePilotValidation'
import classData from '../../data/classes.json'

/**
 * Component props
 */
const props = defineProps({
  /** Whether there are existing pilots */
  hasExistingPilots: {
    type: Boolean,
    default: false
  }
})

/**
 * Component events
 */
const emit = defineEmits(['create-pilot', 'go-back'])

/**
 * Form data
 */
const formData = ref({
  name: '',
  pilotClass: '',
  startingShip: 'X-Wing'
})

/**
 * Available pilot classes
 */
const classes = ref(classData)

/**
 * Available starting ships with stats and descriptions
 */
const availableShips = [
  {
    label: "X-Wing",
    value: "X-Wing", 
    icon: "x",
    slots: ["A", "P", "m", "n"],
    xp: 10,
    description: "A versatile fighter with balanced offense and defense. Perfect for new pilots with its reliable performance and moderate upgrade capacity."
  },
  {
    label: "Y-Wing",
    value: "Y-Wing",
    icon: "y", 
    slots: ["A", "P", "U", "B", "Y", "m"],
    xp: 16,
    description: "A heavy bomber with extensive upgrade options. Ideal for pilots who prefer tactical flexibility and powerful ordnance capabilities."
  }
]

/**
 * Form validation using composable
 */
const { errors, validateName, clearError } = usePilotValidation()

/**
 * Check if form can be submitted
 */
const canCreate = computed(() => {
  return formData.value.name.trim().length > 0 && 
         formData.value.pilotClass && 
         formData.value.startingShip && 
         !errors.value.name && 
         !errors.value.class && 
         !errors.value.ship
})

/**
 * Handle class selection
 * @param {string} classKey - Selected class key
 */
const selectClass = (classKey) => {
  formData.value.pilotClass = classKey
  clearError('class')
}

/**
 * Handle ship selection
 * @param {string} shipValue - Selected ship value
 */
const selectShip = (shipValue) => {
  formData.value.startingShip = shipValue
  clearError('ship')
}

/**
 * Handle name input changes
 */
const handleNameInput = () => {
  validateName(formData.value.name)
}

/**
 * Handle form submission
 */
const handleSubmit = () => {
  // Final validation
  const isNameValid = validateName(formData.value.name)
  
  if (!formData.value.pilotClass) {
    errors.value.class = "Please select a pilot class"
  }
  
  if (!formData.value.startingShip) {
    errors.value.ship = "Please select a starting ship"
  }
  
  if (canCreate.value && isNameValid) {
    const selectedShip = availableShips.find(ship => ship.value === formData.value.startingShip)
    
    emit('create-pilot', {
      ...formData.value,
      xp: selectedShip?.xp || 10
    })
  }
}
</script>
