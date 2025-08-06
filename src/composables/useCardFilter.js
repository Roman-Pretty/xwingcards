import cards from '../data/cards.js';
import { usePilotStore } from '../stores/pilotStore.ts';

export function useCardFilter() {
  const store = usePilotStore();
  
  // Helper function to apply settings-based filtering
  const applySettingsFilter = (cardList) => {
    let filteredCards = [...cardList];

    // Filter out custom cards if setting is disabled
    if (!store.enableCustomCards) {
      filteredCards = filteredCards.filter(card => {
        // Always show custom cards that the current pilot owns
        if (card.custom && store.isCardOwnedByCurrentPilot(card.id)) {
          return true;
        }
        // Otherwise, only show if not custom
        return !card.custom;
      });
    }

    // Always show all cards regardless of faction/initiative restrictions
    // (pilots can always see unattainable cards)

    return filteredCards;
  };

  const sortByCost = (arr) =>
    [...arr].sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0));

  const byType = (type) => {
    const filtered = cards.filter((c) => c.type.toLowerCase() === type.toLowerCase());
    return sortByCost(applySettingsFilter(filtered));
  };

  const byFaction = (faction) => {
    const filtered = cards.filter((c) => c.faction.toLowerCase() === faction.toLowerCase());
    return sortByCost(applySettingsFilter(filtered));
  };

  const byTypeAndFaction = (type, faction) => {
    const filtered = cards.filter(
      (c) =>
        c.type.toLowerCase() === type.toLowerCase() &&
        c.faction.toLowerCase() === faction.toLowerCase()
    );
    return sortByCost(applySettingsFilter(filtered));
  };

  const all = () => sortByCost(applySettingsFilter(cards));

  const byAllowedFactions = (factions = []) => {
    // If faction filtering is disabled, show all cards (like neutral)
    if (!store.enableFactionFiltering) {
      return sortByCost(applySettingsFilter(cards));
    }
    
    const filtered = cards.filter(
      (c) =>
        factions.includes(c.faction.toLowerCase()) ||
        c.faction.toLowerCase() === 'neutral'
    );
    return sortByCost(applySettingsFilter(filtered));
  };

  const bySlotType = (inputCards, selectedSlots = []) => {
    if (!selectedSlots.length) return applySettingsFilter(inputCards);
    const filtered = inputCards.filter((card) =>
      card.slots?.some((slot) => selectedSlots.includes(slot.toLowerCase()))
    );
    return applySettingsFilter(filtered);
  };

  return {
    all,
    byType,
    byFaction,
    byTypeAndFaction,
    byAllowedFactions,
    bySlotType,
  };
}
