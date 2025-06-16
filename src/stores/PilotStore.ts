import { defineStore } from "pinia";
import classData from "../data/classes.json";
import cards from "../data/cards.json";

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
        slotCards: {},
        ownedCards: ["r2d2", "r5d8", "mynock"],
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
        slotCards: {},
        ownedCards: ["chopper", "r3astromech", "r5d8"],
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
        slotCards: {},
        ownedCards: ["r3astromech", "r5d8"],
        ships: ["X-Wing"],
        selectedShip: "X-Wing",
        slots: [],
      },
    ],
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
  },

  actions: {
    switchPilot(id) {
      if (this.currentPilotId === id) return;
      this.currentPilotId = id;
      this.updatePilotSlots();
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

      const shipEntry = pilotClass.ships.find(
        (s) => s.ship === pilot.selectedShip
      );

      const shipSlots = shipEntry?.slots ?? [];
      const rankData = pilotClass.ranks.find((r) => r.rank === pilot.rank);
      const rankSlots = rankData?.slots ?? [];
      const optionalSlots = rankData?.optionalslots ?? [];

      const allSlots = [...shipSlots, ...rankSlots, ...optionalSlots];

      pilot.slots.splice(0, pilot.slots.length, ...allSlots);
      const validSlotKeys = allSlots.map((slot, index) => `${slot}-${index}`);

      // pilot.slotCards = Object.fromEntries(
      //   Object.entries(pilot.slotCards).filter(([slotKey]) =>
      //     validSlotKeys.includes(slotKey)
      //   )
      // );
    },

    changeSelectedShip(shipName) {
      const pilot = this.currentPilot;
      if (!pilot) return;
      if (!pilot.ships.includes(shipName)) return;

      pilot.selectedShip = shipName;
      this.updatePilotSlots();
      pilot.slotCards = [];
    },

    changeSlotOption(slotKey, option) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: option,
      };
    },

    resetSelectedCards() {
      const pilot = this.currentPilot;
      if (!pilot) return;
      pilot.selectedCards = [];
    },

    assignCardToSlot(slotKey, cardId) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      pilot.selectedCards = pilot.selectedCards.filter((c) => c !== cardId);

      pilot.slotCards = {
        ...pilot.slotCards,
        [slotKey]: cardId,
      };
    },

    removeCardFromSlot(slotKey) {
      const pilot = this.currentPilot;
      if (!pilot) return;

      const { [slotKey]: removed, ...rest } = pilot.slotCards;
      pilot.slotCards = rest;
    },
  },

  persist: {
    storage: localStorage,
  },
});
