import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { UserButton, useUser } from '@clerk/clerk-react'
import { FiRefreshCw, FiSettings } from 'react-icons/fi'
import { dealHoleCards, handToKey, displayRank, SUIT_SYMBOL } from './poker/cards'
import {
  getScenariosForFormat,
  getStrategy,
  actionForKey,
  getRakeProfile,
  TABLE_FORMATS,
} from './poker/ranges'
import { MIN_HANDS_FOR_REPORT } from './poker/analysis'
import { loadHistory, saveHistory, clearHistory } from './poker/history'
import { loadSettings, saveSettings } from './poker/settings'
import { PokerTable } from './components/PokerTable'
import { ActionButtons } from './components/ActionButtons'
import { FeedbackBanner } from './components/FeedbackBanner'
import { RangeGrid } from './components/RangeGrid'
import { LeakReport } from './components/LeakReport'
import { SettingsModal } from './components/SettingsModal'

function newHand(format) {
  const pool = getScenariosForFormat(format)
  const scenario = pool[Math.floor(Math.random() * pool.length)]
  const cards = dealHoleCards()
  return { scenario, cards, handKey: handToKey(cards[0], cards[1]) }
}

export default function App() {
  const { user } = useUser()
  const userId = user?.id

  const [settings, setSettings] = useState(() => loadSettings())
  const [hand, setHand] = useState(() => newHand(settings.tableFormat))
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showReport, setShowReport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const { scenario, cards, handKey } = hand
  const rake = getRakeProfile(settings.rakeProfile)
  const strategy = useMemo(() => getStrategy(scenario, rake.tightness), [scenario, rake.tightness])
  const formatLabel = TABLE_FORMATS.find((f) => f.value === settings.tableFormat)?.label ?? settings.tableFormat

  // Load this user's saved hand history once their account is known.
  const loadedForUser = useRef(null)
  useEffect(() => {
    if (userId && loadedForUser.current !== userId) {
      loadedForUser.current = userId
      setHistory(loadHistory(userId))
    }
  }, [userId])

  // Persist history to the signed-in user's bucket as it changes.
  useEffect(() => {
    if (userId && loadedForUser.current === userId) {
      saveHistory(userId, history)
    }
  }, [history, userId])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const score = useMemo(
    () => ({ total: history.length, correct: history.filter((h) => h.isCorrect).length }),
    [history],
  )

  const handleNext = useCallback(() => {
    setHand(newHand(settings.tableFormat))
    setResult(null)
  }, [settings.tableFormat])

  // Re-deal from the new pool when the table format changes.
  const prevFormat = useRef(settings.tableFormat)
  useEffect(() => {
    if (prevFormat.current !== settings.tableFormat) {
      prevFormat.current = settings.tableFormat
      setHand(newHand(settings.tableFormat))
      setResult(null)
    }
  }, [settings.tableFormat])

  const handleSelect = useCallback(
    (action) => {
      if (result) return
      const correctAction = actionForKey(handKey, strategy, scenario)
      const correct = action === correctAction
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
      // Sonic Mode: skip the feedback pause and deal the next hand immediately.
      if (settings.sonicMode) {
        setHand(newHand(settings.tableFormat))
        setResult(null)
      } else {
        setResult({ chosen: action, correctAction, correct })
      }
    },
    [result, handKey, strategy, scenario, settings.sonicMode, settings.tableFormat],
  )

  const handleReset = useCallback(() => {
    clearHistory(userId)
    setHistory([])
    setShowReport(false)
    setHand(newHand(settings.tableFormat))
    setResult(null)
  }, [settings.tableFormat, userId])

  // Restart Session button: confirm before wiping the user's hands-played count.
  const handleRestartSession = useCallback(() => {
    const confirmed =
      typeof window === 'undefined' ||
      window.confirm('Restart your session? This resets your hands played back to zero.')
    if (confirmed) handleReset()
  }, [handleReset])

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0
  const reportReady = score.total >= MIN_HANDS_FOR_REPORT
  const handsToGo = Math.max(0, MIN_HANDS_FOR_REPORT - score.total)

  return (
    <Box minH="100vh" bg="#0f161d" color="white" px="4" py="6">
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
            <Button
              onClick={handleRestartSession}
              disabled={score.total === 0}
              size="sm"
              borderRadius="10px"
              bg="whiteAlpha.100"
              color="whiteAlpha.800"
              fontWeight="700"
              _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
              _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            >
              <FiRefreshCw size={15} />
              Restart Session
            </Button>
            <Box
              as="button"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="38px"
              h="38px"
              borderRadius="10px"
              bg="whiteAlpha.100"
              color="whiteAlpha.800"
              _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
            >
              <FiSettings size={20} />
            </Box>
            <Box display="flex" alignItems="center">
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: { width: '38px', height: '38px' },
                  },
                }}
              />
            </Box>
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
              <Text fontSize="11px" color="whiteAlpha.500" mt="2">
                {formatLabel} · Rake: {rake.label}
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
                showNext={!settings.sonicMode}
                onNext={handleNext}
              />
              <FeedbackBanner result={result} scenario={scenario} />
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

      {showSettings ? (
        <SettingsModal
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      ) : null}
    </Box>
  )
}
