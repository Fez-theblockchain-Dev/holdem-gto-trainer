import { Button, HStack } from '@chakra-ui/react'
import { ACTION_META, actionLabel } from '../poker/ranges'

export function ActionButtons({ actions, onSelect, answered, chosen, correctAction, scenario }) {
  return (
    <HStack gap="4" justify="center" wrap="wrap">
      {actions.map((action) => {
        const meta = ACTION_META[action]
        const label = actionLabel(action, scenario)
        const isChosen = chosen === action
        const isCorrect = correctAction === action

        // Default look
        let bg = meta.color
        let opacity = 1
        let ring = 'none'

        if (answered) {
          if (isCorrect) {
            bg = '#2f9e54' // highlight the GTO answer in green
            ring = '0 0 0 3px rgba(255,255,255,0.85)'
          } else if (isChosen) {
            bg = '#b23b3b' // the (wrong) pick the user made
          } else {
            opacity = 0.4
          }
        }

        return (
          <Button
            key={action}
            onClick={() => onSelect(action)}
            disabled={answered}
            bg={bg}
            color="white"
            opacity={opacity}
            minW="130px"
            h="52px"
            fontSize="16px"
            fontWeight="800"
            borderRadius="12px"
            boxShadow={ring}
            _hover={{ filter: answered ? 'none' : 'brightness(1.1)' }}
            _disabled={{ cursor: 'default' }}
          >
            {label}
          </Button>
        )
      })}
    </HStack>
  )
}
