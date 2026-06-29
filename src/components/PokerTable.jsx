import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { PlayingCard } from './PlayingCard'

function Seat({ label, sublabel, active }) {
  return (
    <VStack gap="1">
      <Flex
        w="58px"
        h="58px"
        borderRadius="full"
        align="center"
        justify="center"
        bg={active ? '#e0653a' : '#1c2733'}
        border="2px solid"
        borderColor={active ? '#ffb38a' : '#33485c'}
        boxShadow={active ? '0 0 18px rgba(224,101,58,0.6)' : 'none'}
      >
        <Text fontWeight="800" color="white" fontSize="15px">
          {label}
        </Text>
      </Flex>
      {sublabel ? (
        <Text fontSize="11px" color="whiteAlpha.700" fontWeight="600">
          {sublabel}
        </Text>
      ) : null}
    </VStack>
  )
}

function BetChip({ children }) {
  return (
    <Box
      px="3"
      py="1"
      borderRadius="full"
      bg="#11202c"
      border="1px solid #3a566b"
      color="#ffd27a"
      fontSize="12px"
      fontWeight="700"
    >
      {children}
    </Box>
  )
}

export function PokerTable({ scenario, cards }) {
  return (
    <Box position="relative" w="100%" maxW="720px" mx="auto" h="360px">
      {/* Felt */}
      <Box
        position="absolute"
        left="0"
        right="0"
        top="34px"
        mx="auto"
        w="92%"
        h="290px"
        borderRadius="150px"
        bg="radial-gradient(ellipse at center, #2f9c63 0%, #1f7146 68%, #185d3a 100%)"
        border="12px solid #2a1c12"
        boxShadow="inset 0 0 60px rgba(0,0,0,0.45), 0 18px 40px rgba(0,0,0,0.5)"
      />

      {/* Villain seat (top center) */}
      <Box position="absolute" top="0" left="50%" transform="translateX(-50%)" textAlign="center">
        {scenario.villain ? (
          <Seat label={scenario.villain} sublabel="Villain" active />
        ) : (
          <Seat label="--" sublabel="Folded to you" />
        )}
      </Box>

      {/* Villain bet + pot in the middle */}
      <VStack position="absolute" top="120px" left="50%" transform="translateX(-50%)" gap="2">
        {scenario.villainAction ? <BetChip>{scenario.villain} {scenario.villainAction}</BetChip> : null}
        <Text color="whiteAlpha.600" fontSize="12px" fontWeight="600" letterSpacing="0.5px">
          PREFLOP
        </Text>
      </VStack>

      {/* Hero seat (bottom center) */}
      <VStack position="absolute" bottom="0" left="50%" transform="translateX(-50%)" gap="2">
        <HStack gap="3">
          {cards.map((card, i) => (
            <PlayingCard key={`${card.rank}${card.suit}${i}`} card={card} size="lg" />
          ))}
        </HStack>
        <HStack gap="2">
          <Box
            px="3"
            py="1"
            borderRadius="full"
            bg="#e0653a"
            color="white"
            fontWeight="800"
            fontSize="13px"
          >
            {scenario.hero}
          </Box>
          <Text color="whiteAlpha.800" fontSize="12px" fontWeight="600">
            Hero
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}
