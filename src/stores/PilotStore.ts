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
  cardFactionMappings?: Record<string, string>; // maps cardId to faction it was equipped as
  shipKills?: Record<string, number>; // tracks kills per ship type (by ship icon)
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
      if (!cardId || cardId === null || cardId === undefined) return null;
      
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
    canEquipFactionCard: (state) => (cardId, specificFaction = null) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction) return true;

      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const factionLimits = getFactionLimits(classInfo, pilot.rank);
      
      // Handle array of factions
      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
      
      // If neutral is one of the factions, it's always allowed
      if (cardFactions.some(f => f.toLowerCase() === "neutral")) return true;
      
      // If a specific faction is specified, check only that one
      if (specificFaction) {
        const normalizedFaction = normalizeFactionName(specificFaction);
        const currentCount = pilot.usedFactionSlots?.[normalizedFaction] || 0;
        const maxCount = factionLimits[normalizedFaction] || 0;
        return currentCount < maxCount;
      }
      
      // Otherwise, check if any faction can be equipped
      return cardFactions.some(faction => {
        const normalizedFaction = normalizeFactionName(faction);
        const currentCount = pilot.usedFactionSlots?.[normalizedFaction] || 0;
        const maxCount = factionLimits[normalizedFaction] || 0;
        return currentCount < maxCount;
      });
    },

    /**
     * Gets descriptive text for faction requirements and restrictions
     */
    getFactionRequirementText: (state) => (cardId) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return null;

      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction) return null;

      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
      
      // If neutral is one of the factions, no restrictions
      if (cardFactions.some(f => f.toLowerCase() === "neutral")) return null;

      const classInfo = classData[pilot.class];
      if (!classInfo) return null;

      const currentFactionLimits = getFactionLimits(classInfo, pilot.rank);
      const futureFactionLimits = getFactionLimits(classInfo, Math.max(...classInfo.ranks.map(r => r.rank)));
      
      // Check the first faction for error message purposes
      const cardFaction = normalizeFactionName(cardFactions[0]);

      const currentCount = pilot.usedFactionSlots?.[cardFaction] || 0;
      const currentMaxCount = currentFactionLimits[cardFaction] || 0;
      const futureMaxCount = futureFactionLimits[cardFaction] || 0;

      if (futureMaxCount === 0) {
        return `Faction "${cardFactions[0]}" not available for this class`;
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
          return `Faction "${cardFactions[0]}" unlocks at rank ${earliestRank} (currently rank ${pilot.rank})`;
        }
      }

      if (currentCount >= currentMaxCount) {
        return `Faction limit reached: ${currentCount}/${currentMaxCount} ${cardFactions[0]} cards equipped`;
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

    /**
     * Gets available factions for a card that can be equipped
     */
    getAvailableFactionsForCard: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction) return [];

      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
      
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return [];

      const classInfo = classData[pilot.class];
      if (!classInfo) return [];

      const factionLimits = getFactionLimits(classInfo, pilot.rank);
      
      return cardFactions.filter(faction => {
        if (faction.toLowerCase() === "neutral") return true;
        
        const normalizedFaction = normalizeFactionName(faction);
        const currentCount = pilot.usedFactionSlots?.[normalizedFaction] || 0;
        const maxCount = factionLimits[normalizedFaction] || 0;
        return currentCount < maxCount;
      });
    },

    /**
     * Checks if a card requires faction selection (has multiple non-neutral factions)
     */
    requiresFactionSelection: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.faction) return false;

      const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
      const nonNeutralFactions = cardFactions.filter(f => f.toLowerCase() !== "neutral");
      
      return nonNeutralFactions.length > 1;
    },

    /**
     * Gets the maximum faction slots available for a faction
     */
    getMaxFactionSlots: (state) => (faction) => {
      const pilot = state.pilots.find((p) => p.id === state.currentPilotId);
      if (!pilot) return 0;

      const classInfo = classData[pilot.class];
      if (!classInfo) return 0;

      const factionLimits = getFactionLimits(classInfo, pilot.rank);
      const normalizedFaction = normalizeFactionName(faction);
      
      return factionLimits[normalizedFaction] || 0;
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
        if (!card || !card.faction) return;

        // Check if we have a stored faction mapping for this card
        let equippedFaction: string;
        if (pilot.cardFactionMappings?.[cardId]) {
          equippedFaction = pilot.cardFactionMappings[cardId];
        } else {
          // Fallback to first faction for legacy cards
          const cardFactions = Array.isArray(card.faction) ? card.faction : [card.faction];
          const nonNeutralFaction = cardFactions.find(f => f.toLowerCase() !== "neutral");
          if (!nonNeutralFaction) return;
          equippedFaction = nonNeutralFaction;
        }

        if (equippedFaction.toLowerCase() !== "neutral") {
          const normalizedFaction = normalizeFactionName(equippedFaction);
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
     * Checks if a card occupies multiple slot types
     */
    isMultiSlotCard(cardId: string) {
      const card = cards.find((c) => c.id === cardId) as any;
      return card && Array.isArray(card.type) && card.type.length > 1;
    },

    /**
     * Gets all slot keys occupied by a multi-slot card
     */
    getOccupiedSlotKeys(cardId: string): string[] {
      const pilot = this.currentPilot;
      if (!pilot) return [];
      
      const occupiedKeys: string[] = [];
      for (const [slotKey, occupiedCardId] of Object.entries(pilot.slotCards)) {
        if (occupiedCardId === cardId) {
          occupiedKeys.push(slotKey);
        }
      }
      return occupiedKeys;
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
     * Gets all possible slot combinations for a multi-slot card
     */
    getMultiSlotCombinations(cardId: string, targetSlot?: string): { combination: string[], slotKeys: string[] }[] {
      const pilot = this.currentPilot;
      if (!pilot) return [];

      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !Array.isArray(card.type) || card.type.length === 0) return [];

      // Get class and ship data
      const classInfo = classData[pilot.class];
      if (!classInfo) return [];

      const shipEntry = classInfo.ships.find(s => s.ship === pilot.selectedShip);
      const shipSlots = shipEntry?.slots || [];
      
      // Get cumulative rank slots (all ranks up to current rank, matching UI logic)
      const unlockedRanks = classInfo.ranks.filter(r => r.rank <= pilot.rank);
      const rankSlots: string[] = [];
      const optionalSlots: any[] = [];
      
      unlockedRanks.forEach(r => {
        if (r.slots) rankSlots.push(...r.slots);
        if (r.optionalslots) {
          if (Array.isArray(r.optionalslots[0])) {
            optionalSlots.push(...r.optionalslots);
          } else {
            optionalSlots.push(r.optionalslots);
          }
        }
      });

      // Add ship's optional slots
      const shipOptionalSlots = shipEntry?.optionalSlots || [];
      if (shipOptionalSlots.length > 0) {
        optionalSlots.push(...shipOptionalSlots);
      }

      // Create a map of slot types for available slots
      const slotsByType = new Map();
      
      // Add fixed slots
      const allFixedSlots = [...shipSlots, ...rankSlots];
      
      allFixedSlots.forEach((slotType, index) => {
        const slotKey = `fixed-${index}`;
        
        if (pilot.slotCards[slotKey]) return; // Skip occupied slots
        
        // Convert slot letter to type name
        const typeName = this.getTypeNameFromLetter(slotType);
        
        if (typeName) {
          // Convert to proper case to match card.type format
          const properCaseTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
          
          if (!slotsByType.has(properCaseTypeName)) {
            slotsByType.set(properCaseTypeName, []);
          }
          slotsByType.get(properCaseTypeName).push(slotKey);
          
          // If it's an "Any" slot, add it to all possible types
          if (slotType === ')') {
            for (const cardType of card.type) {
              if (!slotsByType.has(cardType)) {
                slotsByType.set(cardType, []);
              }
              if (!slotsByType.get(cardType).includes(slotKey)) {
                slotsByType.get(cardType).push(slotKey);
              }
            }
          }
        }
      });

      // Add locked slots
      const lockedSlots = shipEntry?.lockedSlots || [];
      lockedSlots.forEach((lockedSlot, index) => {
        const slotKey = `${pilot.selectedShip}-${index}`;
        if (pilot.slotCards[slotKey]) return; // Skip occupied slots
        
        const typeName = this.getTypeNameFromLetter(lockedSlot.slot);
        if (typeName) {
          // Convert to proper case to match card.type format
          const properCaseTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
          
          if (!slotsByType.has(properCaseTypeName)) {
            slotsByType.set(properCaseTypeName, []);
          }
          slotsByType.get(properCaseTypeName).push(slotKey);
          
          // If it's an "Any" slot, add it to all possible types
          if (lockedSlot.slot === ')') {
            for (const cardType of card.type) {
              if (!slotsByType.has(cardType)) {
                slotsByType.set(cardType, []);
              }
              if (!slotsByType.get(cardType).includes(slotKey)) {
                slotsByType.get(cardType).push(slotKey);
              }
            }
          }
        }
      });

      // Add optional slots
      optionalSlots.forEach((slotGroup, index) => {
        const slotKey = `optional-${index}`;
        if (pilot.slotCards[slotKey]) return; // Skip occupied slots
        
        const slotTypes = Array.isArray(slotGroup) ? slotGroup : [slotGroup];
        for (const slotType of slotTypes) {
          const typeName = this.getTypeNameFromLetter(slotType);
          if (typeName) {
            // Convert to proper case to match card.type format
            const properCaseTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            
            if (!slotsByType.has(properCaseTypeName)) {
              slotsByType.set(properCaseTypeName, []);
            }
            slotsByType.get(properCaseTypeName).push(slotKey);
          }
        }
      });

      if (targetSlot) {
        // Check if target slot can accept any of the card types
        let acceptedType = null;
        
        for (const cardType of card.type) {
          const slotLetter = this.getSlotLetterForType(cardType);
          
          if (this.canSlotAcceptType(targetSlot, slotLetter)) {
            acceptedType = cardType;
            break;
          }
        }
        
        if (!acceptedType) {
          return [];
        }

        // Generate combinations that include the target slot
        const combinations: { combination: string[], slotKeys: string[] }[] = [];
        
        // Count how many slots of each type we need
        const typeCounts = new Map();
        for (const type of card.type) {
          typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        }

        // Generate all possible combinations
        const generateCombinations = (types: string[]): string[][] => {
          if (types.length === 0) return [[]];
          
          const [firstType, ...restTypes] = types;
          const availableSlots = slotsByType.get(firstType) || [];
          const restCombinations = generateCombinations(restTypes);
          
          const results: string[][] = [];
          for (const slot of availableSlots) {
            for (const restCombo of restCombinations) {
              if (!restCombo.includes(slot)) {
                results.push([slot, ...restCombo]);
              }
            }
          }
          
          return results;
        };

        const allCombinations = generateCombinations(card.type);
        
        // Filter combinations that include the target slot
        const filteredCombinations = allCombinations.filter(combo => combo.includes(targetSlot));
        
        // Deduplicate combinations by sorting slot keys to remove order variations
        const seenCombinations = new Set<string>();
        
        for (const slotKeys of filteredCombinations) {
          const sortedSlotKeys = [...slotKeys].sort();
          const combinationKey = sortedSlotKeys.join('|');
          
          if (!seenCombinations.has(combinationKey)) {
            seenCombinations.add(combinationKey);
            combinations.push({
              combination: card.type,
              slotKeys: sortedSlotKeys
            });
          }
        }

        return combinations;
      }

      // No target slot specified, return all possible combinations
      const combinations: { combination: string[], slotKeys: string[] }[] = [];
      
      // Count required slots by type 
      const typeCounts = new Map();
      for (const type of card.type) {
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
      }

      // Generate combinations for each required type
      const generateCombinations = (types: string[]): string[][] => {
        if (types.length === 0) return [[]];
        
        const [firstType, ...restTypes] = types;
        const availableSlots = slotsByType.get(firstType) || [];
        const restCombinations = generateCombinations(restTypes);
        
        const results: string[][] = [];
        for (const slot of availableSlots) {
          for (const restCombo of restCombinations) {
            if (!restCombo.includes(slot)) {
              results.push([slot, ...restCombo]);
            }
          }
        }
        
        return results;
      };

      const allCombinations = generateCombinations(card.type);
      
      // Deduplicate combinations by sorting slot keys to remove order variations
      const seenCombinations = new Set<string>();
      
      for (const slotKeys of allCombinations) {
        const sortedSlotKeys = [...slotKeys].sort();
        const combinationKey = sortedSlotKeys.join('|');
        
        if (!seenCombinations.has(combinationKey)) {
          seenCombinations.add(combinationKey);
          combinations.push({
            combination: card.type,
            slotKeys: sortedSlotKeys
          });
        }
      }

      return combinations;
    },

    /**
     * Helper method to get slot letter for a card type
     */
    getSlotLetterForType(cardType: string): string | null {
      const typeMapping = {
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
      
      return typeMapping[cardType.toLowerCase()] || null;
    },

    /**
     * Helper method to get type name from slot letter
     */
    getTypeNameFromLetter(slotLetter: string): string | null {
      const letterMapping = {
        'x': 'ace',
        'E': 'talent',
        'A': 'astromech',
        'm': 'modification',
        'M': 'missile',
        't': 'title',
        'P': 'torpedo',
        'C': 'cannon',
        'W': 'crew',
        'F': 'force',
        'I': 'illicit',
        'X': 'tech',
        'Î': 'sensitive',
        'Z': 'tactical',
        'U': 'turret',
        'B': 'payload',
        'S': 'sensor',
        'n': 'configuration',
        ')': 'any'  // Special "Any" slot type
      };
      
      return letterMapping[slotLetter] || null;
    },

    /**
     * Helper method to check if a slot can accept a specific type letter
     */
    canSlotAcceptType(slotKey: string, typeLetter: string): boolean {
      const pilot = this.currentPilot;
      if (!pilot) return false;

      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const shipEntry = classInfo.ships.find(s => s.ship === pilot.selectedShip);
      const shipSlots = shipEntry?.slots || [];
      
      // Get cumulative rank slots (all ranks up to current rank, matching UI logic)
      const unlockedRanks = classInfo.ranks.filter(r => r.rank <= pilot.rank);
      const rankSlots: string[] = [];
      const optionalSlots: any[] = [];
      
      unlockedRanks.forEach(r => {
        if (r.slots) rankSlots.push(...r.slots);
        if (r.optionalslots) {
          if (Array.isArray(r.optionalslots[0])) {
            optionalSlots.push(...r.optionalslots);
          } else {
            optionalSlots.push(r.optionalslots);
          }
        }
      });

      // Add ship's optional slots
      const shipOptionalSlots = shipEntry?.optionalSlots || [];
      if (shipOptionalSlots.length > 0) {
        optionalSlots.push(...shipOptionalSlots);
      }

      // Check if this is a locked slot (uses ship-index format)
      if (slotKey.includes('-') && !slotKey.startsWith('fixed-') && !slotKey.startsWith('optional-')) {
        // For locked slots, we need to check if the slot type matches
        const lockedSlots = shipEntry?.lockedSlots || [];
        
        const [shipName, indexStr] = slotKey.split('-');
        const index = parseInt(indexStr);
        
        if (lockedSlots[index]) {
          const lockedSlotType = lockedSlots[index].slot;
          
          // "Any" slot type (')') accepts all card types
          if (lockedSlotType === ')') {
            return true;
          }
          
          return lockedSlotType === typeLetter;
        }
        return false;
      }

      // Check fixed slots
      if (slotKey.startsWith('fixed-')) {
        const index = parseInt(slotKey.split('-')[1]);
        const allFixedSlots = [...shipSlots, ...rankSlots];
        
        // Check if index is out of bounds
        if (index >= allFixedSlots.length) {
          return false;
        }
        
        const slotType = allFixedSlots[index];
        // "Any" slot type (')') accepts all card types
        if (slotType === ')') {
          return true;
        }
        
        return slotType === typeLetter;
      }

      // Check optional slots
      if (slotKey.startsWith('optional-')) {
        const index = parseInt(slotKey.split('-')[1]);
        if (Array.isArray(optionalSlots) && optionalSlots[index]) {
          const slotGroup = optionalSlots[index];
          if (Array.isArray(slotGroup)) {
            // Check if the slot group includes the type letter or "Any" slot
            return slotGroup.includes(typeLetter) || slotGroup.includes(')');
          } else {
            // Single slot type - check direct match or "Any" slot
            return slotGroup === typeLetter || slotGroup === ')';
          }
        }
      }

      return false;
    },

    /**
     * Assigns a multi-slot card using specific slot keys
     */
    assignMultiSlotCardToSlots(cardId: string, slotKeys: string[]) {
      const pilot = this.currentPilot;
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !Array.isArray(card.type) || card.type.length === 0) return false;

      if (!this.canEquipFactionCard(cardId)) {
        return false;
      }

      if (!this.canEquipInitiativeCard(cardId)) {
        return false;
      }

      // Check all slots are available
      for (const slotKey of slotKeys) {
        if (pilot.slotCards[slotKey]) {
          return false;
        }
      }

      // Remove from selected cards and assign to all specified slots
      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);

      slotKeys.forEach(slotKey => {
        pilot.slotCards = {
          ...pilot.slotCards,
          [slotKey]: cardId,
        };
      });

      // Handle free slots if any
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
      return true;
    },

    /**
     * Assigns a multi-slot card to multiple appropriate slots
     */
    assignMultiSlotCard(cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId) as any;
      if (!card || !Array.isArray(card.type) || card.type.length === 0) return false;

      if (!this.canEquipFactionCard(cardId)) {
        return false;
      }

      if (!this.canEquipInitiativeCard(cardId)) {
        return false;
      }

      // Get class and ship data
      const classInfo = classData[pilot.class];
      if (!classInfo) return false;

      const shipEntry = classInfo.ships.find(s => s.ship === pilot.selectedShip);
      const shipSlots = shipEntry?.slots || [];
      
      const rankData = classInfo.ranks.find(r => r.rank === pilot.rank);
      const rankSlots = rankData?.slots || [];
      const optionalSlots = rankData?.optionalslots || [];

      // Combine all available slots
      const allFixedSlots = [...shipSlots, ...rankSlots];

      // Find available slots for each type the card can occupy
      const slotsToAssign: string[] = [];
      const slotsAssignedByType = new Map<string, number>(); // Track how many slots assigned per type

      // Check each card type
      for (const cardType of card.type) {
        if (!cardType || typeof cardType !== 'string') continue;
        const slotLetter = this.getSlotLetterForType(cardType);
        if (!slotLetter) continue;

        // Find an available slot of this type
        let slotAssigned = false;

        // Check fixed slots first
        for (let i = 0; i < allFixedSlots.length && !slotAssigned; i++) {
          const slot = allFixedSlots[i];
          const slotKey = `fixed-${i}`;
          
          if ((slot === slotLetter || slot === ')') && !pilot.slotCards[slotKey]) {
            slotsToAssign.push(slotKey);
            slotsAssignedByType.set(slotLetter, (slotsAssignedByType.get(slotLetter) || 0) + 1);
            slotAssigned = true;
          }
        }

        // Check optional slots if no fixed slot found
        if (!slotAssigned && Array.isArray(optionalSlots)) {
          for (let groupIndex = 0; groupIndex < optionalSlots.length && !slotAssigned; groupIndex++) {
            const slotGroup = optionalSlots[groupIndex];
            const slotKey = `optional-${groupIndex}`;
            
            if (Array.isArray(slotGroup)) {
              if ((slotGroup.includes(slotLetter) || slotGroup.includes(')')) && !pilot.slotCards[slotKey]) {
                slotsToAssign.push(slotKey);
                slotsAssignedByType.set(slotLetter, (slotsAssignedByType.get(slotLetter) || 0) + 1);
                slotAssigned = true;
              }
            } else if ((slotGroup === slotLetter || slotGroup === ')') && !pilot.slotCards[slotKey]) {
              slotsToAssign.push(slotKey);
              slotsAssignedByType.set(slotLetter, (slotsAssignedByType.get(slotLetter) || 0) + 1);
              slotAssigned = true;
            }
          }
        }

        // Check locked slots if no other slot found
        if (!slotAssigned) {
          const lockedSlots = shipEntry?.lockedSlots || [];
          for (let i = 0; i < lockedSlots.length && !slotAssigned; i++) {
            const lockedSlot = lockedSlots[i];
            const slotKey = `${pilot.selectedShip}-${i}`;
            
            if ((lockedSlot.slot === slotLetter || lockedSlot.slot === ')') && !pilot.slotCards[slotKey]) {
              slotsToAssign.push(slotKey);
              slotsAssignedByType.set(slotLetter, (slotsAssignedByType.get(slotLetter) || 0) + 1);
              slotAssigned = true;
            }
          }
        }
      }

      // Only proceed if we can assign ALL required types
      if (slotsToAssign.length !== card.type.length) {
        return false;
      }

      // Remove from selected cards and assign to all found slots
      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);

      slotsToAssign.forEach(slotKey => {
        pilot.slotCards = {
          ...pilot.slotCards,
          [slotKey]: cardId,
        };
      });

      // Handle free slots if any
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
      return true;
    },

    /**
     * Removes a card from a specific slot and cleans up free slots
     */
    removeCardFromSlot(slotKey: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const cardId = pilot.slotCards[slotKey];
      if (!cardId) return;
      
      const card = cards.find((c) => c.id === cardId) as any;

      // For multi-slot cards, remove from all occupied slots
      if (this.isMultiSlotCard(cardId)) {
        const occupiedKeys = this.getOccupiedSlotKeys(cardId);
        occupiedKeys.forEach(key => {
          const { [key]: removed, ...rest } = pilot.slotCards;
          pilot.slotCards = rest;
        });
      } else {
        const { [slotKey]: removed, ...rest } = pilot.slotCards;
        pilot.slotCards = rest;
      }

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
     * Equips a card to a specific faction and updates faction tracking
     */
    equipCardWithFaction(cardId: string, faction: string) {
      const pilot = this.currentPilot;
      if (!pilot) return false;

      const card = cards.find((c) => c.id === cardId);
      if (!card) return false;

      // Initialize faction mappings if needed
      if (!pilot.cardFactionMappings) {
        pilot.cardFactionMappings = {};
      }

      // Store which faction this card is equipped as
      pilot.cardFactionMappings[cardId] = faction;

      // Update faction slot usage
      this.updateUsedFactionSlots();
      
      return true;
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

    /**
     * Increments the kill count for a specific ship type for the current pilot
     */
    incrementShipKills(shipIcon: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!pilot.shipKills) {
        pilot.shipKills = {};
      }

      pilot.shipKills[shipIcon] = (pilot.shipKills[shipIcon] || 0) + 1;
    },

    /**
     * Decrements the kill count for a specific ship type for the current pilot
     */
    decrementShipKills(shipIcon: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!pilot.shipKills) {
        pilot.shipKills = {};
      }

      const currentKills = pilot.shipKills[shipIcon] || 0;
      if (currentKills > 0) {
        pilot.shipKills[shipIcon] = currentKills - 1;
        
        // Clean up zero values
        if (pilot.shipKills[shipIcon] === 0) {
          delete pilot.shipKills[shipIcon];
        }
      }
    },

    /**
     * Resets all kill counts for the current pilot
     */
    resetShipKills() {
      const pilot = this.currentPilot;
      if (!pilot) return;

      pilot.shipKills = {};
    },
  },

  persist: {
    storage: localStorage,
  },
});
