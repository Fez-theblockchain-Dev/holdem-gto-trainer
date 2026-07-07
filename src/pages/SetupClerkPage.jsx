import { Box, Code, Heading, Link, Text, VStack } from '@chakra-ui/react'

export function SetupClerkPage() {
  return (
    <Box minH="100vh" bg="#0f161d" color="white" px="4" py="12">
      <VStack maxW="560px" mx="auto" gap="4" align="stretch">
        <Heading size="lg">Authentication not configured</Heading>
        <Text color="whiteAlpha.800">
          This app uses{' '}
          <Link href="https://clerk.com" color="#ffd27a" target="_blank" rel="noreferrer">
            Clerk
          </Link>{' '}
          (the same provider commonly used with Next.js). Add your publishable key to enable sign-in.
        </Text>
        <Box bg="#16212b" border="1px solid #233241" borderRadius="12px" p="4">
          <Text fontSize="sm" color="whiteAlpha.700" mb="2">
            1. Create a free app at{' '}
            <Link href="https://dashboard.clerk.com" color="#ffd27a" target="_blank" rel="noreferrer">
              dashboard.clerk.com
            </Link>
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mb="2">
            2. Copy <Code color="#ffd27a">.env.example</Code> to <Code color="#ffd27a">.env.local</Code>
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mb="2">
            3. Set{' '}
            <Code color="#ffd27a">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</Code>
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700">
            4. In Clerk → Paths, set sign-in URL to <Code>/sign-in</Code> and sign-up to{' '}
            <Code>/sign-up</Code>, then restart <Code>npm run dev</Code>
          </Text>
        </Box>
        <Text fontSize="sm" color="whiteAlpha.500">
          On Vercel: install Clerk from the Marketplace or add the same env var under Project Settings.
        </Text>
      </VStack>
    </Box>
  )
}
