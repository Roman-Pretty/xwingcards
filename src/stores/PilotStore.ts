import { defineStore } from "pinia";
import classData from "../data/classes.json";
import cards from "../data/cards.js";

export interface Pilot {
  id: string;
  name: string;
  class: string;
  rank: number;
  xp: number;
  ships: string[];
  selectedShip: string;
  slots: string[];
  slotCards: Record<string, string>;
  selectedCards: string[];
  ownedCards: string[];
  cardUpgrades?: Record<string, number>;
  unlockedSlots?: string[];
  usedFactionSlots?: Record<string, number>;
}

/**
 * Faction icon to faction name mapping
 */
const FACTION_MAPPINGS = {
  "@": "empire",
  "h": "force",
  "!": "resistance",
  "+": "firstorder",
  "#": "scum",
  "/": "republic",
  ".": "separatist"
} as const;

/**
 * Helper function to normalize faction names
 */
const normalizeFactionName = (faction: string): string => {
  const lower = faction.toLowerCase();
  if (lower === "first order") return "firstorder";
  if (lower === "separatists") return "separatist";
  return lower;
};

/**
 * Helper function to get faction limits from class data for all ranks up to current rank
 */
const getFactionLimits = (classInfo: any, maxRank: number): Record<string, number> => {
  const ranks = classInfo.ranks.filter(r => r.rank <= maxRank);
  const factionLimits: Record<string, number> = {};
  
  for (const r of ranks) {
    if (!r.faction) continue;
    for (const sym of r.faction) {
      const factionName = FACTION_MAPPINGS[sym];
      if (factionName) {
        factionLimits[factionName] = (factionLimits[factionName] || 0) + 1;
      }
    }
  }
  
  return factionLimits;
};

export const usePilotStore = defineStore("pilotStore", {
  state: () => ({
    pilots: [] as Pilot[],
    currentPilotId: "1",
    enableCustomCards: true,
    enableFactionFiltering: true,
    enableUniqueCardRestriction: true,
  }),

  getters: {
    /**
     * Gets the current active pilot and initializes faction slots if needed
     */
    currentPilot(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (pilot && !pilot.usedFactionSlots) {
        const store = this as any;
        pilot.usedFactionSlots = store.calculateUsedFactionSlots(pilot);
      }
      return pilot;
    },

    /**
     * Gets all cards owned by the current pilot
     */
    ownedCards(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return [];
      return cards.filter((card) => pilot.ownedCards.includes(card.id));
    },

    /**
     * Checks if a card is owned by the current pilot
     */
    isCardOwnedByCurrentPilot: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      return pilot ? pilot.ownedCards.includes(cardId) : false;
    },

    /**
     * Gets the upgrade level for a specific card
     */
    getCardUpgradeLevel: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      return pilot?.cardUpgrades?.[cardId] || 0;
    },

    /**
     * Checks if a card can be upgraded further
     */
    canUpgradeCard: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      
      if (!card || !pilot || !card.upgradeable || !card.energy) return false;
      
      const currentUpgradeLevel = pilot.cardUpgrades?.[cardId] || 0;
      const isOwned = pilot.ownedCards.includes(cardId);
      
      return isOwned && currentUpgradeLevel < card.energy;
    },

    /**
     * Gets display information for a card including upgrade modifications
     */
    getCardDisplayInfo: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      
      if (!card) return null;
      
      const upgradeLevel = pilot?.cardUpgrades?.[cardId] || 0;
      const displayEnergy = card.energy ? (card.energy + upgradeLevel) : card.energy;
      const displayName = upgradeLevel > 0 ? `${card.name} (Upgraded)` : card.name;
      
      return {
        ...card,
        displayName,
        displayEnergy,
        upgradeLevel
      };
    },

    /**
     * Checks if a card is currently taken/equipped by any pilot
     */
    isCardTaken: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return false;

      const isUnique = card.unique;
      const cardName = card.name;

      return state.pilots.some((p) => {
        const hasSameNamedCard = Object.values(p.slotCards).some(slotCardId => {
          const slotCard = cards.find(c => c.id === slotCardId);
          return slotCard?.name === cardName;
        }) || p.selectedCards.some(selectedCardId => {
          const selectedCard = cards.find(c => c.id === selectedCardId);
          return selectedCard?.name === cardName;
        });

        return ((isUnique && state.enableUniqueCardRestriction && hasSameNamedCard) ||
          (p.id === state.currentPilotId &&
            (p.selectedCards.includes(cardId) ||
              Object.values(p.slotCards).includes(cardId))));
      });
    },

    /**
     * Gets the count of used faction slots for a specific faction icon
     */
    getMappedFactionSlots: (state) => (factionIcon) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return {};
      const usedFactionSlots = pilot.usedFactionSlots || {};

      return usedFactionSlots[FACTION_MAPPINGS[factionIcon]] || 0;
    },

    /**
     * Checks if a faction card can be equipped based on faction limits
     */
    canEquipFactionCard: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction || card.faction.toLowerCase() === "neutral") return true;

      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const factionLimits = getFactionLimits(classInfo, pilot.rank);
      const cardFaction = normalizeFactionName(card.faction);
      const currentCount = pilot.usedFactionSlots?.[cardFaction] || 0;
      const maxCount = factionLimits[cardFaction] || 0;

      return currentCount < maxCount;
    },

    /**
     * Gets descriptive text for faction requirements and restrictions
     */
    getFactionRequirementText: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return null;

      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction || card.faction.toLowerCase() === "neutral") return null;

      const classInfo = classData[pilot.class];
      if (!classInfo) return null;

      const currentFactionLimits = getFactionLimits(classInfo, pilot.rank);
      const futureFactionLimits = getFactionLimits(classInfo, Math.max(...classInfo.ranks.map(r => r.rank)));
      const cardFaction = normalizeFactionName(card.faction);

      const currentCount = pilot.usedFactionSlots?.[cardFaction] || 0;
      const currentMaxCount = currentFactionLimits[cardFaction] || 0;
      const futureMaxCount = futureFactionLimits[cardFaction] || 0;

      if (futureMaxCount === 0) {
        return `Faction "${card.faction}" not available for this class`;
      }

      if (currentMaxCount === 0 && futureMaxCount > 0) {
        let earliestRank = null;
        for (const r of classInfo.ranks) {
          if (!r.faction) continue;
          for (const sym of r.faction) {
            if (FACTION_MAPPINGS[sym] === cardFaction) {
              if (earliestRank === null || r.rank < earliestRank) {
                earliestRank = r.rank;
              }
            }
          }
        }
        
        if (earliestRank !== null) {
          return `Faction "${card.faction}" unlocks at rank ${earliestRank} (currently rank ${pilot.rank})`;
        }
      }

      if (currentCount >= currentMaxCount) {
        return `Faction limit reached: ${currentCount}/${currentMaxCount} ${card.faction} cards equipped`;
      }

      return null;
    },

    /**
     * Gets the current pilot's initiative value
     */
    currentPilotInitiative(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return 0;

      const classInfo = classData[pilot.class];
      if (!classInfo) return 0;

      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      return rankData?.initiative || 0;
    },

    /**
     * Checks if a card can be equipped based on initiative requirements
     */
    canEquipInitiativeCard: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !card.initiative) return true;

      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return false;

      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      const pilotInitiative = rankData?.initiative || 0;

      return pilotInitiative >= card.initiative;
    },

    /**
     * Gets descriptive text for initiative requirements
     */
    getInitiativeRequirementText: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !card.initiative) return null;

      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return null;

      const classInfo = classData[pilot.class];
      if (!classInfo) return null;

      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      const pilotInitiative = rankData?.initiative || 0;

      if (pilotInitiative >= card.initiative) {
        return null;
      }

      return `Requires Initiative ${card.initiative} (you have ${pilotInitiative})`;
    },

    /**
     * Gets warning text for unique card restrictions
     */
    getUniqueCardWarningText: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.unique || !state.enableUniqueCardRestriction) return null;

      const currentPilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!currentPilot) return null;

      const otherPilotsWithSameCard = state.pilots
        .filter(p => p.id !== state.currentPilotId)
        .filter(p => {
          return p.ownedCards.some(ownedCardId => {
            const ownedCard = cards.find(c => c.id === ownedCardId);
            return ownedCard?.name === card.name;
          });
        });

      if (otherPilotsWithSameCard.length > 0) {
        const pilotNames = otherPilotsWithSameCard.map(p => p.name).join(', ');
        return `${pilotNames} already owns a unique card with this name. Only one of you will be able to equip it at a time.`;
      }

      return null;
    },
  },

  actions: {
    /**
     * Calculates how many faction slots are currently used by a pilot
     */
    calculateUsedFactionSlots(pilot: Pilot) {
      if (!pilot) return {};

      const factionCount: Record<string, number> = {};

      Object.values(pilot.slotCards).forEach((cardId) => {
        const card = cards.find((c) => c.id === cardId);
        const faction = card?.faction;
        if (faction && faction.toLowerCase() !== "neutral") {
          const normalizedFaction = normalizeFactionName(faction);
          factionCount[normalizedFaction] = (factionCount[normalizedFaction] || 0) + 1;
        }
      });

      return factionCount;
    },

    /**
     * Updates the used faction slots for the current pilot
     */
    updateUsedFactionSlots() {
      const pilot = this.currentPilot;
      if (!pilot) return;
      pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
    },

    /**
     * Switches to a different pilot and updates their slots
     */
    switchPilot(id: string) {
      if (this.currentPilotId === id) return;
      this.currentPilotId = id;
      this.updatePilotSlots();
      
      const pilot = this.currentPilot;
      if (pilot && !pilot.usedFactionSlots) {
        pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
      } else {
        this.updateUsedFactionSlots();
      }
    },

    /**
     * Unselects a card from the current pilot's selected cards
     */
    unselectCard(cardId: string) {
      const pilot = this.currentPilot;
      if (pilot) {
        pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);
        this.updateUsedFactionSlots();
      }
    },

    /**
     * Updates the current pilot's available slots based on class, rank, and ship
     */
    updatePilotSlots() {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const pilotClass = classData[pilot.class];
      if (!pilotClass) return;

      const shipEntry = pilotClass.ships.find(
        (s) => s.ship === pilot.selectedShip
      );

      const shipSlots = shipEntry?.slots ?? [];
      const rankData = pilotClass.ranks.find((r) => r.rank === pilot.rank);
      const rankSlots = rankData?.slots ?? [];
      const optionalSlots = rankData?.optionalslots ?? [];

      const allSlots = [...shipSlots, ...rankSlots, ...optionalSlots];

      pilot.slots.splice(0, pilot.slots.length, ...allSlots);

      if (!pilot.unlockedSlots) {
        pilot.unlockedSlots = [];
      }

      if (!pilot.usedFactionSlots) {
        pilot.usedFactionSlots = {};
      }
    },

    /**
     * Changes the current pilot's selected ship and updates slots
     */
    changeSelectedShip(shipName: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;
      if (!pilot.ships.includes(shipName)) return;

      pilot.selectedShip = shipName;
      this.updatePilotSlots();
      pilot.slotCards = {};
      this.updateUsedFactionSlots();
    },

    /**
     * Changes the option for a specific slot
     */
    changeSlotOption(slotKey: string, option: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: option,
      };

      this.updateUsedFactionSlots();
    },

    /**
     * Resets the current pilot's selected cards array
     */
    resetSelectedCards() {
      const pilot = this.currentPilot;
      if (!pilot) return;
      pilot.selectedCards = [];
    },

    /**
     * Assigns a card to a specific slot with validation checks
     */
    assignCardToSlot(slotKey: string, cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!cardId || cardId.trim() === '') {
        this.removeCardFromSlot(slotKey);
        return;
      }

      if (!this.canEquipFactionCard(cardId)) {
        return false;
      }

      if (!this.canEquipInitiativeCard(cardId)) {
        return false;
      }

      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);

      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: cardId,
      };

      const card = cards.find((c) => c.id === cardId) as any;
      if (card?.freeSlots?.length) {
        card.freeSlots.forEach((slot, index) => {
          const key = `free-${cardId}-${index}`;
          pilot.slots.push(key);
          if (!pilot.slotCards[key]) {
            pilot.slotCards[key] = null;
          }
        });
      }

      this.updateUsedFactionSlots();
    },

    /**
     * Removes a card from a specific slot and cleans up free slots
     */
    removeCardFromSlot(slotKey: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const cardId = pilot.slotCards[slotKey];
      const card = cards.find((c) => c.id === cardId) as any;

      const { [slotKey]: removed, ...rest } = pilot.slotCards;
      pilot.slotCards = rest;

      if (card?.freeSlots?.length) {
        card.freeSlots.forEach((slot, index) => {
          const freeKey = `free-${cardId}-${index}`;
          delete pilot.slotCards[freeKey];
          pilot.slots = pilot.slots.filter((s) => s !== freeKey);
        });
      }

      this.updateUsedFactionSlots();
    },

    /**
     * Adds a card to the current pilot's deck
     */
    addCardToDeck(cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!pilot.ownedCards.includes(cardId)) {
        pilot.ownedCards.push(cardId);
      }

      if (!pilot.cardUpgrades) {
        pilot.cardUpgrades = {};
      }
    },

    /**
     * Upgrades a card to the next level if possible
     */
    upgradeCard(cardId: string) {
      const pilot = this.currentPilot;
      const card = cards.find((c) => c.id === cardId);
      
      if (!pilot || !card || !this.canUpgradeCard(cardId)) return false;

      if (!pilot.cardUpgrades) {
        pilot.cardUpgrades = {};
      }

      pilot.cardUpgrades[cardId] = (pilot.cardUpgrades[cardId] || 0) + 1;
      
      return true;
    },

    /**
     * Deletes a pilot from the store
     */
    deletePilot(pilotId: string) {
      const pilotIndex = this.pilots.findIndex(p => p.id === pilotId);
      if (pilotIndex === -1) return false;

      this.pilots.splice(pilotIndex, 1);

      if (this.currentPilotId === pilotId) {
        if (this.pilots.length > 0) {
          this.currentPilotId = this.pilots[0].id;
        } else {
          this.currentPilotId = "1";
        }
      }

      return true;
    },

    /**
     * Updates a pilot's properties
     */
    updatePilot(pilotId: string, updates: Partial<Pilot>) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot) return false;

      Object.assign(pilot, updates);
      
      if (pilotId === this.currentPilotId) {
        this.updatePilotSlots();
        this.updateUsedFactionSlots();
      }

      return true;
    },

    /**
     * Removes a card from a specific pilot
     */
    removeCardFromPilot(pilotId: string, cardId: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot) return false;

      pilot.ownedCards = pilot.ownedCards.filter(id => id !== cardId);
      
      if (pilot.cardUpgrades?.[cardId]) {
        delete pilot.cardUpgrades[cardId];
      }
      
      Object.keys(pilot.slotCards).forEach(slotKey => {
        if (pilot.slotCards[slotKey] === cardId) {
          delete pilot.slotCards[slotKey];
        }
      });
      
      pilot.selectedCards = pilot.selectedCards.filter(id => id !== cardId);

      if (pilotId === this.currentPilotId) {
        this.updateUsedFactionSlots();
      }

      return true;
    },

    /**
     * Removes a ship from a specific pilot
     */
    removeShipFromPilot(pilotId: string, shipName: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot || pilot.ships.length <= 1) return false;

      pilot.ships = pilot.ships.filter(s => s !== shipName);
      
      if (pilot.selectedShip === shipName) {
        pilot.selectedShip = pilot.ships[0] || '';
        
        if (pilotId === this.currentPilotId) {
          this.updatePilotSlots();
          pilot.slotCards = {};
          this.updateUsedFactionSlots();
        }
      }

      return true;
    },

    /**
     * Downgrades a card by one level
     */
    downgradeCard(pilotId: string, cardId: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot || !pilot.cardUpgrades) return false;

      const currentLevel = pilot.cardUpgrades[cardId] || 0;
      if (currentLevel <= 0) return false;

      pilot.cardUpgrades[cardId] = currentLevel - 1;
      
      if (pilot.cardUpgrades[cardId] === 0) {
        delete pilot.cardUpgrades[cardId];
      }

      return true;
    },

    /**
     * Initializes faction slots for all pilots that don't have them
     */
    initializeFactionSlots() {
      this.pilots.forEach(pilot => {
        if (!pilot.usedFactionSlots) {
          pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
        }
      });
    },

    /**
     * Updates a specific setting value
     */
    updateSetting(key: 'enableCustomCards' | 'enableFactionFiltering' | 'enableUniqueCardRestriction', value: boolean) {
      this[key] = value;
    },
  },

  persist: {
    storage: localStorage,
  },
});
