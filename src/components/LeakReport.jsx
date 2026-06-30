import { useMemo } from 'react'
import { Box, Button, Flex, Grid, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { ACTION_META } from '../poker/ranges'
import { analyzeHistory, reportToText, MIN_HANDS_FOR_REPORT } from '../poker/analysis'

function StatCard({ label, value, accent }) {
  return (
    <VStack
      bg="#11202c"
      border="1px solid #233241"
      borderRadius="12px"
      px="4"
      py="3"
      gap="0"
      align="start"
      minW="120px"
    >
      <Text fontSize="11px" color="whiteAlpha.600" fontWeight="700" letterSpacing="0.5px">
        {label}
      </Text>
      <Text fontSize="26px" fontWeight="800" color={accent ?? 'white'}>
        {value}
      </Text>
    </VStack>
  )
}

function TendencyBars({ userCounts, gtoCounts, total }) {
  return (
    <VStack align="stretch" gap="3" w="100%">
      {['raise', 'call', 'fold'].map((action) => {
        const userPct = total ? Math.round((userCounts[action] / total) * 100) : 0
        const gtoPct = total ? Math.round((gtoCounts[action] / total) * 100) : 0
        return (
          <Box key={action}>
            <Flex justify="space-between" mb="1">
              <Text fontSize="13px" fontWeight="700" color="white">
                {ACTION_META[action].label}
              </Text>
              <Text fontSize="12px" color="whiteAlpha.700">
                You {userPct}% · GTO {gtoPct}%
              </Text>
            </Flex>
            <Box position="relative" h="10px" bg="whiteAlpha.200" borderRadius="full">
              {/* GTO marker */}
              <Box
                position="absolute"
                top="-3px"
                bottom="-3px"
                left={`${gtoPct}%`}
                w="2px"
                bg="white"
                zIndex={1}
              />
              {/* User fill */}
              <Box
                h="100%"
                w={`${userPct}%`}
                bg={ACTION_META[action].color}
                borderRadius="full"
              />
            </Box>
          </Box>
        )
      })}
      <Text fontSize="11px" color="whiteAlpha.500">
        Bar = your frequency · white line = solver frequency
      </Text>
    </VStack>
  )
}

export function LeakReport({ history, onClose, onReset }) {
  const report = useMemo(() => analyzeHistory(history), [history])

  const handleSave = () => {
    const text = reportToText(report)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `holdem-leak-report-${report.total}-hands.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const enoughHands = report.total >= MIN_HANDS_FOR_REPORT

  return (
    <VStack align="stretch" gap="5">
      <Flex justify="space-between" align="center" wrap="wrap" gap="3">
        <Heading size="md" color="white">
          Leak Report
        </Heading>
        <HStack gap="2">
          <Button
            onClick={handleSave}
            bg="#ffd27a"
            color="#0f161d"
            fontWeight="800"
            size="sm"
            borderRadius="10px"
            _hover={{ filter: 'brightness(0.92)' }}
          >
            Save report (.txt)
          </Button>
          {onClose ? (
            <Button
              onClick={onClose}
              variant="outline"
              borderColor="#33485c"
              color="white"
              size="sm"
              borderRadius="10px"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              Back to training
            </Button>
          ) : null}
        </HStack>
      </Flex>

      {!enoughHands ? (
        <Box
          bg="rgba(255,210,122,0.12)"
          border="1px solid #6b5a2a"
          borderRadius="12px"
          px="5"
          py="4"
        >
          <Text color="#ffd27a" fontWeight="700">
            Keep playing — full leak analysis unlocks at {MIN_HANDS_FOR_REPORT} hands.
          </Text>
          <Text color="whiteAlpha.700" fontSize="14px" mt="1">
            You have played {report.total}. The summary below is preliminary and will get more
            reliable as you play more.
          </Text>
        </Box>
      ) : null}

      {/* Headline stats */}
      <HStack gap="3" wrap="wrap">
        <StatCard label="HANDS" value={report.total} />
        <StatCard
          label="ACCURACY"
          value={`${report.accuracy}%`}
          accent={report.accuracy >= 70 ? '#7ee2a4' : report.accuracy >= 50 ? '#ffd27a' : '#ff9b9b'}
        />
        <StatCard label="CORRECT" value={report.correct} />
        <StatCard label="MISTAKES" value={report.total - report.correct} />
      </HStack>

      {/* Tendencies */}
      <Box bg="#16212b" border="1px solid #233241" borderRadius="14px" p="5">
        <Text fontSize="13px" fontWeight="800" color="white" mb="3" letterSpacing="0.5px">
          ACTION TENDENCIES
        </Text>
        <TendencyBars
          userCounts={report.userCounts}
          gtoCounts={report.gtoCounts}
          total={report.total}
        />
        {report.tendencies.length > 0 ? (
          <VStack align="start" gap="1" mt="4">
            {report.tendencies.map((t) => (
              <Text key={t.action} fontSize="14px" color="#ff9b9b">
                • {t.text}
              </Text>
            ))}
          </VStack>
        ) : (
          <Text fontSize="14px" color="#7ee2a4" mt="4">
            • Well balanced — no major over/under-use of any action.
          </Text>
        )}
      </Box>

      {/* Top leaks */}
      <Box bg="#16212b" border="1px solid #233241" borderRadius="14px" p="5">
        <Text fontSize="13px" fontWeight="800" color="white" mb="3" letterSpacing="0.5px">
          TOP LEAKS
        </Text>
        {report.leaks.length === 0 ? (
          <Text color="#7ee2a4">No mistakes recorded yet. Flawless!</Text>
        ) : (
          <VStack align="stretch" gap="3">
            {report.leaks.slice(0, 5).map((leak, i) => (
              <Box
                key={leak.key}
                bg="#11202c"
                border="1px solid #2a3b4a"
                borderRadius="10px"
                p="3"
              >
                <Flex justify="space-between" align="center" gap="3">
                  <Text fontWeight="700" color="white" fontSize="14px">
                    {i + 1}. {leak.label}
                  </Text>
                  <Text fontSize="12px" color="whiteAlpha.600" whiteSpace="nowrap">
                    {leak.count}× · {leak.sharePct}%
                  </Text>
                </Flex>
                {leak.tip ? (
                  <Text fontSize="13px" color="whiteAlpha.700" mt="1">
                    {leak.tip}
                  </Text>
                ) : null}
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Per scenario */}
      <Box bg="#16212b" border="1px solid #233241" borderRadius="14px" p="5">
        <Text fontSize="13px" fontWeight="800" color="white" mb="3" letterSpacing="0.5px">
          PERFORMANCE BY SCENARIO
        </Text>
        <Grid templateColumns="1fr auto" gap="2" alignItems="center">
          {report.scenarios.map((s) => (
            <Box key={s.id} display="contents">
              <Text fontSize="14px" color="whiteAlpha.900">
                {s.title}
              </Text>
              <Text
                fontSize="14px"
                fontWeight="700"
                textAlign="right"
                color={s.accuracy >= 70 ? '#7ee2a4' : s.accuracy >= 50 ? '#ffd27a' : '#ff9b9b'}
              >
                {s.accuracy}% ({s.correct}/{s.total})
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      {onReset ? (
        <Flex justify="center">
          <Button
            onClick={onReset}
            variant="ghost"
            color="whiteAlpha.600"
            size="sm"
            _hover={{ color: '#ff9b9b', bg: 'whiteAlpha.50' }}
          >
            Reset all stats
          </Button>
        </Flex>
      ) : null}
    </VStack>
  )
}
