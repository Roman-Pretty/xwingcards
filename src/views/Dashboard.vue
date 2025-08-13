/**
 * Dashboard View
 * 
 * Main dashboard interface with responsive layout for pilot management,
 * loadout configuration, and card management
 */
<template>
  <main class="bg-neutral-900 w-full h-screen inria-sans-regular overflow-hidden"
    :class="{ 
      'p-4 flex flex-row gap-4': !isMobile, 
      'flex flex-col': isMobile
    }">
    
    <!-- Desktop Layout -->
    <DesktopLoadoutPanel
      v-if="!isMobile"
      :pilot-class="store.currentPilot?.class"
      :class-icon="icon"
      :class-color="color"
      :pilot-xp="store.currentPilot?.xp"
      :force-count="forceCount"
      :show-base-force="store.currentPilot?.class === 'Force User' && forceCount < 1"
      :show-force-count="forceCount > 0"
      :faction-counts="unlockedFactionCounts"
      :used-slots="getFactionSlotsMap()"
      :currently-dragged-card="currentlyDraggedCard"
      @add-xp="openModal"
      @add-pilot="$router.push('/create-pilot')"
    />

    <!-- Mobile Loadout Tab -->
    <MobileLoadoutTab
      v-if="isMobile && mobileActiveTab === 'loadout'"
      :pilot-class="store.currentPilot?.class"
      :class-icon="icon"
      :class-color="color"
      :pilot-xp="store.currentPilot?.xp"
      :faction-counts="unlockedFactionCounts"
      :used-slots="getFactionSlotsMap()"
      :currently-dragged-card="currentlyDraggedCard"
      @add-xp="openModal"
      @add-pilot="$router.push('/create-pilot')"
    />

    <!-- Mobile Cards Tab -->
    <MobileCardsTab
      v-if="isMobile && mobileActiveTab === 'cards'"
      :active-tab="activeTab"
      :search-query="searchQuery"
      :selected-type="selectedType"
      :type-options="typeOptions"
      :cards-to-show="cardsToShow"
      :has-filters="searchQuery || selectedType !== 'all'"
      :get-card-upgrade-level="store.getCardUpgradeLevel"
      :is-card-owned="store.isCardOwnedByCurrentPilot"
      :can-upgrade-card="store.canUpgradeCard"
      :is-card-taken="store.isCardTaken"
      @switch-tab="switchTab"
      @update:search-query="searchQuery = $event"
      @select-type="selectType"
      @clear-filters="clearFilters"
      @select-card="select"
      @navigate="$router.push($event)"
    />

    <!-- Desktop Cards Panel -->
    <DesktopCardsPanel
      v-if="!isMobile"
      :active-tab="activeTab"
      :search-query="searchQuery"
      :selected-type="selectedType"
      :type-options="typeOptions"
      :cards-to-show="cardsToShow"
      :has-filters="searchQuery || selectedType !== 'all'"
      :get-card-upgrade-level="store.getCardUpgradeLevel"
      :is-card-owned="store.isCardOwnedByCurrentPilot"
      :can-upgrade-card="store.canUpgradeCard"
      :is-card-taken="store.isCardTaken"
      :show-context-menu="showContextMenu"
      :context-menu-x="contextMenuX"
      :context-menu-y="contextMenuY"
      :context-card="contextCard"
      :other-pilots="otherPilots"
      @switch-tab="switchTab"
      @update:search-query="searchQuery = $event"
      @select-type="selectType"
      @clear-filters="clearFilters"
      @select-card="select"
      @navigate="$router.push($event)"
      @drag-start="(cardId, event) => onDragStart(cardId, event)"
      @drag-end="onDragEnd"
      @right-click-card="onRightClickCard"
      @close-context-menu="showContextMenu = false"
      @give-card-to-pilot="giveCardToPilot"
    />

    <!-- Mobile Bottom Navigation -->
    <MobileBottomTabs
      v-if="isMobile"
      :active-tab="mobileActiveTab"
      @switch-tab="mobileActiveTab = $event"
    />

    <!-- Modal Components -->
    <CardPurchaseModal 
      ref="cardPurchaseModal" 
      :card="pendingCard" 
      :is-upgrade="isPendingCardUpgrade"
      :upgrade-level="pendingCardUpgradeLevel" 
      @confirm="confirmCardPurchase" 
      @cancel="cancelCardPurchase" 
    />

    <AddXpModal 
      ref="addXpModal" 
      :pilot-name="store.currentPilot?.name || 'Unknown Pilot'" 
      @confirm="confirmAddXP"
      @cancel="closeAddXpModal" 
    />

    <CardSwapModal 
      ref="cardSwapModal" 
      :card-name="pendingTransfer?.cardName"
      :target-pilot-name="pendingTransfer?.targetPilotName" 
      :your-upgrade-level="pendingTransfer?.yourUpgradeLevel"
      :target-upgrade-level="pendingTransfer?.targetUpgradeLevel" 
      @confirm="confirmCardSwap" 
      @cancel="cancelCardSwap" 
    />

    <CardEquipModal 
      ref="cardEquipModal" 
      :card="pendingMobileCard" 
      :available-slots="availableSlots" 
      @equip="equipCardToSlot" 
      @cancel="cancelMobileCardSelection" 
    />

    <FactionSelectionModal 
      ref="factionSelectionModal" 
      :card-name="pendingFactionCard?.name" 
      :card-id="pendingFactionCard?.cardId"
      :factions="pendingFactionCard?.factions" 
      @confirm="confirmFactionSelection" 
      @cancel="cancelFactionSelection" 
    />
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

// Components
import {
  DesktopLoadoutPanel,
  DesktopCardsPanel,
  MobileBottomTabs,
  MobileLoadoutTab,
  MobileCardsTab
} from "../components/dashboard"

import CardPurchaseModal from "../components/cards/CardPurchaseModal.vue"
import AddXpModal from "../components/modals/AddXpModal.vue"
import CardSwapModal from "../components/cards/CardSwapModal.vue"
import CardEquipModal from "../components/cards/CardEquipModal.vue"
import FactionSelectionModal from "../components/modals/FactionSelectionModal.vue"

// Data and Composables
import classData from "../data/classes.json"
import { useCardFilter } from "../composables/useCardFilter"
import { usePilotStore } from "../stores/PilotStore"

/**
 * Router and Store
 */
const router = useRouter()
const store = usePilotStore()

/**
 * Component refs for modals
 */
const cardPurchaseModal = ref(null)
const addXpModal = ref(null)
const cardSwapModal = ref(null)
const cardEquipModal = ref(null)
const factionSelectionModal = ref(null)

/**
 * UI state management
 */
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextCard = ref(null)
const selectedType = ref("all")
const activeTab = ref("hand")
const pendingCard = ref(null)
const currentlyDraggedCard = ref(null)
const pendingTransfer = ref(null)
const pendingFactionCard = ref(null)
const searchQuery = ref("")

/**
 * Mobile responsive state
 */
const isMobile = ref(false)
const mobileActiveTab = ref('loadout')
const pendingMobileCard = ref(null)

/**
 * Mobile detection and responsive handling
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

/**
 * Computed properties for pilot data
 */
const otherPilots = computed(() =>
  store.pilots.filter(p => p.id !== store.currentPilotId)
)

const equippedCardIds = computed(() => {
  return new Set(Object.values(store.currentPilot?.slotCards || {}))
})

const icon = computed(() => {
  return classData[store.currentPilot?.class]?.icon || ""
})

const color = computed(() => {
  return classData[store.currentPilot?.class]?.color || "amber"
})

/**
 * Computed properties for faction and force management
 */
const unlockedFactionCounts = computed(() => {
  const pilot = store.currentPilot
  if (!pilot) return {}
  const classInfo = classData[pilot.class]
  if (!classInfo) return {}

  const ranks = classInfo.ranks.filter(r => r.rank <= pilot.rank)
  const counts = {}
  for (const r of ranks) {
    if (!r.faction) continue
    for (const sym of r.faction) {
      counts[sym] = (counts[sym] || 0) + 1
    }
  }
  return counts
})

const forceCount = computed(() => {
  const pilot = store.currentPilot
  if (!pilot || !pilot.slotCards) return 0

  return Object.values(pilot.slotCards)
    .map(cardId => store.ownedCards.find(c => c.id === cardId))
    .filter(card => {
      const types = Array.isArray(card?.type) ? card.type : [card?.type]
      return types.some(type => type?.toLowerCase() === 'force' || type?.toLowerCase() === 'sensitive')
    })
    .length
})

/**
 * Computed properties for card purchasing
 */
const isPendingCardUpgrade = computed(() => {
  if (!pendingCard.value) return false
  return store.isCardOwnedByCurrentPilot(pendingCard.value.id) && store.canUpgradeCard(pendingCard.value.id)
})

const pendingCardUpgradeLevel = computed(() => {
  if (!pendingCard.value) return 0
  return store.getCardUpgradeLevel(pendingCard.value.id)
})

/**
 * Card filtering and display
 */
const { byAllowedFactions } = useCardFilter()

const cardsToShow = computed(() => {
  let baseCards = []

  if (activeTab.value === "hand") {
    const slotCardIds = Object.values(store.currentPilot?.slotCards || {})
    baseCards = slotCardIds
      .filter(id => id && id !== null && id !== undefined)
      .map(id => {
        const cardInfo = store.getCardDisplayInfo(id)
        return cardInfo
      })
      .filter(Boolean)
  } else if (activeTab.value === "deck") {
    baseCards = store.ownedCards.map(card => {
      const cardInfo = store.getCardDisplayInfo(card.id)
      return cardInfo || card
    })
  } else if (activeTab.value === "store") {
    const className = store.currentPilot?.class
    const classInfo = classData[className]
    const allowedFactions = classInfo?.factions?.map(f => f.toLowerCase()) || []
    baseCards = byAllowedFactions(allowedFactions)
  }

  // Apply type filter
  if (selectedType.value !== 'all') {
    baseCards = baseCards.filter(card => {
      const cardTypes = Array.isArray(card.type) ? card.type : [card.type]
      return cardTypes.some(type => type?.toLowerCase() === selectedType.value)
    })
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    baseCards = baseCards.filter(card => {
      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction]
      const factionMatch = cardFactions.some(faction => 
        faction?.toLowerCase().includes(query) ||
        (query === 'rebel' && faction?.toLowerCase() === 'neutral')
      )
      
      return (
        card.name?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query) ||
        (Array.isArray(card.type) ? card.type : [card.type]).some(type => type?.toLowerCase().includes(query)) ||
        factionMatch
      )
    })
  }

  return baseCards
})

/**
 * Available card types for filtering
 */
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
].sort((a, b) => a.name.localeCompare(b.name))

/**
 * Available slots for mobile card equipping
 */
const availableSlots = computed(() => {
  const pilot = store.currentPilot
  if (!pilot || !pendingMobileCard.value) return []
  
  const cardTypes = Array.isArray(pendingMobileCard.value.type) 
    ? pendingMobileCard.value.type 
    : [pendingMobileCard.value.type]
  
  const slots = []
  const classInfo = classData[pilot.class]
  if (!classInfo) return []
  
  const shipEntry = classInfo.ships.find(s => s.ship === pilot.selectedShip)
  const shipSlots = shipEntry?.slots || []
  const lockedSlots = shipEntry?.lockedSlots || []
  
  const rankData = classInfo.ranks.find(r => r.rank === pilot.rank)
  const rankSlots = rankData?.slots || []
  const optionalSlots = rankData?.optionalslots || []
  
  const allFixedSlots = [...shipSlots, ...rankSlots]
  
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
  }
  
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
  }
  
  const expectedSlotLetters = cardTypes.map(type => cardTypeToSlotMap[type?.toLowerCase()]).filter(Boolean)
  
  // Check fixed slots
  allFixedSlots.forEach((slot, index) => {
    const slotKey = `fixed-${index}`
    
    if (expectedSlotLetters.includes(slot)) {
      const currentCard = pilot.slotCards?.[slotKey]
      const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null
      
      slots.push({
        key: slotKey,
        name: slotLetterToNameMap[slot] || slot,
        icon: slot,
        occupied: !!currentCard,
        occupiedCard: currentCardInfo?.name
      })
    }
  })
  
  // Check optional slots
  if (Array.isArray(optionalSlots)) {
    optionalSlots.forEach((slotGroup, groupIndex) => {
      if (Array.isArray(slotGroup)) {
        slotGroup.forEach((slot, slotIndex) => {
          const slotKey = `optional-${groupIndex}`
          
          if (expectedSlotLetters.includes(slot)) {
            const currentCard = pilot.slotCards?.[slotKey]
            const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null
            
            slots.push({
              key: slotKey,
              name: slotLetterToNameMap[slot] || slot,
              icon: slot,
              occupied: !!currentCard,
              occupiedCard: currentCardInfo?.name
            })
          }
        })
      } else {
        const slotKey = `optional-${groupIndex}`
        
        if (expectedSlotLetters.includes(slotGroup)) {
          const currentCard = pilot.slotCards?.[slotKey]
          const currentCardInfo = currentCard ? store.getCardDisplayInfo(currentCard) : null
          
          slots.push({
            key: slotKey,
            name: slotLetterToNameMap[slotGroup] || slotGroup,
            icon: slotGroup,
            occupied: !!currentCard,
            occupiedCard: currentCardInfo?.name
          })
        }
      }
    })
  }
  
  return slots
})

/**
 * Helper function to get faction slots mapping
 * @returns {Object} Mapping of faction symbols to used slot counts
 */
function getFactionSlotsMap() {
  const result = {}
  for (const symbol of Object.keys(unlockedFactionCounts.value)) {
    result[symbol] = store.getMappedFactionSlots(symbol)
  }
  return result
}

/**
 * Tab switching and filtering methods
 */
function switchTab(tab) {
  activeTab.value = tab
  searchQuery.value = ""
  selectedType.value = "all"
}

function selectType(type) {
  selectedType.value = type
}

function clearFilters() {
  searchQuery.value = ""
  selectedType.value = "all"
}

/**
 * Card interaction methods
 */
function onRightClickCard(card, event) {
  if (activeTab.value !== "deck") return
  if (equippedCardIds.value.has(card.id)) return

  contextCard.value = card
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  showContextMenu.value = true
}

function giveCardToPilot(targetPilotId) {
  const currentPilot = store.currentPilot
  const targetPilot = store.pilots.find(p => p.id === targetPilotId)
  const cardId = contextCard.value?.id
  if (!cardId || !currentPilot || !targetPilot) return

  if (targetPilot.ownedCards.includes(cardId)) {
    const currentUpgradeLevel = currentPilot.cardUpgrades?.[cardId] || 0
    const targetUpgradeLevel = targetPilot.cardUpgrades?.[cardId] || 0

    if (currentUpgradeLevel === targetUpgradeLevel) {
      alert(`${targetPilot.name} already owns this card at the same upgrade level.`)
      showContextMenu.value = false
      contextCard.value = null
      return
    }

    pendingTransfer.value = {
      cardId,
      targetPilotId,
      currentPilot,
      targetPilot,
      cardName: contextCard.value.name,
      targetPilotName: targetPilot.name,
      yourUpgradeLevel: currentUpgradeLevel,
      targetUpgradeLevel: targetUpgradeLevel
    }

    setTimeout(() => {
      cardSwapModal.value?.open()
    }, 0)

    showContextMenu.value = false
    contextCard.value = null
    return
  }

  const index = currentPilot.ownedCards.indexOf(cardId)
  if (index !== -1) {
    currentPilot.ownedCards.splice(index, 1)

    const upgradeLevel = currentPilot.cardUpgrades?.[cardId] || 0
    if (upgradeLevel > 0) {
      if (!currentPilot.cardUpgrades) currentPilot.cardUpgrades = {}
      delete currentPilot.cardUpgrades[cardId]

      if (!targetPilot.cardUpgrades) targetPilot.cardUpgrades = {}
      targetPilot.cardUpgrades[cardId] = upgradeLevel
    }
  }

  if (!targetPilot.ownedCards.includes(cardId)) {
    targetPilot.ownedCards.push(cardId)
  }

  showContextMenu.value = false
  contextCard.value = null
}

/**
 * Global click handler for context menu
 */
document.addEventListener("click", () => {
  showContextMenu.value = false
})

/**
 * Drag and drop handlers
 */
function onDragStart(cardId, event) {
  if (activeTab.value !== "deck") {
    event.preventDefault()
    return
  }

  const draggedCard = store.ownedCards.find(c => c.id === cardId)
  currentlyDraggedCard.value = draggedCard

  event.dataTransfer.effectAllowed = "move"
  event.dataTransfer.setData("text/plain", cardId)
  
  const cardElement = event.target.closest('.card') || event.currentTarget
  if (cardElement) {
    event.dataTransfer.setDragImage(cardElement, cardElement.offsetWidth / 2, cardElement.offsetHeight / 2)
  }
}

function onDragEnd(event) {
  setTimeout(() => {
    currentlyDraggedCard.value = null
  }, 100)
}

/**
 * XP Modal methods
 */
function openModal() {
  addXpModal.value?.open()
}

function confirmAddXP(amount) {
  if (amount > 0) {
    store.currentPilot.xp += amount
  }
}

function closeAddXpModal() {
  // Modal component handles closing itself
}

/**
 * Card selection and interaction
 */
function select(card) {
  if (activeTab.value === "store") {
    const isOwned = store.isCardOwnedByCurrentPilot(card.id)
    const canUpgrade = store.canUpgradeCard(card.id)

    if (isOwned && !canUpgrade) {
      alert("You already own this card and cannot upgrade it further.")
      return
    }

    pendingCard.value = card
    cardPurchaseModal.value?.open()
  } else if (activeTab.value === "hand") {
    unequipCard(card.id)
  } else if (activeTab.value === "deck") {
    if (isMobile.value && !store.isCardTaken(card.id)) {
      if (!store.canEquipInitiativeCard(card.id)) {
        const warning = store.getInitiativeRequirementText(card.id)
        alert(`Cannot equip this card: ${warning}`)
        return
      }
      
      if (!store.canEquipFactionCard(card.id)) {
        const warning = store.getFactionRequirementText(card.id)
        alert(`Cannot equip this card: ${warning}`)
        return
      }
      
      showMobileCardSelection(card)
    }
  }
}

/**
 * Mobile card selection methods
 */
function showMobileCardSelection(card) {
  pendingMobileCard.value = card
  cardEquipModal.value?.open()
}

function cancelMobileCardSelection() {
  pendingMobileCard.value = null
}

function equipCardToSlot(slotKey) {
  if (!pendingMobileCard.value) return
  
  if (!store.canEquipInitiativeCard(pendingMobileCard.value.id)) {
    const warning = store.getInitiativeRequirementText(pendingMobileCard.value.id)
    alert(`Cannot equip this card: ${warning}`)
    pendingMobileCard.value = null
    return
  }
  
  if (store.requiresFactionSelection(pendingMobileCard.value.id)) {
    const availableFactions = store.getAvailableFactionsForCard(pendingMobileCard.value.id)
    if (availableFactions.length === 0) {
      alert("Cannot equip this card: No available faction slots.")
      pendingMobileCard.value = null
      return
    } else if (availableFactions.length === 1) {
      equipCardWithSpecificFaction(slotKey, availableFactions[0])
      return
    } else {
      pendingFactionCard.value = {
        name: pendingMobileCard.value.name,
        cardId: pendingMobileCard.value.id,
        factions: availableFactions,
        slotKey: slotKey
      }
      factionSelectionModal.value?.open()
      return
    }
  }
  
  if (!store.canEquipFactionCard(pendingMobileCard.value.id)) {
    const warning = store.getFactionRequirementText(pendingMobileCard.value.id)
    alert(`Cannot equip this card: ${warning}`)
    pendingMobileCard.value = null
    return
  }
  
  if (store.isMultiSlotCard(pendingMobileCard.value.id)) {
    const success = store.assignMultiSlotCard(pendingMobileCard.value.id)
    if (success !== false) {
      pendingMobileCard.value = null
      mobileActiveTab.value = 'loadout'
    } else {
      alert("Could not equip this multi-slot card. Make sure all required slots are available.")
    }
  } else {
    const success = store.assignCardToSlot(slotKey, pendingMobileCard.value.id)
    if (success !== false) {
      pendingMobileCard.value = null
      mobileActiveTab.value = 'loadout'
    } else {
      alert("Could not equip this card to the selected slot.")
    }
  }
}

function equipCardWithSpecificFaction(slotKey, faction) {
  if (!pendingMobileCard.value) return
  
  if (store.isMultiSlotCard(pendingMobileCard.value.id)) {
    const success = store.assignMultiSlotCard(pendingMobileCard.value.id)
    if (success !== false) {
      store.equipCardWithFaction(pendingMobileCard.value.id, faction)
      pendingMobileCard.value = null
      mobileActiveTab.value = 'loadout'
    } else {
      alert("Could not equip this multi-slot card. Make sure all required slots are available.")
    }
  } else {
    const success = store.assignCardToSlot(slotKey, pendingMobileCard.value.id)
    if (success !== false) {
      store.equipCardWithFaction(pendingMobileCard.value.id, faction)
      pendingMobileCard.value = null
      mobileActiveTab.value = 'loadout'
    } else {
      alert("Could not equip this card to the selected slot.")
    }
  }
}

function confirmFactionSelection(faction) {
  if (!pendingFactionCard.value) return
  
  equipCardWithSpecificFaction(pendingFactionCard.value.slotKey, faction)
  pendingFactionCard.value = null
}

function cancelFactionSelection() {
  pendingMobileCard.value = null
  pendingFactionCard.value = null
}

/**
 * Unequip card from hand tab
 */
function unequipCard(cardId) {
  const pilot = store.currentPilot
  if (!pilot?.slotCards) return

  const slotKey = Object.keys(pilot.slotCards).find(key => pilot.slotCards[key] === cardId)

  if (slotKey) {
    store.removeCardFromSlot(slotKey)
  }
}

/**
 * Card purchase methods
 */
function confirmCardPurchase() {
  if (!pendingCard.value) return

  const cardCost = pendingCard.value.cost || 0
  if (store.currentPilot.xp < cardCost) {
    alert("Not enough XP to buy this card.")
    return
  }

  const isOwned = store.isCardOwnedByCurrentPilot(pendingCard.value.id)

  if (isOwned) {
    const success = store.upgradeCard(pendingCard.value.id)
    if (!success) {
      alert("Cannot upgrade this card further.")
      return
    }
  } else {
    store.addCardToDeck(pendingCard.value.id)
  }

  store.currentPilot.xp -= cardCost
  pendingCard.value = null
}

function cancelCardPurchase() {
  pendingCard.value = null
}

/**
 * Card swap methods
 */
function confirmCardSwap() {
  if (!pendingTransfer.value) return

  const { cardId, currentPilot, targetPilot, yourUpgradeLevel, targetUpgradeLevel } = pendingTransfer.value

  if (!currentPilot.cardUpgrades) currentPilot.cardUpgrades = {}
  if (!targetPilot.cardUpgrades) targetPilot.cardUpgrades = {}

  currentPilot.cardUpgrades[cardId] = targetUpgradeLevel
  targetPilot.cardUpgrades[cardId] = yourUpgradeLevel

  pendingTransfer.value = null
}

function cancelCardSwap() {
  pendingTransfer.value = null
}
</script>
