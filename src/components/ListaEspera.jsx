import {
    Box, Button, Container, Heading, Text, VStack, Flex,
    Link, Divider, useToast, Spinner, Alert, AlertIcon, HStack
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMeusPedidos } from '../services/apiService';

export default function ListaEspera() {
    const toast = useToast();
    const navigate = useNavigate();

    // Estados do componente
    const [pedido, setPedido] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatusDoPedido = async () => {
            setLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                const matricula = localStorage.getItem('matricula');

                if (!authToken || !matricula) {
                    toast({
                        title: 'Autenticação necessária',
                        description: 'Você precisa fazer login para ver seu status.',
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate('/login'); 
                    return;
                }
                

                const pedidosDoUsuario = await getMeusPedidos(matricula, authToken);
                
                if (pedidosDoUsuario && pedidosDoUsuario.length > 0) {
                    setPedido(pedidosDoUsuario[0]);
                } else {
                    setPedido(null);
                }

            } catch (error) {
                console.error("Erro ao buscar status do pedido:", error);
                toast({
                    title: 'Erro de comunicação',
                    description: 'Não foi possível verificar seu status na fila. Tente novamente mais tarde.',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatusDoPedido();
    }, [toast, navigate]);

    const RenderLoading = () => (
        <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" thickness="4px" speed="0.65s" />
            <Text fontSize="lg" color="gray.600">Verificando seu status na fila...</Text>
        </VStack>
    );

    // Sub-componente para quando o usuário NÃO está na fila.
    const RenderNaoInscrito = () => (
        <VStack spacing={6} textAlign="center" maxW="lg">
            <Heading size="lg" fontWeight="medium">Lista de espera</Heading>
            <Text fontSize="lg" color="gray.600">
                Você não está na lista de espera por uma doação no momento.
            </Text>
            <Button
                as={RouterLink}
                to="/lista-espera-steps" 
                colorScheme="purple"
                size="lg"
                px={10}
            >
                Entrar na lista de espera
            </Button>
        </VStack>
    );

    // Sub-componente para quando o usuário ESTÁ na fila.
    const RenderInscrito = () => (
        <VStack spacing={6} textAlign="center" maxW="xl">
            <Heading size="lg" fontWeight="medium">Lista de espera</Heading>
            
            {/* Renderização condicional baseada na prioridade do pedido */}
            {pedido && pedido.prioridade > 0 ? (
                // Cenário 1: Usuário priorizado
                <>
                    <Text fontSize="lg" color="gray.700">Você está cadastrado na lista de espera e já foi priorizado!</Text>
                    <Text fontSize="md">Sua prioridade, definida conforme sua avaliação socioeconômica, é <Text as="b">imediata</Text>.</Text>
                    <Alert status="success" borderRadius="md" variant="subtle">
                        <AlertIcon />
                        <Box>
                            <Text>Prioridade <Text as="b">imediata</Text> significa que você está entre os primeiros na lista para receber uma doação.</Text>
                        </Box>
                    </Alert>
                </>
            ) : (
                // Cenário 2: Usuário aguardando avaliação
                <>
                    <Text fontSize="lg" color="gray.700">Você está cadastrado na lista de espera!</Text>
                    <Text fontSize="md">Seu status atual é <Text as="b">aguardando avaliação socioeconômica</Text>.</Text>
                </>
            )}
        </VStack>
    );

    // Estrutura principal do componente.
    return (
        <Box bg="gray.50" minH="100vh">
            <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" color="textColors.default">[doa]Unifei</Text>
                <HStack spacing={4} align="center">
                    <Link as={RouterLink} to="/suas-doacoes" variant="nav">Suas doações</Link>
                    <Link as={RouterLink} to="/lista-espera" variant="nav">Lista de espera</Link>
                    <Divider orientation="vertical" h="20px" borderColor="gray.200" />
                    <Button size="sm" variant="outline" as={RouterLink} to="/lista-espera-steps">Receber</Button>
                    <Button size="sm" colorScheme="purple" as={RouterLink} to="/donation-steps">Doar</Button>
                </HStack>
            </Flex>

            <Container centerContent py={{ base: 20, md: 40 }} minH="60vh">
                {/* Lógica principal de renderização condicional */}
                {loading ? <RenderLoading /> : (pedido ? <RenderInscrito /> : <RenderNaoInscrito />)}
            </Container>
        </Box>
    );
}
