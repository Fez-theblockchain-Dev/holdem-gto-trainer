import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { dealHoleCards, handToKey, displayRank, SUIT_SYMBOL } from './poker/cards'
import { SCENARIOS, getStrategy, actionForKey } from './poker/ranges'
import { PokerTable } from './components/PokerTable'
import { ActionButtons } from './components/ActionButtons'
import { FeedbackBanner } from './components/FeedbackBanner'
import { RangeGrid } from './components/RangeGrid'

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
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const { scenario, cards, handKey } = hand
  const strategy = useMemo(() => getStrategy(scenario), [scenario])

  const handleSelect = useCallback(
    (action) => {
      if (result) return
      const correctAction = actionForKey(handKey, strategy, scenario)
      const correct = action === correctAction
      setResult({ chosen: action, correctAction, correct })
      setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    },
    [result, handKey, strategy, scenario],
  )

  const handleNext = useCallback(() => {
    setHand(newHand())
    setResult(null)
  }, [])

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0

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
          </HStack>
        </Flex>

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
          />
          <FeedbackBanner result={result} />
          {result ? (
            <Button
              onClick={handleNext}
              bg="white"
              color="#0f161d"
              fontWeight="800"
              h="48px"
              px="8"
              borderRadius="12px"
              _hover={{ filter: 'brightness(0.92)' }}
            >
              Next Hand →
            </Button>
          ) : null}
        </VStack>

        {/* Solution grid (revealed after answering) */}
        {result ? (
          <Box bg="#16212b" border="1px solid #233241" borderRadius="16px" py="6" px="4">
            <RangeGrid scenario={scenario} strategy={strategy} currentKey={handKey} />
          </Box>
        ) : null}

        <Text fontSize="11px" color="whiteAlpha.400" textAlign="center">
          Ranges are simplified 100bb approximations for training, not exact solver output.
        </Text>
      </VStack>
    </Box>
  )
}
