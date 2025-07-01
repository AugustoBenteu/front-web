import {
    Box, Button, Container, FormControl, FormLabel, Heading, Input, Link,
    Text, VStack, HStack, Flex, Divider, useToast, Spinner
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { criarPedido, getCursos, getMeusPedidos } from '../services/apiService';

export default function ListaEsperaSteps() {
    const toast = useToast();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        nome: '',
        matricula: '',
        ano_ingresso: '',
        curso: ''
    });

    const [loading, setLoading] = useState(true);
    const [jaTemPedido, setJaTemPedido] = useState(false);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                const matricula = localStorage.getItem('matricula');
                const usuarioSalvoString = localStorage.getItem('userData');

                if (!authToken || !matricula || !usuarioSalvoString) {
                    toast({
                        title: 'Erro de Autenticação',
                        description: 'Dados do usuário não encontrados. Faça login novamente.',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                    navigate('/login');
                    return;
                }

                // 1. Valida se já existe um pedido
                const pedidosExistentes = await getMeusPedidos(matricula, authToken);

                if (pedidosExistentes && pedidosExistentes.length > 0) {
                    // Se já existe, atualiza o estado para mostrar a mensagem
                    setJaTemPedido(true);
                } else {
                    // Se não existe, carrega os dados para preencher o formulário
                    const usuarioSalvo = JSON.parse(usuarioSalvoString);
                    const listaCursos = await getCursos(authToken);
                    const cursoDoUsuario = listaCursos.find((c) => c.id === usuarioSalvo.id_curso);

                    setUsuario({
                        nome: usuarioSalvo.nome,
                        matricula: usuarioSalvo.matricula,
                        ano_ingresso: String(usuarioSalvo.ano_ingresso),
                        curso: cursoDoUsuario ? cursoDoUsuario.nome : 'Não informado'
                    });
                }
            } catch (error) {
                toast({
                    title: 'Erro ao carregar dados.',
                    description: 'Não foi possível buscar as informações necessárias.',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        carregarDadosIniciais();
    }, [toast, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
            const matricula = localStorage.getItem('matricula');

            if (!authToken || !matricula) {
                throw new Error("Usuário não autenticado.");
            }

            await criarPedido({ id_usuario: matricula }, authToken);

            toast({
                title: 'Você entrou na fila!',
                description: 'Seu pedido foi registrado. Acompanhe o status pela página da lista de espera.',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });

            navigate('/lista-espera');
        } catch (error) {
            toast({
                title: 'Erro ao enviar pedido.',
                description: 'Não foi possível registrar seu pedido. Tente novamente.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
    };

    // Componente para renderizar a mensagem de "Já está na fila"
    const RenderJaInscrito = () => (
        <VStack spacing={6} textAlign="center">
            <Heading size="lg" fontWeight="medium">Você já está na fila!</Heading>
            <Text fontSize="lg" color="gray.600">
                Seu pedido já foi registrado. Você pode acompanhar o andamento na página da lista de espera.
            </Text>
            <Button
                as={RouterLink}
                to="/lista-espera"
                colorScheme="purple"
                size="lg"
                px={10}
            >
                Ver meu status na fila
            </Button>
        </VStack>
    );

    // Componente para renderizar o formulário
    const RenderFormulario = () => (
        <Box bg="white" p={8} rounded="md" boxShadow="md" w="full" maxW="lg">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                    <Heading size="md" mb={2}>Entrar na fila de espera</Heading>
                    <Text fontSize="sm" color="gray.600">
                        A fila de espera é o primeiro destino dos computadores doados. Confirme as informações para entrar.
                    </Text>
                    <FormControl>
                        <FormLabel>Nome completo</FormLabel>
                        <Input isDisabled value={usuario.nome} bg="gray.100" />
                    </FormControl>
                    <HStack spacing={4}>
                        <FormControl>
                            <FormLabel>N° de matrícula</FormLabel>
                            <Input isDisabled value={usuario.matricula} bg="gray.100" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Ano de ingresso</FormLabel>
                            <Input isDisabled value={usuario.ano_ingresso} bg="gray.100" />
                        </FormControl>
                    </HStack>
                    <FormControl>
                        <FormLabel>Curso</FormLabel>
                        <Input isDisabled value={usuario.curso} bg="gray.100" />
                    </FormControl>
                    <Button type="submit" colorScheme='purple' w="full" mt={4}>
                        Confirmar e entrar na fila
                    </Button>
                    <Text fontSize="xs" color="gray.500" textAlign="center" pt={2}>
                        Ao continuar você concorda com o processamento dos seus dados para sua identificação e análise do seu perfil socioeconômico.
                    </Text>
                </VStack>
            </form>
        </Box>
    );

    return (
        <Box bg="gray.50" minH="100vh">
            <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" color="textColors.default">[doa]Unifei</Text>
                <HStack spacing={4} align="center">
                    <Link as={RouterLink} to="/suas-doacoes" variant="nav">Suas doações</Link>
                    <Link as={RouterLink} to="/lista-espera" variant="nav">Lista de espera</Link>
                    <Divider orientation="vertical" h="20px" borderColor="gray.200" />
                    <Button size="sm" variant="outline" as={RouterLink} to="/lista-espera-steps">Receber</Button>
                    <Button size="sm" colorScheme="purple" as={RouterLink} to="/doar">Doar</Button>
                </HStack>
            </Flex>

            <Container centerContent py={{ base: 10, md: 20 }}>
                {loading ? (
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                ) : jaTemPedido ? (
                    <RenderJaInscrito />
                ) : (
                    <RenderFormulario />
                )}
            </Container>
        </Box>
    );
}