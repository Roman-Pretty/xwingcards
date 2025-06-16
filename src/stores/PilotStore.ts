import { defineStore } from "pinia";
import classData from "../data/classes.json";

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
        slots: [],
      },
      {
        id: "2",
        name: "Soontir Fell",
        rank: 2,
        xp: 15,
        class: "Defector",
        selectedCards: [],
        ownedCards: [],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
        slots: [],
      },
      {
        id: "3",
        name: "Captain Rex",
        rank: 2,
        xp: 15,
        class: "Veteran",
        selectedCards: [],
        ownedCards: [],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
        slots: [],
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
    switchPilot(id) {
      this.currentPilotId = id;
      this.updatePilotSlots();
    },

    selectCard(cardId, { unique = false } = {}) {
      const pilot = this.currentPilot;
      if (!pilot) return;

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

    updatePilotSlots() {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const pilotClass = classData[pilot.class];
      if (!pilotClass) return;

      // Get ship slot info
      const shipEntry = pilotClass.ships.find(
        (s) => s.ship === pilot.selectedShip
      );

      const shipSlots = shipEntry?.slots ?? [];

      // Get rank data
      const rankData = pilotClass.ranks.find((r) => r.rank === pilot.rank);
      const rankSlots = rankData?.slots ?? [];
      const optionalSlots = rankData?.optionalslots ?? [];

      // Combine and assign
      pilot.slots = [...shipSlots, ...rankSlots, ...optionalSlots];
    },

    changeSelectedShip(shipName) {
      const pilot = this.currentPilot;
      if (!pilot) return;
      if (!pilot.ships.includes(shipName)) return;

      pilot.selectedShip = shipName;
      this.updatePilotSlots();
    },
  },

  persist: {
    storage: localStorage,
  },
});
