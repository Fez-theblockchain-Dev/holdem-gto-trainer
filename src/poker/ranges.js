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
// `label` is the generic fallback; scenarios provide contextual raise labels
// (open vs 3-bet sizing) via `actionLabel`.
export const ACTION_META = {
  raise: { label: 'Raise / 3-Bet', color: '#e0653a' },
  call: { label: 'Call', color: '#3a9b7a' },
  fold: { label: 'Fold', color: '#3f6fb0' },
}

// Standard ~100bb GTO-approximate preflop charts. RFI (raise-first-in) ranges
// widen by position and are tighter at a fuller (8-max) table than 6-max.
// A generic open uses 2.5bb; facing-raise spots 3-bet to position-based sizing.
const OPEN = { raiseType: 'open', raiseLabel: 'Raise to 2.5bb', actions: ['raise', 'fold'], call: [] }

export const SCENARIOS = [
  // ---------- Facing a raise (apply to both formats) ----------
  {
    id: 'bb-vs-btn',
    title: 'BB vs BTN Open',
    formats: ['6max', '8max'],
    hero: 'BB',
    villain: 'BTN',
    villainAction: 'raises to 2.5bb',
    description:
      'It folds around to the Button, who opens to 2.5bb. Action is on you in the Big Blind.',
    actions: ['raise', 'call', 'fold'],
    // Hero is out of position vs the open, so the GTO 3-bet is larger (~4.5x).
    raiseType: '3bet',
    raiseLabel: '3-Bet to 11bb',
    raise: ['JJ+', 'AQs+', 'AKo', 'A5s', 'A4s'],
    call: [
      '22+', 'ATs+', 'A2s+', 'KTs+', 'QTs+', 'J9s+', 'T8s+',
      '98s', '87s', '76s', '65s', '54s',
      'AJo+', 'KQo', 'KJo', 'QJo', 'JTo', 'ATo',
    ],
  },
  {
    id: 'co-vs-utg',
    title: 'CO vs UTG Open',
    formats: ['6max', '8max'],
    hero: 'CO',
    villain: 'UTG',
    villainAction: 'raises to 2.5bb',
    description:
      'UTG opens to 2.5bb and it folds to you in the Cutoff. How do you respond?',
    actions: ['raise', 'call', 'fold'],
    // Hero is in position vs the open, so the GTO 3-bet is smaller (~3x).
    raiseType: '3bet',
    raiseLabel: '3-Bet to 7.5bb',
    raise: ['QQ+', 'AKs', 'AKo', 'A5s'],
    call: ['TT-22', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo', 'KQo'],
  },

  // ---------- 6-Max RFI ----------
  {
    ...OPEN,
    id: 'utg-rfi-6',
    title: 'UTG Open (6-Max)',
    formats: ['6max'],
    hero: 'UTG',
    villain: null,
    villainAction: null,
    description: 'Everyone folds to you UTG at a 6-max table (100bb). Open-raise or fold?',
    raise: ['22+', 'ATs+', 'KTs+', 'QTs+', 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s', 'A5s', 'A4s', 'AJo+', 'KQo'],
  },
  {
    ...OPEN,
    id: 'hj-rfi-6',
    title: 'HJ Open (6-Max)',
    formats: ['6max'],
    hero: 'HJ',
    villain: null,
    villainAction: null,
    description: 'It folds to you in the Hijack at a 6-max table (100bb). Open-raise or fold?',
    raise: ['22+', 'A9s+', 'A5s', 'A4s', 'KTs+', 'QTs+', 'J9s+', 'T9s', '98s', '87s', '76s', '65s', '54s', 'ATo+', 'KJo+', 'QJo'],
  },
  {
    ...OPEN,
    id: 'co-rfi-6',
    title: 'CO Open (6-Max)',
    formats: ['6max'],
    hero: 'CO',
    villain: null,
    villainAction: null,
    description: 'It folds to you in the Cutoff at a 6-max table (100bb). Open-raise or fold?',
    raise: ['22+', 'A2s+', 'K9s+', 'Q9s+', 'J9s+', 'T8s+', '97s+', '86s+', '75s+', '65s', '54s', 'A9o+', 'KTo+', 'QTo+', 'JTo'],
  },
  {
    ...OPEN,
    id: 'btn-rfi-6',
    title: 'BTN Open (6-Max)',
    formats: ['6max'],
    hero: 'BTN',
    villain: null,
    villainAction: null,
    description: 'It folds to you on the Button at a 6-max table (100bb). Open-raise or fold?',
    raise: ['22+', 'A2s+', 'K5s+', 'Q7s+', 'J7s+', 'T7s+', '96s+', '85s+', '75s+', '64s+', '54s', '43s', 'A2o+', 'K8o+', 'Q9o+', 'J9o+', 'T9o', '98o', '87o'],
  },
  {
    ...OPEN,
    id: 'sb-rfi-6',
    title: 'SB Open (6-Max)',
    formats: ['6max'],
    hero: 'SB',
    villain: null,
    villainAction: null,
    description: 'It folds to you in the Small Blind at a 6-max table (100bb). Open-raise or fold?',
    raise: ['22+', 'A2s+', 'K7s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '86s+', '75s+', '65s', '54s', 'A7o+', 'A5o', 'A4o', 'K9o+', 'Q9o+', 'J9o+', 'T9o'],
  },

  // ---------- 8-Max RFI (tighter in early positions) ----------
  {
    ...OPEN,
    id: 'utg-rfi-8',
    title: 'UTG Open (8-Max)',
    formats: ['8max'],
    hero: 'UTG',
    villain: null,
    villainAction: null,
    description: 'Everyone folds to you UTG at a full 8-handed table (100bb). Open-raise or fold?',
    raise: ['55+', 'ATs+', 'KJs+', 'QJs', 'JTs', 'T9s', 'A5s', 'AJo+', 'KQo'],
  },
  {
    ...OPEN,
    id: 'mp-rfi-8',
    title: 'MP Open (8-Max)',
    formats: ['8max'],
    hero: 'MP',
    villain: null,
    villainAction: null,
    description: 'It folds to you in Middle Position at an 8-handed table (100bb). Open-raise or fold?',
    raise: ['44+', 'A9s+', 'A5s', 'KTs+', 'QTs+', 'J9s+', 'T9s', '98s', 'ATo+', 'KJo+', 'QJo'],
  },
  {
    ...OPEN,
    id: 'co-rfi-8',
    title: 'CO Open (8-Max)',
    formats: ['8max'],
    hero: 'CO',
    villain: null,
    villainAction: null,
    description: 'It folds to you in the Cutoff at an 8-handed table (100bb). Open-raise or fold?',
    raise: ['22+', 'A2s+', 'K9s+', 'Q9s+', 'J9s+', 'T8s+', '97s+', '87s', '76s', '65s', 'A9o+', 'KTo+', 'QTo+', 'JTo'],
  },
  {
    ...OPEN,
    id: 'btn-rfi-8',
    title: 'BTN Open (8-Max)',
    formats: ['8max'],
    hero: 'BTN',
    villain: null,
    villainAction: null,
    description: 'It folds to you on the Button at an 8-handed table (100bb). Open-raise or fold?',
    raise: ['22+', 'A2s+', 'K6s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '86s+', '75s+', '64s+', '54s', 'A3o+', 'K9o+', 'Q9o+', 'J9o+', 'T9o', '98o'],
  },
]

export const TABLE_FORMATS = [
  { value: '6max', label: '6-Max (6 players)' },
  { value: '8max', label: '8-Max (8 players)' },
]

export function getScenariosForFormat(format) {
  const pool = SCENARIOS.filter((s) => s.formats?.includes(format))
  return pool.length ? pool : SCENARIOS
}

// Display label for an action, using the scenario's contextual raise sizing
// (e.g. "3-Bet to 11bb" vs the generic "Raise 2.5x").
export function actionLabel(action, scenario) {
  if (action === 'raise' && scenario?.raiseLabel) return scenario.raiseLabel
  return ACTION_META[action].label
}

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
