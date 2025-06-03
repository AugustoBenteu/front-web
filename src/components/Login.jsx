import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  HStack,
  Divider,
  Flex,
  useToast, 
} from '@chakra-ui/react';
import { useState } from 'react'; 
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import { loginApi } from '../services/apiService'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    setIsLoading(true);

    if (!email || !senha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha seu email e senha.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const responseData = await loginApi({ email, senha });
      localStorage.setItem('authToken', responseData.data.token);
      localStorage.setItem('userData', JSON.stringify(responseData.data.user));

      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo(a) de volta, ${responseData.data.user.nome}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Ajustar a rota 
      navigate('/donation-steps'); 

    } catch (error) {
      const errorMessage = error.message || 'Email ou senha inválidos. Tente novamente.';
      toast({
        title: 'Erro no Login',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Condição simples para habilitar o botão
  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navbar */}
      <Flex
        as="nav"
        bg="white"
        px={8}
        py={4}
        justify="space-between"
        align="center"
        boxShadow="sm"
      >
        <Text fontWeight="bold" fontSize="lg" color="textColors.default">
          [doa]Unifei
        </Text>
        <HStack spacing={4} align="center">
          <Link as={RouterLink} to="#" variant="nav">Home</Link>
          <Link as={RouterLink} to="#" variant="nav">Contato</Link>
          <Link as={RouterLink} to="#" variant="nav">Sobre</Link>
          <Divider orientation="vertical" h="20px" borderColor="ui.inputBorder" />
          <Button variant="outlineNeutral" size="sm" as={RouterLink} to="/criar-conta">Criar conta</Button>
          <Button variant="solidBrand" size="sm" as={RouterLink} to="/login">Entrar</Button>
        </HStack>
      </Flex>

      {/* Form Container */}
      <Container maxW="md" py={{ base: 10, md: 20 }}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          <VStack spacing={5} align="stretch">
            <Heading size="md" textAlign="center">
              Entrar
            </Heading>
            <Text variant="muted" textAlign="center" mb={2}>
              Insira suas informações para entrar na plataforma
            </Text>
            <FormControl id="email-login" isRequired> 
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="exemplo@unifei.edu.br"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            <FormControl id="password-login" isRequired> 
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} 
              />
            </FormControl>
            <Button
              variant="solidBrand"
              width="full"
              mt={2}
              onClick={handleSubmit} 
              isLoading={isLoading}   
              isDisabled={!isFormValid} 
            >
              Entrar
            </Button>
            <Text fontSize="sm" align="center" color="textColors.default">
              Não possui uma conta?{' '}
              <Link
                as={RouterLink}
                to="/criar-conta" 
                variant="formLink"
              >
                Criar conta
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}