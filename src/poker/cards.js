// Card + deck utilities for the trainer.

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
export const SUITS = ['c', 'd', 'h', 's']

export const SUIT_SYMBOL = { c: '\u2663', d: '\u2666', h: '\u2665', s: '\u2660' }
// Four-color deck for readability (clubs green, diamonds blue).
export const SUIT_COLOR = { c: '#1f9d55', d: '#2f7fe0', h: '#e0413e', s: '#1a1a1a' }

export const rankValue = (r) => RANKS.indexOf(r) + 2

export const displayRank = (r) => (r === 'T' ? '10' : r)

export function buildDeck() {
  const deck = []
  for (const r of RANKS) for (const s of SUITS) deck.push({ rank: r, suit: s })
  return deck
}

export function dealHoleCards() {
  const deck = buildDeck()
  const first = deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
  const second = deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
  return [first, second]
}

// Convert two cards to a canonical 169-grid key, e.g. "AA", "AKs", "AKo".
export function handToKey(c1, c2) {
  let hi = c1
  let lo = c2
  if (rankValue(c2.rank) > rankValue(c1.rank)) {
    hi = c2
    lo = c1
  }
  if (hi.rank === lo.rank) return hi.rank + lo.rank
  const suited = hi.suit === lo.suit ? 's' : 'o'
  return hi.rank + lo.rank + suited
}
