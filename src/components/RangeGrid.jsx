import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react'
import { ACTION_META, actionLabel, actionForKey, gridCells } from '../poker/ranges'

function Legend({ actions, scenario }) {
  return (
    <HStack gap="4" justify="center" wrap="wrap">
      {actions.map((a) => (
        <HStack key={a} gap="2">
          <Box w="12px" h="12px" borderRadius="3px" bg={ACTION_META[a].color} />
          <Text fontSize="12px" color="whiteAlpha.800">
            {actionLabel(a, scenario)}
          </Text>
        </HStack>
      ))}
    </HStack>
  )
}

export function RangeGrid({ scenario, strategy, currentKey }) {
  const cells = gridCells()

  return (
    <VStack gap="3" w="100%">
      <Text color="whiteAlpha.700" fontSize="13px" fontWeight="700" letterSpacing="0.5px">
        {scenario.title.toUpperCase()} — SOLUTION
      </Text>
      <Grid templateColumns="repeat(13, 1fr)" gap="2px" w="100%" maxW="430px">
        {cells.map(({ key }) => {
          const action = actionForKey(key, strategy, scenario)
          const isCurrent = key === currentKey
          return (
            <Box
              key={key}
              aspectRatio={1}
              bg={ACTION_META[action].color}
              opacity={action === 'fold' ? 0.5 : 1}
              border={isCurrent ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.25)'}
              borderRadius="2px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={isCurrent ? '0 0 10px rgba(255,255,255,0.9)' : 'none'}
              zIndex={isCurrent ? 1 : 0}
            >
              <Text fontSize="8px" fontWeight="700" color="whiteAlpha.900">
                {key}
              </Text>
            </Box>
          )
        })}
      </Grid>
      <Legend actions={scenario.actions} scenario={scenario} />
    </VStack>
  )
}
