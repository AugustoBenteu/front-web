import { Box, Text, VStack } from '@chakra-ui/react'

export default function DonationSteps() {
  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>Como doar</Text>
      <VStack spacing={3} align="start">
        <Text>1. Preencha o formulário</Text>
        <Text>2. Aguarde o contato da equipe</Text>
        <Text>3. Entregue o equipamento</Text>
      </VStack>
    </Box>
  )
}
