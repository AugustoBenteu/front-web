import {
  Box, Button, Container, FormControl, FormLabel, Heading, Input, Link,
  Text, VStack, Select, HStack, Flex, Divider, useToast, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react'; // Adicionado useEffect
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { criarContaApi, getCursos } from '../services/apiService';

export default function CriarContaSteps() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    matricula: '',
    anoIngresso: new Date().getFullYear().toString(),
    id_curso: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cursos, setCursos] = useState([]); // Adicione este estado

  // Carregue os cursos com useEffect
  useEffect(() => {
    async function fetchCursos() {
      try {
        const cursosData = await getCursos();
        setCursos(cursosData);
      } catch (error) {
        toast({
          title: 'Erro ao carregar cursos',
          description: 'Não foi possível carregar a lista de cursos.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
    fetchCursos();
  }, [toast]);
      

  // Efeito para carregar os dados da rota no estado do formulário
  useEffect(() => {
    if (location.state && location.state.email && location.state.senha) {
      setFormData(prevData => ({
        ...prevData,
        email: location.state.email,
        senha: location.state.senha,
      }));
    } else {
      toast({
        title: 'Dados Incompletos',
        description: 'Por favor, inicie o cadastro pela primeira etapa.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/criar-conta');
    }
  }, [location.state, navigate, toast]);


  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAnoIngressoChange = (valueAsString, valueAsNumber) => {
    setFormData(prev => ({ ...prev, anoIngresso: valueAsString }));
  };

  const isFormValid =
    formData.nome.trim() !== '' &&
    formData.matricula.trim() !== '' &&
    formData.anoIngresso.trim() !== '' &&
    formData.id_curso.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.senha.trim() !== '';


  const handleSubmit = async () => {
    setIsLoading(true);

    // Validações dos campos numéricos
    const anoIngressoNum = parseInt(formData.anoIngresso, 10);
    const idCursoNum = parseInt(formData.id_curso, 10);

    if (isNaN(anoIngressoNum) || formData.anoIngresso.trim() === '') {
      toast({ title: 'Erro de Dados', description: 'Ano de ingresso inválido.', status: 'error', duration: 5000, isClosable: true });
      setIsLoading(false); return;
    }
    if (isNaN(idCursoNum) || formData.id_curso.trim() === '') {
      toast({ title: 'Erro de Dados', description: 'Curso inválido.', status: 'error', duration: 5000, isClosable: true });
      setIsLoading(false); return;
    }

    const payload = {
      email: formData.email,
      senha: formData.senha,
      nome: formData.nome,
      matricula: formData.matricula,
      ano_ingresso: anoIngressoNum,
      id_curso: idCursoNum,
    };

    try {
      await criarContaApi(payload);
      toast({
        title: 'Cadastro completo!',
        description: 'Sua conta foi criada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      const errorMessage = error.message || 'Não foi possível completar o cadastro.';
      toast({ title: 'Erro no cadastro', description: errorMessage, status: 'error', duration: 9000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData.email || !formData.senha) {
    return <Box>Carregando ou redirecionando...</Box>;
  }

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navbar */}
      <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
        <Text fontWeight="bold" fontSize="lg" color="textColors.default">[doa]Unifei</Text>
        <HStack spacing={4} align="center">
          <Link as={RouterLink} to="/suas-doacoes" variant="nav">Suas doações</Link>
          <Link as={RouterLink} to="/lista-espera" variant="nav">Lista de espera</Link>
          <Divider orientation="vertical" h="20px" borderColor="ui.inputBorder" />
          <Button size="sm" variant="outlineNeutral" as={RouterLink} to="/lista-espera-steps">Receber</Button>
          <Button size="sm" variant="solidBrand" as={RouterLink} to="/donation-steps">Doar</Button>
        </HStack>
      </Flex>

      <Container maxW="md" py={{ base: 10, md: 20 }}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          {/* Formulário direto para informações pessoais */}
          <VStack spacing={4} align="stretch">
            <Heading size="md" textAlign="left">Boas vindas! - Etapa 2 de 2</Heading>
            <Text variant="muted" textAlign="left" fontSize="sm">
              Complete seu cadastro com suas informações pessoais.
            </Text>
            <Text fontSize="sm" color="textColors.default" textAlign="left" mt={-2} mb={2}>
              Email cadastrado: <strong>{formData.email}</strong>
            </Text>

            <FormControl id="nome-step2" isRequired>
              <FormLabel>Seu nome</FormLabel>
              <Input name="nome" placeholder="Seu nome aqui" value={formData.nome} onChange={handleChange('nome')} />
            </FormControl>

            <HStack spacing={4} align="flex-start">
              <FormControl id="matricula-step2" isRequired>
                <FormLabel>N° de matrícula</FormLabel>
                <Input name="matricula" placeholder="00000000000" value={formData.matricula} onChange={handleChange('matricula')} />
              </FormControl>
              <FormControl id="anoIngresso-step2" isRequired>
                <FormLabel>Ano de ingresso</FormLabel>
                <NumberInput value={formData.anoIngresso} onChange={handleAnoIngressoChange} min={new Date().getFullYear() - 10} max={new Date().getFullYear() + 1}>
                  <NumberInputField name="anoIngresso" placeholder="20XX" />
                  <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>

            <FormControl id="id_curso-step2" isRequired>
              <FormLabel>Curso</FormLabel>
              <Select name="id_curso" placeholder="Selecione seu curso" value={formData.id_curso} onChange={handleChange('id_curso')} >
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="solidBrand"
              onClick={handleSubmit}
              isDisabled={!isFormValid}
              isLoading={isLoading}
              width="full"
              mt={2}
            >
              Completar cadastro
            </Button>
            {/* Link para voltar para a primeira etapa ou para o login, se necessário */}
            <Text fontSize="sm" align="center" color="textColors.default" mt={2}>
              <Link as={RouterLink} to="/criar-conta" variant="formLink">Voltar para Etapa 1</Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}