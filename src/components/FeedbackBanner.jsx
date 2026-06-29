import { Box, Text } from '@chakra-ui/react'
import { ACTION_META } from '../poker/ranges'

export function FeedbackBanner({ result }) {
  if (!result) {
    return (
      <Box h="64px" display="flex" alignItems="center" justifyContent="center">
        <Text color="whiteAlpha.600" fontSize="15px">
          Select the GTO action for your hand.
        </Text>
      </Box>
    )
  }

  const correctLabel = ACTION_META[result.correctAction].label

  return (
    <Box
      h="64px"
      px="6"
      borderRadius="12px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bg={result.correct ? 'rgba(47,158,84,0.18)' : 'rgba(178,59,59,0.18)'}
      border="1px solid"
      borderColor={result.correct ? '#2f9e54' : '#b23b3b'}
    >
      <Text
        color={result.correct ? '#7ee2a4' : '#ff9b9b'}
        fontSize="17px"
        fontWeight="800"
      >
        {result.correct
          ? 'Great job, that was the right decision!'
          : `Not quite \u2014 the GTO play here is ${correctLabel}.`}
      </Text>
    </Box>
  )
}
