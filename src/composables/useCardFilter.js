import cards from '../data/cards.json'

export function useCardFilter() {
  const byType = (type) =>
    cards.filter((c) => c.type.toLowerCase() === type.toLowerCase())

  const byFaction = (faction) =>
    cards.filter((c) => c.faction.toLowerCase() === faction.toLowerCase())

  const byTypeAndFaction = (type, faction) =>
    cards.filter(
      (c) =>
        c.type.toLowerCase() === type.toLowerCase() &&
        c.faction.toLowerCase() === faction.toLowerCase()
    )

    const all = () => cards

  return {
    all: cards,
    byType,
    byFaction,
    byTypeAndFaction,
    all,
  }
}
