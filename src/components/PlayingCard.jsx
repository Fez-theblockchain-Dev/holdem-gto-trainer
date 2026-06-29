import { Box, Text } from '@chakra-ui/react'
import { SUIT_SYMBOL, SUIT_COLOR, displayRank } from '../poker/cards'

const SIZES = {
  lg: { w: '74px', h: '104px', rank: '32px', sym: '20px', center: '34px' },
  sm: { w: '42px', h: '60px', rank: '18px', sym: '12px', center: '20px' },
}

export function PlayingCard({ card, size = 'lg' }) {
  const dims = SIZES[size] ?? SIZES.lg
  const color = SUIT_COLOR[card.suit]
  const symbol = SUIT_SYMBOL[card.suit]

  return (
    <Box
      position="relative"
      w={dims.w}
      h={dims.h}
      bg="white"
      borderRadius="10px"
      boxShadow="0 8px 18px rgba(0,0,0,0.45)"
      border="1px solid rgba(0,0,0,0.12)"
      flexShrink={0}
    >
      <Text
        position="absolute"
        top="5px"
        left="8px"
        lineHeight="1"
        fontWeight="800"
        color={color}
        fontSize={dims.rank}
      >
        {displayRank(card.rank)}
      </Text>
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        lineHeight="1"
        color={color}
        fontSize={dims.center}
        opacity={0.95}
      >
        {symbol}
      </Text>
      <Text
        position="absolute"
        bottom="5px"
        right="8px"
        lineHeight="1"
        color={color}
        fontSize={dims.sym}
      >
        {symbol}
      </Text>
    </Box>
  )
}
