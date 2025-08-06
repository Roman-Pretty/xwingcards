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
  cardUpgrades?: Record<string, number>; // Track upgrade levels for each card
  unlockedSlots?: string[];
  usedFactionSlots?: Record<string, number>; // ✅ Moved into Pilot
}

export const usePilotStore = defineStore("pilotStore", {
  state: () => ({
    pilots: [] as Pilot[],
    currentPilotId: "1",
  }),

  getters: {
    currentPilot(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      // Initialize faction slots if they don't exist
      if (pilot && !pilot.usedFactionSlots) {
        const store = this as any; // Access store methods
        pilot.usedFactionSlots = store.calculateUsedFactionSlots(pilot);
      }
      return pilot;
    },

    ownedCards(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return [];
      return cards.filter((card) => pilot.ownedCards.includes(card.id));
    },

    isCardOwnedByCurrentPilot: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      return pilot ? pilot.ownedCards.includes(cardId) : false;
    },

    getCardUpgradeLevel: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      return pilot?.cardUpgrades?.[cardId] || 0;
    },

    canUpgradeCard: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      
      if (!card || !pilot || !card.upgradeable || !card.energy) return false;
      
      const currentUpgradeLevel = pilot.cardUpgrades?.[cardId] || 0;
      const isOwned = pilot.ownedCards.includes(cardId);
      
      return isOwned && currentUpgradeLevel < card.energy;
    },

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

    isCardTaken: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return false;

      const isUnique = card.unique;
      const cardName = card.name;

      return state.pilots.some((p) => {
        // Check if this pilot has any card with the same name (if unique)
        const hasSameNamedCard = Object.values(p.slotCards).some(slotCardId => {
          const slotCard = cards.find(c => c.id === slotCardId);
          return slotCard?.name === cardName;
        }) || p.selectedCards.some(selectedCardId => {
          const selectedCard = cards.find(c => c.id === selectedCardId);
          return selectedCard?.name === cardName;
        });

        // For unique cards, check if any pilot has a card with the same name
        // For current pilot, check if they already have this card (by ID)
        return (isUnique && hasSameNamedCard) ||
          (p.id === state.currentPilotId &&
            (p.selectedCards.includes(cardId) ||
              Object.values(p.slotCards).includes(cardId)));
      });
    },

    getMappedFactionSlots: (state) => (factionIcon) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return {};
      const usedFactionSlots = pilot.usedFactionSlots || {};

      const mappings = {
        "@": "empire",
        "h": "force",
        "!": "resistance",
        "+": "firstorder",
        "#": "scum",
        "/": "republic",
        ".": "separatists"
      };

      return usedFactionSlots[mappings[factionIcon]] || 0;
    },

    canEquipFactionCard: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction || card.faction.toLowerCase() === "neutral") return true;

      // Get faction limits from class data
      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const ranks = classInfo.ranks.filter(r => r.rank <= pilot.rank);
      const factionLimits: Record<string, number> = {};
      
      for (const r of ranks) {
        if (!r.faction) continue;
        for (const sym of r.faction) {
          const mappings = {
            "@": "empire",
            "h": "force",
            "!": "resistance",
            "+": "firstorder",
            "#": "scum",
            "/": "republic",
            ".": "separatists"
          };
          const factionName = mappings[sym];
          if (factionName) {
            factionLimits[factionName] = (factionLimits[factionName] || 0) + 1;
          }
        }
      }

      // Normalize card faction name to match our mapping system
      let cardFaction = card.faction.toLowerCase();
      if (cardFaction === "first order") {
        cardFaction = "firstorder";
      } else if (cardFaction === "separatist") {
        cardFaction = "separatists";
      }

      const currentCount = pilot.usedFactionSlots?.[cardFaction] || 0;
      const maxCount = factionLimits[cardFaction] || 0;

      return currentCount < maxCount;
    },

    currentPilotInitiative(state) {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return 0;

      const classInfo = classData[pilot.class];
      if (!classInfo) return 0;

      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      return rankData?.initiative || 0;
    },

    canEquipInitiativeCard: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !card.initiative) return true; // No initiative requirement

      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return false;

      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      const pilotInitiative = rankData?.initiative || 0;

      return pilotInitiative >= card.initiative;
    },

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
        return null; // Can equip, no warning needed
      }

      return `Requires Initiative ${card.initiative} (you have ${pilotInitiative})`;
    },
  },

  actions: {
    calculateUsedFactionSlots(pilot: Pilot) {
      if (!pilot) return {};

      const factionCount: Record<string, number> = {};

      Object.values(pilot.slotCards).forEach((cardId) => {
        const card = cards.find((c) => c.id === cardId);
        const faction = card?.faction;
        if (faction && faction.toLowerCase() !== "neutral") {
          // Normalize faction names to match our mapping system
          let normalizedFaction = faction.toLowerCase();
          
          // Handle variations in faction names
          if (normalizedFaction === "first order") {
            normalizedFaction = "firstorder";
          } else if (normalizedFaction === "separatist") {
            normalizedFaction = "separatists";
          }
          
          factionCount[normalizedFaction] = (factionCount[normalizedFaction] || 0) + 1;
        }
      });

      return factionCount;
    },

    updateUsedFactionSlots() {
      const pilot = this.currentPilot;
      if (!pilot) return;
      pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
    },

    switchPilot(id: string) {
      if (this.currentPilotId === id) return;
      this.currentPilotId = id;
      this.updatePilotSlots();
      
      // Ensure faction slots are initialized for the current pilot
      const pilot = this.currentPilot;
      if (pilot && !pilot.usedFactionSlots) {
        pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
      } else {
        this.updateUsedFactionSlots();
      }
    },

    unselectCard(cardId: string) {
      const pilot = this.currentPilot;
      if (pilot) {
        pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);
        this.updateUsedFactionSlots();
      }
    },

    updatePilotSlots() {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const pilotClass = classData[pilot.class];
      if (!pilotClass) return;

      const shipEntry = pilotClass.ships.find(
        (s) => s.ship === pilot.selectedShip
      );

      const shipSlots = shipEntry?.slots ?? [];
      const lockedSlots = shipEntry?.lockedSlots ?? [];

      const rankData = pilotClass.ranks.find((r) => r.rank === pilot.rank);
      const rankSlots = rankData?.slots ?? [];
      const optionalSlots = rankData?.optionalslots ?? [];

      const allSlots = [...shipSlots, ...rankSlots, ...optionalSlots];

      pilot.slots.splice(0, pilot.slots.length, ...allSlots);

      if (!pilot.unlockedSlots) {
        pilot.unlockedSlots = [];
      }

      // Initialize usedFactionSlots if missing
      if (!pilot.usedFactionSlots) {
        pilot.usedFactionSlots = {};
      }
    },

    changeSelectedShip(shipName: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;
      if (!pilot.ships.includes(shipName)) return;

      pilot.selectedShip = shipName;
      this.updatePilotSlots();
      pilot.slotCards = {};
      this.updateUsedFactionSlots();
    },

    changeSlotOption(slotKey: string, option: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: option,
      };

      this.updateUsedFactionSlots();
    },

    resetSelectedCards() {
      const pilot = this.currentPilot;
      if (!pilot) return;
      pilot.selectedCards = [];
    },

    assignCardToSlot(slotKey: string, cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!cardId || cardId.trim() === '') {
        this.removeCardFromSlot(slotKey);
        return;
      }

      // Check faction limits before assigning
      if (!this.canEquipFactionCard(cardId)) {
        return false; // Cannot equip due to faction limits
      }

      // Check initiative requirements before assigning
      if (!this.canEquipInitiativeCard(cardId)) {
        return false; // Cannot equip due to initiative requirements
      }

      // Unselect the card from deck
      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);

      // Assign to slot
      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: cardId,
      };

      const card = cards.find((c) => c.id === cardId) as any;
      if (card?.freeSlots?.length) {
        // Add free slots to pilot
        card.freeSlots.forEach((slot, index) => {
          const key = `free-${cardId}-${index}`;
          pilot.slots.push(key); // Logical representation
          // Ensure no preexisting assignment
          if (!pilot.slotCards[key]) {
            pilot.slotCards[key] = null;
          }
        });
      }

      this.updateUsedFactionSlots();
    },


    removeCardFromSlot(slotKey: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const cardId = pilot.slotCards[slotKey];
      const card = cards.find((c) => c.id === cardId) as any;

      // Remove card from slot
      const { [slotKey]: removed, ...rest } = pilot.slotCards;
      pilot.slotCards = rest;

      // Remove free slots and unequip their cards
      if (card?.freeSlots?.length) {
        card.freeSlots.forEach((slot, index) => {
          const freeKey = `free-${cardId}-${index}`;
          delete pilot.slotCards[freeKey];
          pilot.slots = pilot.slots.filter((s) => s !== freeKey);
        });
      }

      this.updateUsedFactionSlots();
    },


    addCardToDeck(cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!pilot.ownedCards.includes(cardId)) {
        pilot.ownedCards.push(cardId);
      }

      // Initialize cardUpgrades if it doesn't exist
      if (!pilot.cardUpgrades) {
        pilot.cardUpgrades = {};
      }
    },

    upgradeCard(cardId: string) {
      const pilot = this.currentPilot;
      const card = cards.find((c) => c.id === cardId);
      
      if (!pilot || !card || !this.canUpgradeCard(cardId)) return false;

      // Initialize cardUpgrades if it doesn't exist
      if (!pilot.cardUpgrades) {
        pilot.cardUpgrades = {};
      }

      // Increment upgrade level
      pilot.cardUpgrades[cardId] = (pilot.cardUpgrades[cardId] || 0) + 1;
      
      return true;
    },

    // Settings-related actions
    deletePilot(pilotId: string) {
      const pilotIndex = this.pilots.findIndex(p => p.id === pilotId);
      if (pilotIndex === -1) return false;

      this.pilots.splice(pilotIndex, 1);

      // If we deleted the current pilot, switch to another one
      if (this.currentPilotId === pilotId) {
        if (this.pilots.length > 0) {
          this.currentPilotId = this.pilots[0].id;
        } else {
          this.currentPilotId = "1";
        }
      }

      return true;
    },

    updatePilot(pilotId: string, updates: Partial<Pilot>) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot) return false;

      Object.assign(pilot, updates);
      
      // If we updated the current pilot, refresh slots
      if (pilotId === this.currentPilotId) {
        this.updatePilotSlots();
        this.updateUsedFactionSlots();
      }

      return true;
    },

    removeCardFromPilot(pilotId: string, cardId: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot) return false;

      // Remove from owned cards
      pilot.ownedCards = pilot.ownedCards.filter(id => id !== cardId);
      
      // Remove upgrade data
      if (pilot.cardUpgrades?.[cardId]) {
        delete pilot.cardUpgrades[cardId];
      }
      
      // Remove from slot cards if equipped
      Object.keys(pilot.slotCards).forEach(slotKey => {
        if (pilot.slotCards[slotKey] === cardId) {
          delete pilot.slotCards[slotKey];
        }
      });
      
      // Remove from selected cards if present
      pilot.selectedCards = pilot.selectedCards.filter(id => id !== cardId);

      // If this is the current pilot, update faction slots
      if (pilotId === this.currentPilotId) {
        this.updateUsedFactionSlots();
      }

      return true;
    },

    removeShipFromPilot(pilotId: string, shipName: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot || pilot.ships.length <= 1) return false; // Don't allow removing the last ship

      pilot.ships = pilot.ships.filter(s => s !== shipName);
      
      // If the removed ship was the selected ship, select the first remaining ship
      if (pilot.selectedShip === shipName) {
        pilot.selectedShip = pilot.ships[0] || '';
        
        // If this is the current pilot, update slots and clear slot cards
        if (pilotId === this.currentPilotId) {
          this.updatePilotSlots();
          pilot.slotCards = {};
          this.updateUsedFactionSlots();
        }
      }

      return true;
    },

    downgradeCard(pilotId: string, cardId: string) {
      const pilot = this.pilots.find(p => p.id === pilotId);
      if (!pilot || !pilot.cardUpgrades) return false;

      const currentLevel = pilot.cardUpgrades[cardId] || 0;
      if (currentLevel <= 0) return false;

      pilot.cardUpgrades[cardId] = currentLevel - 1;
      
      // If downgraded to 0, remove the upgrade entry
      if (pilot.cardUpgrades[cardId] === 0) {
        delete pilot.cardUpgrades[cardId];
      }

      return true;
    },

    initializeFactionSlots() {
      // Initialize faction slots for all pilots that don't have them
      this.pilots.forEach(pilot => {
        if (!pilot.usedFactionSlots) {
          pilot.usedFactionSlots = this.calculateUsedFactionSlots(pilot);
        }
      });
    },
  },

  persist: {
    storage: localStorage,
  },
});
