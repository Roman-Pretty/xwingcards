import { defineStore } from "pinia";

export const usePilotStore = defineStore("pilotStore", {
  state: () => ({
    pilots: [
      {
        id: "1",
        name: "Wedge",
        rank: 3,
        xp: 10,
        class: "Ace",
        selectedCards: [],
        ownedCards: [],
        ships: ["Y-Wing", "X-Wing"],
        selectedShip: "X-Wing",
      },
      {
        id: "2",
        name: "Luke",
        rank: 2,
        xp: 15,
        class: "Force User",
        selectedCards: [],
        ownedCards: [],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
      },
      {
        id: "3",
        name: "Soontir Fell",
        rank: 2,
        xp: 15,
        class: "Defector",
        selectedCards: [],
        ownedCards: [],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
      },
      {
        id: "4",
        name: "Captain Rex",
        rank: 2,
        xp: 15,
        class: "Veteran",
        selectedCards: [],
        ownedCards: [],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
      },
    ],
    currentPilotId: null,
  }),

  getters: {
    currentPilot(state) {
      return state.pilots.find((p) => p.id === state.currentPilotId);
    },
    isCardTaken: (state) => (cardId) => {
      return state.pilots.some((p) => p.selectedCards.includes(cardId));
    },
  },

  actions: {
    selectCard(cardId, { unique = false } = {}) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      // If unique and someone else has it, reject
      if (unique && this.isCardTaken(cardId)) return;

      if (!pilot.selectedCards.includes(cardId)) {
        pilot.selectedCards.push(cardId);
      }
    },

    unselectCard(cardId) {
      const pilot = this.currentPilot;
      if (pilot) {
        pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);
      }
    },
    switchPilot(id) {
      this.currentPilotId = id;
    },
  },

  persist: {
    storage: localStorage,
  },
});
