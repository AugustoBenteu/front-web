import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Flex,
  Button, Link, Divider
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

// Exemplo de dados (substitua pelo seu fetch/props)
const doacoes = [
  {
    id: 1,
    data: "12 de maio de 2024",
    titulo: "Dell XPS 13 Intel® Core™ i7-1360P 13ª geração, 16GB e 1TB SSD",
    descricao:
      "Notebook em perfeito estado, com poucos arranhões de uso. Possui sistema operacional linux (Ubuntu) instalado e está pronto para uso.",
    fotos: [null, null, null, null], // Substitua null por URLs reais se houver fotos
  },
  {
    id: 2,
    data: "1 de abril de 2021",
    titulo: "PC da Xuxa",
    descricao:
      "Notebook em perfeito estado, com poucos arranhões de uso. Possui sistema operacional linux (Ubuntu) instalado e está pronto para uso.",
    fotos: [], // Sem fotos
  },
  // ...mais doações
];

export default function DoacoesHistorico({ doacoesList = doacoes }) {
  return (
    <Box bg="gray.50" minH="100vh" >
        {/* Navbar */}
      <Flex
        as="nav"
        bg="white"
        px={8}
        py={4}
        justify="space-between"
        align="center"
        boxShadow="sm"
        mb={8}
      >
        <Text fontWeight="bold" fontSize="lg" color="textColors.default">
          [doa]Unifei
        </Text>
        <HStack spacing={4} align="center">
          <Link as={RouterLink} to="/suas-doacoes" variant="nav">
            Suas doações
          </Link>
          <Link as={RouterLink} to="/lista-espera" variant="nav">
            Lista de espera
          </Link>
          <Divider
            orientation="vertical"
            h="20px"
            borderColor="ui.inputBorder"
          />
          <Button
            size="sm"
            variant="outlineNeutral"
            as={RouterLink}
            to="/receber"
          >
            Receber
          </Button>
          <Button size="sm" variant="solidBrand" as={RouterLink} to="/doar">
            Doar
          </Button>
        </HStack>
      </Flex>
      <Box maxW="3xl" mx="auto">
        <Heading size="lg" textAlign="center" mb={2}>
          Suas doações
        </Heading>
        <Text textAlign="center" color="gray.600" mb={8}>
          Esse é o seu histórico de doações completas para você se orgulhar
        </Text>
        <Box
          maxH="70vh"
          overflowY="auto"
          pr={2}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { bg: "gray.200", borderRadius: "full" },
          }}
        >
          <VStack spacing={6} align="stretch">
            {doacoesList.map((doacao) => (
              <Box
                key={doacao.id}
                bg="white"
                rounded="md"
                boxShadow="md"
                p={6}
                mb={2}
              >
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Doação concluída no dia {doacao.data}
                </Text>
                {doacao.fotos && doacao.fotos.length > 0 && (
                  <SimpleGrid columns={[2, 4]} spacing={4} mb={4}>
                    {doacao.fotos.map(
                      (foto, idx) =>
                        foto && (
                          <Image
                            key={idx}
                            src={foto}
                            alt={`Foto ${idx + 1}`}
                            objectFit="cover"
                            borderRadius="md"
                            boxSize="100px"
                            bg="gray.100"
                          />
                        )
                    )}
                  </SimpleGrid>
                )}
                <Text fontWeight="bold" fontSize="md" mb={1}>
                  {doacao.titulo}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {doacao.descricao}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}