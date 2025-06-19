import { defineStore } from "pinia";
import classData from "../data/classes.json";
import cards from "../data/cards.json";

export interface Pilot {
  id: string;
  name: string;
  class: string;
  rank: string;
  ships: string[];
  selectedShip: string;
  slots: string[];
  slotCards: Record<string, string>;
  selectedCards: string[];
  ownedCards: string[];
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
      return state.pilots.find((p) => p.id === state.currentPilotId);
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

    isCardTaken: (state) => (cardId) => {
      const card = cards.find((c) => c.id === cardId);
      const isUnique = card?.unique;

      return state.pilots.some(
        (p) =>
          (isUnique &&
            p.id !== state.currentPilotId &&
            (p.selectedCards.includes(cardId) ||
              Object.values(p.slotCards).includes(cardId))) ||
          (p.id === state.currentPilotId &&
            (p.selectedCards.includes(cardId) ||
              Object.values(p.slotCards).includes(cardId)))
      );
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
  },

  actions: {
    calculateUsedFactionSlots(pilot: Pilot) {
      if (!pilot) return {};

      const factionCount: Record<string, number> = {};

      Object.values(pilot.slotCards).forEach((cardId) => {
        const card = cards.find((c) => c.id === cardId);
        const faction = card?.faction;
        if (faction && faction.toLowerCase() !== "neutral") {
          factionCount[faction] = (factionCount[faction] || 0) + 1;
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
      this.updateUsedFactionSlots();
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

      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);
      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: cardId,
      };

      this.updateUsedFactionSlots();
    },

    removeCardFromSlot(slotKey: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const { [slotKey]: removed, ...rest } = pilot.slotCards;
      pilot.slotCards = rest;

      this.updateUsedFactionSlots();
    },

    addCardToDeck(cardId: string) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      if (!pilot.ownedCards.includes(cardId)) {
        pilot.ownedCards.push(cardId);
      }
    },
  },

  persist: {
    storage: localStorage,
  },
});
