import {
    Box, Button, Container, Heading, Text, VStack, Flex,
    Link, Divider, useToast, Spinner, Alert, AlertIcon, HStack,
    SimpleGrid,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMeusPedidos, getComputadorById, getPontoColetaById } from '../services/apiService';

export default function ListaEspera() {
    const toast = useToast();
    const navigate = useNavigate();

    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);

    const [computador, setComputador] = useState(null);
    const [pontoColeta, setPontoColeta] = useState(null);
    const [detalhesLoading, setDetalhesLoading] = useState(false);

    // Efeito 1: Busca o pedido principal do usuário
    useEffect(() => {
        const fetchStatusDoPedido = async () => {
            setLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                const matricula = localStorage.getItem('matricula');

                if (!authToken || !matricula) {
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
                toast({ title: 'Erro de comunicação', description: 'Não foi possível verificar seu status.', status: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchStatusDoPedido();
    }, [toast, navigate]);

    // Efeito 2: Busca os detalhes (computador e ponto de coleta) se o pedido for aprovado
    useEffect(() => {
        const fetchDetalhesDaDoacao = async () => {
            // Roda apenas se tivermos um pedido aprovado com os IDs necessários
            if (pedido && pedido.status === true && pedido.id_computador && pedido.id_ponto_entrega) {
                setDetalhesLoading(true);
                try {
                    const authToken = localStorage.getItem('authToken');

                    // Busca os dados em paralelo para mais eficiência
                    const [computadorData, pontoColetaData] = await Promise.all([
                        getComputadorById(pedido.id_computador, authToken),
                        getPontoColetaById(pedido.id_ponto_entrega, authToken)
                    ]);

                    setComputador(computadorData);
                    setPontoColeta(pontoColetaData);

                } catch (error) {
                    console.error("Erro ao buscar detalhes da doação:", error);
                    toast({ title: 'Erro', description: 'Não foi possível carregar os detalhes da sua doação.', status: 'error' });
                } finally {
                    setDetalhesLoading(false);
                }
            }
        };

        fetchDetalhesDaDoacao();
    }, [pedido, toast]);

    const RenderLoading = () => (
        <VStack spacing={4}><Spinner size="xl" color="purple.500" thickness="4px" /><Text fontSize="lg" color="gray.600">Verificando seu status...</Text></VStack>
    );

    const RenderNaoInscrito = () => (
        <VStack spacing={6} textAlign="center">
            <Heading size="lg" fontWeight="medium">Lista de espera</Heading>
            <Text fontSize="lg" color="gray.600">Você não está na lista de espera no momento.</Text>
            <Button as={RouterLink} to="/lista-espera-steps" colorScheme="purple" size="lg" px={10}>Entrar na lista de espera</Button>
        </VStack>
    );

    const RenderInscrito = () => {
        if (pedido.status === true) {
            if (detalhesLoading || !computador || !pontoColeta) {
                return <RenderLoading />; // Mostra loading enquanto busca os detalhes
            }
            return (
                <VStack spacing={8} w="full" maxW="4xl">
                    <Box textAlign="center">
                        <Heading size="lg">Parabéns, você recebeu uma doação!</Heading>
                        <Text mt={2} fontSize="lg" color="gray.600">Dirija-se ao ponto de coleta no campus para buscar seu computador.</Text>
                    </Box>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
                        <Box bg="white" p={6} rounded="lg" boxShadow="md">
                            <VStack align="start" spacing={4}>
                                <Heading size="md">{computador.marca} {computador.modelo}</Heading>
                                <Text color="gray.600">{computador.detalhes || "Computador pronto para uso."}</Text>
                                <Alert status="success" borderRadius="md"><AlertIcon />Computador testado e aprovado na avaliação técnica.</Alert>
                            </VStack>
                        </Box>
                        <Box bg="white" p={6} rounded="lg" boxShadow="md">
                            <VStack align="start" spacing={4}>
                                <Heading size="md">{pontoColeta.nome}</Heading>
                                <Text color="gray.600">Este é o local para receber sua doação. Você será relembrado por e-mail.</Text>
                            </VStack>
                        </Box>
                    </SimpleGrid>
                </VStack>
            );
        }

        if (pedido.status === false) {
            return (
                <VStack spacing={6} textAlign="center" maxW="xl">
                    <Heading size="lg" fontWeight="medium">Pedido Negado</Heading>
                    <Text fontSize="lg" color="gray.600">Sua solicitação não foi aprovada no momento.</Text>
                    <Alert status="error" borderRadius="md" variant="subtle"><AlertIcon />Você poderá tentar novamente no próximo ciclo de doações.</Alert>
                </VStack>
            );
        }

        if (pedido.status === null) {
            if (pedido.prioridade > 0) {
                return (
                    <VStack spacing={6} textAlign="center" maxW="xl">
                        <Heading size="lg" fontWeight="medium">Lista de espera</Heading>
                        <Text fontSize="lg" color="gray.700">Você está cadastrado e já foi priorizado!</Text>
                        <Text fontSize="md">Sua prioridade é <Text as="b">imediata</Text>.</Text>
                        <Alert status="warning" borderRadius="md" bg="yellow.50"><AlertIcon color="yellow.500" />Isto significa que você está entre os primeiros da fila para receber uma doação.</Alert>
                    </VStack>
                );
            }
            return (
                <VStack spacing={6} textAlign="center" maxW="xl">
                    <Heading size="lg" fontWeight="medium">Lista de espera</Heading>
                    <Text fontSize="lg" color="gray.700">Você está cadastrado!</Text>
                    <Text fontSize="md">Seu status atual é <Text as="b">aguardando avaliação socioeconômica</Text>.</Text>
                </VStack>
            );
        }
        return <Text>Status do pedido desconhecido.</Text>;
    };

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
            <Container centerContent py={{ base: 10, md: 20 }} maxW="4xl">
                {loading ? <RenderLoading /> : (pedido ? <RenderInscrito /> : <RenderNaoInscrito />)}
            </Container>
        </Box>
    );
}