import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <Box minH="100vh" bg="#0f161d" display="flex" alignItems="center" justifyContent="center">
        <VStack gap="3">
          <Spinner color="#ffd27a" size="lg" />
          <Text color="whiteAlpha.700" fontSize="sm">
            Loading session…
          </Text>
        </VStack>
      </Box>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  return children
}
