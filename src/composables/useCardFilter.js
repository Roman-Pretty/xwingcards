import cards from '../data/cards.json'

export function useCardFilter() {
  const sortByCost = (arr) =>
    [...arr].sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))

  const byType = (type) =>
    sortByCost(cards.filter((c) => c.type.toLowerCase() === type.toLowerCase()))

  const byFaction = (faction) =>
    sortByCost(cards.filter((c) => c.faction.toLowerCase() === faction.toLowerCase()))

  const byTypeAndFaction = (type, faction) =>
    sortByCost(
      cards.filter(
        (c) =>
          c.type.toLowerCase() === type.toLowerCase() &&
          c.faction.toLowerCase() === faction.toLowerCase()
      )
    )

  const all = () => sortByCost(cards)

  const byAllowedFactions = (factions = []) =>
    sortByCost(cards.filter((c) =>
      factions.includes(c.faction.toLowerCase()) || c.faction.toLowerCase() === 'neutral'
    ))

  return {
    all: all(),
    byType,
    byFaction,
    byTypeAndFaction,
    byAllowedFactions,
    all,
  }
}
