// Turns a history of played hands into a "leak" report: recurring mistakes,
// action tendencies vs. optimal, and per-scenario performance.
//
// Each history record looks like:
//   { scenarioId, scenarioTitle, handKey, chosen, correct, isCorrect, ts }

export const MIN_HANDS_FOR_REPORT = 100

const ACTION_VERB = { raise: 'raise', call: 'call', fold: 'fold' }

// Mistake taxonomy keyed by `${correctAction}->${chosenAction}`.
const MISTAKES = {
  'raise->call': {
    label: 'Too passive — called when raising was the GTO play',
    tip: 'You are leaving value/fold-equity on the table. Trust your strong hands and bluffs to raise.',
  },
  'raise->fold': {
    label: 'Over-folding strong hands — folded when you should raise',
    tip: 'You are folding hands that want to be in the pot aggressively. Widen your raising range.',
  },
  'call->fold': {
    label: 'Over-folding — folded hands you should defend/call',
    tip: 'You are folding too tight, especially in the blinds. Defend more of your continuing range.',
  },
  'call->raise': {
    label: 'Over-aggressive — raised when calling was best',
    tip: 'Not every playable hand wants to raise. Flat more of your medium-strength hands.',
  },
  'fold->call': {
    label: 'Calling too loose — called when folding was best',
    tip: 'You are paying off with hands that do not continue profitably. Tighten your calling range.',
  },
  'fold->raise': {
    label: 'Bluffing too much — raised hands that should be folded',
    tip: 'Your raising range is too wide. Cut the weakest bluffs that have no equity or blockers.',
  },
}

export function analyzeHistory(history) {
  const total = history.length
  const correct = history.filter((h) => h.isCorrect).length
  const accuracy = total ? Math.round((correct / total) * 100) : 0

  // Action distribution: what the user did vs. what GTO wanted.
  const userCounts = { raise: 0, call: 0, fold: 0 }
  const gtoCounts = { raise: 0, call: 0, fold: 0 }
  for (const h of history) {
    if (userCounts[h.chosen] != null) userCounts[h.chosen] += 1
    if (gtoCounts[h.correct] != null) gtoCounts[h.correct] += 1
  }

  // Over/under-use of each action relative to optimal (as % of all hands).
  const tendencies = []
  for (const action of ['raise', 'call', 'fold']) {
    const diffPct = total ? Math.round(((userCounts[action] - gtoCounts[action]) / total) * 100) : 0
    if (diffPct >= 5) {
      tendencies.push({
        action,
        diffPct,
        text: `You ${ACTION_VERB[action]} too often — ${diffPct}% more than the solver.`,
      })
    } else if (diffPct <= -5) {
      tendencies.push({
        action,
        diffPct,
        text: `You ${ACTION_VERB[action]} too rarely — ${Math.abs(diffPct)}% less than the solver.`,
      })
    }
  }
  tendencies.sort((a, b) => Math.abs(b.diffPct) - Math.abs(a.diffPct))

  // Mistake taxonomy.
  const mistakeCounts = {}
  for (const h of history) {
    if (h.isCorrect) continue
    const key = `${h.correct}->${h.chosen}`
    mistakeCounts[key] = (mistakeCounts[key] || 0) + 1
  }
  const totalMistakes = total - correct
  const leaks = Object.entries(mistakeCounts)
    .map(([key, count]) => ({
      key,
      count,
      sharePct: totalMistakes ? Math.round((count / totalMistakes) * 100) : 0,
      label: MISTAKES[key]?.label ?? key,
      tip: MISTAKES[key]?.tip ?? '',
    }))
    .sort((a, b) => b.count - a.count)

  // Per-scenario performance (weakest first).
  const byScenario = {}
  for (const h of history) {
    const bucket = (byScenario[h.scenarioId] ??= {
      id: h.scenarioId,
      title: h.scenarioTitle,
      total: 0,
      correct: 0,
    })
    bucket.total += 1
    if (h.isCorrect) bucket.correct += 1
  }
  const scenarios = Object.values(byScenario)
    .map((s) => ({ ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)

  return { total, correct, accuracy, userCounts, gtoCounts, tendencies, leaks, scenarios }
}

// Plain-text version of the report for download/save.
export function reportToText(report) {
  const lines = []
  const pad = (s) => String(s)
  lines.push("HOLD'EM GTO TRAINER — LEAK REPORT")
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push('')
  lines.push(`Hands played: ${report.total}`)
  lines.push(`Correct decisions: ${report.correct} (${report.accuracy}% accuracy)`)
  lines.push('')

  lines.push('ACTION TENDENCIES (vs. solver)')
  if (report.tendencies.length === 0) {
    lines.push('  - Well balanced: no major over/under-use of any action.')
  } else {
    for (const t of report.tendencies) lines.push(`  - ${t.text}`)
  }
  lines.push('')

  lines.push('TOP LEAKS')
  if (report.leaks.length === 0) {
    lines.push('  - No mistakes recorded. Flawless run!')
  } else {
    report.leaks.forEach((l, i) => {
      lines.push(`  ${pad(i + 1)}. ${l.label}`)
      lines.push(`     Occurrences: ${l.count} (${l.sharePct}% of all mistakes)`)
      if (l.tip) lines.push(`     Fix: ${l.tip}`)
    })
  }
  lines.push('')

  lines.push('PERFORMANCE BY SCENARIO (weakest first)')
  for (const s of report.scenarios) {
    lines.push(`  - ${s.title}: ${s.accuracy}% (${s.correct}/${s.total})`)
  }
  lines.push('')
  lines.push('Note: ranges are simplified 100bb approximations for training, not exact solver output.')

  return lines.join('\n')
}
