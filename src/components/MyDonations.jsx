import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Flex,
  Button, Link, Divider,useToast
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';
import { getComputadores } from "../services/apiService";
import { useState, useEffect } from 'react';

export default function DoacoesHistorico() {
  const [doacoes, setDoacoes] = useState([]); // Adicione este estado
  const toast = useToast();

    // Carregue os cursos com useEffect
    useEffect(() => {
      async function fetchComputadores() {
        try {
          console.log('Carregando computadores...');
          const matricula_usuario = localStorage.getItem('matricula');
          const authToken = localStorage.getItem('authToken');
          const computadoresData = await getComputadores(matricula_usuario,authToken);
          console.log('computadoresData', computadoresData);
          setDoacoes(computadoresData);
        } catch (error) {
          toast({
            title: 'Erro ao carregar computadores',
            description: 'Não foi possível carregar a lista de computadores.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
      fetchComputadores();
    }, [toast]);


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
            to="/lista-espera-steps"
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
            {doacoes != undefined && doacoes.map((doacao) => (
              <Box
                key={doacao.id}
                bg="white"
                rounded="md"
                boxShadow="md"
                p={6}
                mb={2}
              >
                {/* <Text fontSize="sm" color="gray.500" mb={2}>
                  Doação concluída no dia {doacao.ano}
                </Text> */}
                {/* {doacao.fotos && doacao.fotos.length > 0 && (
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
                )} */}
                <Text fontWeight="bold" fontSize="md" mb={1}>
                  {doacao.marca} {doacao.modelo} {doacao.processador} {doacao.ram} {doacao.armazenamento}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {doacao.detalhes}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
