import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Switch } from './ui/switch'

export function SettingsModal({ settings, onChange, onClose }) {
  return (
    <Box
      position="fixed"
      inset="0"
      bg="rgba(0,0,0,0.6)"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="4"
      onClick={onClose}
    >
      <Box
        bg="#16212b"
        border="1px solid #2a3b4a"
        borderRadius="16px"
        p="6"
        w="100%"
        maxW="440px"
        boxShadow="0 20px 60px rgba(0,0,0,0.6)"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justify="space-between" align="center" mb="5">
          <Heading size="md" color="white">
            Settings
          </Heading>
          <Box
            as="button"
            onClick={onClose}
            fontSize="22px"
            lineHeight="1"
            color="whiteAlpha.600"
            _hover={{ color: 'white' }}
            aria-label="Close settings"
          >
            {'\u00D7'}
          </Box>
        </Flex>

        <VStack align="stretch" gap="5">
          <Flex justify="space-between" align="start" gap="4">
            <Box>
              <Text fontWeight="800" color="white" fontSize="16px">
                Sonic Mode
              </Text>
              <Text fontSize="13px" color="whiteAlpha.600" mt="1">
                Immediately jump to the next hand the moment you make a decision — no feedback
                pause. Built for fast, high-volume drilling.
              </Text>
            </Box>
            <Switch
              checked={settings.sonicMode}
              onCheckedChange={(e) => onChange({ ...settings, sonicMode: e.checked })}
              colorPalette="orange"
            />
          </Flex>
        </VStack>
      </Box>
    </Box>
  )
}
