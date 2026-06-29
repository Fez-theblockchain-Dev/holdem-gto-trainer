// Simplified GTO-style preflop range engine.
//
// Ranges are written in standard poker notation and expanded into the set of
// 169 hand keys (e.g. "AA", "AKs", "T9s"). These are reasonable approximations
// for a 100bb cash game, not exact solver output, and are intentionally easy to
// tune or replace with more precise data later.

import { RANKS } from './cards.js'

const idx = (r) => RANKS.indexOf(r)

function pairsFrom(rank) {
  const out = []
  for (let i = idx(rank); i < RANKS.length; i++) out.push(RANKS[i] + RANKS[i])
  return out
}

// e.g. ATs+ -> ATs, AJs, AQs, AKs  (fixed high card, low card climbs)
function comboPlus(hi, lo, suited) {
  const out = []
  for (let i = idx(lo); i < idx(hi); i++) out.push(hi + RANKS[i] + suited)
  return out
}

function expandDash(a, b) {
  // Pairs, e.g. "TT-77"
  if (a.length === 2 && a[0] === a[1]) {
    let hiI = idx(a[0])
    let loI = idx(b[0])
    if (loI > hiI) [hiI, loI] = [loI, hiI]
    const out = []
    for (let i = loI; i <= hiI; i++) out.push(RANKS[i] + RANKS[i])
    return out
  }
  // Suited / offsuit with a shared high card, e.g. "A5s-A2s"
  const suited = a[2]
  const high = a[0]
  let l1 = idx(a[1])
  let l2 = idx(b[1])
  if (l2 > l1) [l1, l2] = [l2, l1]
  const out = []
  for (let i = l2; i <= l1; i++) out.push(high + RANKS[i] + suited)
  return out
}

export function expandToken(token) {
  const tok = token.trim()
  if (tok.includes('-')) {
    const [a, b] = tok.split('-')
    return expandDash(a, b)
  }
  const plus = tok.endsWith('+')
  const base = plus ? tok.slice(0, -1) : tok

  if (base.length === 2 && base[0] === base[1]) {
    return plus ? pairsFrom(base[0]) : [base]
  }
  const [hi, lo, suited] = base
  return plus ? comboPlus(hi, lo, suited) : [base]
}

export function expandRange(tokens) {
  const set = new Set()
  for (const t of tokens || []) for (const k of expandToken(t)) set.add(k)
  return set
}

// Action metadata shared by buttons + grid coloring.
export const ACTION_META = {
  raise: { label: 'Raise 2.5x', color: '#e0653a' },
  call: { label: 'Call', color: '#3a9b7a' },
  fold: { label: 'Fold', color: '#3f6fb0' },
}

export const SCENARIOS = [
  {
    id: 'bb-vs-btn',
    title: 'BB vs BTN Open',
    hero: 'BB',
    villain: 'BTN',
    villainAction: 'raises to 2.5bb',
    description:
      'It folds around to the Button, who opens to 2.5bb. Action is on you in the Big Blind.',
    actions: ['raise', 'call', 'fold'],
    raise: ['JJ+', 'AQs+', 'AKo', 'A5s', 'A4s'],
    call: [
      '22+', 'ATs+', 'A2s+', 'KTs+', 'QTs+', 'J9s+', 'T8s+',
      '98s', '87s', '76s', '65s', '54s',
      'AJo+', 'KQo', 'KJo', 'QJo', 'JTo', 'ATo',
    ],
  },
  {
    id: 'btn-rfi',
    title: 'BTN First In',
    hero: 'BTN',
    villain: null,
    villainAction: null,
    description:
      'Everyone folds to you on the Button (100bb effective). Do you open-raise or fold?',
    actions: ['raise', 'fold'],
    raise: [
      '22+', 'A2s+', 'K7s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '86s+', '75s+', '64s+', '54s',
      'A7o+', 'A5o', 'K9o+', 'Q9o+', 'J9o+', 'T9o', '98o',
    ],
    call: [],
  },
  {
    id: 'co-vs-utg',
    title: 'CO vs UTG Open',
    hero: 'CO',
    villain: 'UTG',
    villainAction: 'raises to 2.5bb',
    description:
      'UTG opens to 2.5bb and it folds to you in the Cutoff. How do you respond?',
    actions: ['raise', 'call', 'fold'],
    raise: ['QQ+', 'AKs', 'AKo', 'A5s'],
    call: ['TT-22', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'KQo'],
  },
]

export function getStrategy(scenario) {
  return {
    raise: expandRange(scenario.raise),
    call: expandRange(scenario.call),
  }
}

// The GTO "answer" for a hand in a scenario. Raise takes priority over call,
// everything else folds. Scenarios without a call option never return 'call'.
export function actionForKey(handKey, strategy, scenario) {
  if (strategy.raise.has(handKey)) return 'raise'
  if (scenario.actions.includes('call') && strategy.call.has(handKey)) return 'call'
  return 'fold'
}

// All 169 cells laid out for a 13x13 grid (suited upper-right, offsuit lower-left).
export function gridCells() {
  const order = [...RANKS].reverse() // A, K, Q ... 2
  const cells = []
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const hi = order[Math.min(r, c)]
      const lo = order[Math.max(r, c)]
      let key
      if (r === c) key = hi + hi
      else if (c > r) key = hi + lo + 's'
      else key = hi + lo + 'o'
      cells.push({ r, c, key })
    }
  }
  return cells
}
