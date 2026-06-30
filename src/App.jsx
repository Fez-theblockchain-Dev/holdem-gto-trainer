import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { dealHoleCards, handToKey, displayRank, SUIT_SYMBOL } from './poker/cards'
import { SCENARIOS, getStrategy, actionForKey } from './poker/ranges'
import { MIN_HANDS_FOR_REPORT } from './poker/analysis'
import { loadHistory, saveHistory, clearHistory } from './poker/history'
import { PokerTable } from './components/PokerTable'
import { ActionButtons } from './components/ActionButtons'
import { FeedbackBanner } from './components/FeedbackBanner'
import { RangeGrid } from './components/RangeGrid'
import { LeakReport } from './components/LeakReport'

// How long to show feedback + the solution grid before dealing the next hand.
const AUTO_ADVANCE_MS = 2600

function randomScenario() {
  return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
}

function newHand() {
  const scenario = randomScenario()
  const cards = dealHoleCards()
  return { scenario, cards, handKey: handToKey(cards[0], cards[1]) }
}

export default function App() {
  const [hand, setHand] = useState(() => newHand())
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => loadHistory())
  const [showReport, setShowReport] = useState(false)

  const { scenario, cards, handKey } = hand
  const strategy = useMemo(() => getStrategy(scenario), [scenario])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const score = useMemo(
    () => ({ total: history.length, correct: history.filter((h) => h.isCorrect).length }),
    [history],
  )

  const handleSelect = useCallback(
    (action) => {
      if (result) return
      const correctAction = actionForKey(handKey, strategy, scenario)
      const correct = action === correctAction
      setResult({ chosen: action, correctAction, correct })
      setHistory((prev) => [
        ...prev,
        {
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          handKey,
          chosen: action,
          correct: correctAction,
          isCorrect: correct,
          ts: Date.now(),
        },
      ])
    },
    [result, handKey, strategy, scenario],
  )

  const handleNext = useCallback(() => {
    setHand(newHand())
    setResult(null)
  }, [])

  // Auto-advance to the next scenario shortly after the user answers.
  useEffect(() => {
    if (!result || showReport) return undefined
    const timer = setTimeout(handleNext, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [result, showReport, handleNext])

  const handleReset = useCallback(() => {
    clearHistory()
    setHistory([])
    setShowReport(false)
    setHand(newHand())
    setResult(null)
  }, [])

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0
  const reportReady = score.total >= MIN_HANDS_FOR_REPORT
  const handsToGo = Math.max(0, MIN_HANDS_FOR_REPORT - score.total)

  return (
    <Box minH="100vh" bg="#0f161d" color="white" px="4" py="6">
      <style>{`@keyframes nextHandShrink { from { width: 100%; } to { width: 0%; } }`}</style>
      <VStack maxW="900px" mx="auto" gap="6" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap="3">
          <HStack gap="3">
            <Box fontSize="28px">{'\u265F'}</Box>
            <Box>
              <Heading size="lg" color="white">
                Hold&apos;em GTO Trainer
              </Heading>
              <Text fontSize="13px" color="whiteAlpha.600">
                Preflop decision practice
              </Text>
            </Box>
          </HStack>
          <HStack gap="6">
            <VStack gap="0" align="end">
              <Text fontSize="12px" color="whiteAlpha.600" fontWeight="600">
                ACCURACY
              </Text>
              <Text fontSize="22px" fontWeight="800" color={accuracy >= 70 ? '#7ee2a4' : 'white'}>
                {accuracy}%
              </Text>
            </VStack>
            <VStack gap="0" align="end">
              <Text fontSize="12px" color="whiteAlpha.600" fontWeight="600">
                HANDS
              </Text>
              <Text fontSize="22px" fontWeight="800">
                {score.correct}/{score.total}
              </Text>
            </VStack>
            <Button
              onClick={() => setShowReport((s) => !s)}
              bg={showReport ? 'whiteAlpha.200' : reportReady ? '#ffd27a' : 'whiteAlpha.100'}
              color={!showReport && reportReady ? '#0f161d' : 'white'}
              fontWeight="800"
              size="sm"
              borderRadius="10px"
              _hover={{ filter: 'brightness(0.95)' }}
            >
              {showReport ? 'Back to training' : reportReady ? 'Leak Report' : `Leak Report (${score.total}/${MIN_HANDS_FOR_REPORT})`}
            </Button>
          </HStack>
        </Flex>

        {showReport ? (
          <LeakReport history={history} onClose={() => setShowReport(false)} onReset={handleReset} />
        ) : (
          <>
            {/* Scenario prompt */}
            <Box
              bg="#16212b"
              border="1px solid #233241"
              borderRadius="14px"
              px="5"
              py="4"
              textAlign="center"
            >
              <Text fontSize="13px" color="#ffd27a" fontWeight="700" letterSpacing="0.5px">
                {scenario.title.toUpperCase()}
              </Text>
              <Text fontSize="15px" color="whiteAlpha.900" mt="1">
                {scenario.description}
              </Text>
              <Text fontSize="13px" color="whiteAlpha.600" mt="1">
                Your hand:{' '}
                <Box as="span" fontWeight="800" color="white">
                  {displayRank(cards[0].rank)}
                  {SUIT_SYMBOL[cards[0].suit]} {displayRank(cards[1].rank)}
                  {SUIT_SYMBOL[cards[1].suit]} ({handKey})
                </Box>
              </Text>
            </Box>

            {/* Table */}
            <Box bg="#16212b" border="1px solid #233241" borderRadius="16px" py="6" px="4">
              <PokerTable scenario={scenario} cards={cards} />
            </Box>

            {/* Actions + feedback */}
            <VStack gap="4">
              <ActionButtons
                actions={scenario.actions}
                onSelect={handleSelect}
                answered={Boolean(result)}
                chosen={result?.chosen}
                correctAction={result?.correctAction}
                scenario={scenario}
              />
              <FeedbackBanner result={result} scenario={scenario} />
              {result ? (
                <VStack gap="2" w="100%" maxW="320px">
                  <Text fontSize="12px" color="whiteAlpha.600" fontWeight="600" letterSpacing="0.5px">
                    NEXT HAND…
                  </Text>
                  <Box w="100%" h="5px" bg="whiteAlpha.200" borderRadius="full" overflow="hidden">
                    <Box
                      key={score.total}
                      h="100%"
                      bg="#ffd27a"
                      borderRadius="full"
                      style={{ animation: `nextHandShrink ${AUTO_ADVANCE_MS}ms linear forwards` }}
                    />
                  </Box>
                </VStack>
              ) : null}
            </VStack>

            {/* Solution grid (revealed after answering) */}
            {result ? (
              <Box bg="#16212b" border="1px solid #233241" borderRadius="16px" py="6" px="4">
                <RangeGrid scenario={scenario} strategy={strategy} currentKey={handKey} />
              </Box>
            ) : null}

            {!reportReady ? (
              <Text fontSize="12px" color="whiteAlpha.500" textAlign="center">
                Play {handsToGo} more hand{handsToGo === 1 ? '' : 's'} to unlock your full leak report.
              </Text>
            ) : null}

            <Text fontSize="11px" color="whiteAlpha.400" textAlign="center">
              Ranges are simplified 100bb approximations for training, not exact solver output.
            </Text>
          </>
        )}
      </VStack>
    </Box>
  )
}
