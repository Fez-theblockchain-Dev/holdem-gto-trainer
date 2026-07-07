import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export function AuthLayout({ title, subtitle, children }) {
  return (
    <Box minH="100vh" bg="#0f161d" color="white" px="4" py="10">
      <VStack maxW="480px" mx="auto" gap="6">
        <VStack gap="1" textAlign="center">
          <Box fontSize="32px">{'\u265F'}</Box>
          <Heading size="lg">Hold&apos;em GTO Trainer</Heading>
          <Text color="whiteAlpha.600" fontSize="sm">
            {title}
          </Text>
          {subtitle ? (
            <Text color="whiteAlpha.500" fontSize="xs">
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        <Box
          w="100%"
          bg="#16212b"
          border="1px solid #233241"
          borderRadius="16px"
          p="6"
          display="flex"
          justifyContent="center"
        >
          {children}
        </Box>
      </VStack>
    </Box>
  )
}
