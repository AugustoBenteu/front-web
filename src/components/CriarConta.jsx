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

export default function CriarConta() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const toast = useToast();
  const navigate = useNavigate(); 

  const handleSubmit = (event) => { 
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    console.log('Botão Continuar/Criar conta da Etapa 1 clicado!');

    if (!email || !senha || !confirmarSenha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (senha !== confirmarSenha) {
      toast({
        title: 'Erro de Validação',
        description: 'As senhas não coincidem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    navigate('/criar-conta/passo-a-passo', { 
      state: {
        email: email,
        senha: senha,
      }
    });
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '' && confirmarSenha.trim() !== '' && senha === confirmarSenha;

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navbar */}
      <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
        <Text fontWeight="bold" fontSize="lg" color="textColors.default">[doa]Unifei</Text>
        <HStack spacing={4} align="center">
          <Link as={RouterLink} to="#" variant="nav">Home</Link>
          <Link as={RouterLink} to="#" variant="nav">Contato</Link>
          <Link as={RouterLink} to="#" variant="nav">Sobre</Link>
          <Divider orientation="vertical" h="20px" borderColor="ui.inputBorder" />
          <Button variant="outlineNeutral" size="sm" as={RouterLink} to="/criar-conta">Criar conta</Button>
          <Button variant="solidBrand" size="sm" as={RouterLink} to="/login">Entrar</Button>
        </HStack>
      </Flex>

      <Container maxW="md" py={{ base: 10, md: 20 }}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          <VStack spacing={5} align="stretch">
            <Heading size="md" textAlign="left">Criar conta - Etapa 1 de 2</Heading>
            <Text variant="muted" textAlign="left" fontSize="sm">
              Comece com seu email e senha.
            </Text>
            <Text fontSize="sm" color="textColors.muted" textAlign="left" mt={-2} mb={2}>
              • Cadastre-se com o email institucional (<Text as="strong" color="textColors.default">@unifei.edu.br</Text>)
            </Text>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input placeholder="exemplo@unifei.edu.br" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Senha</FormLabel>
              <Input type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </FormControl>
            <FormControl id="confirmPassword" isRequired isInvalid={senha !== confirmarSenha && confirmarSenha !== ''}>
              <FormLabel>Confirmar senha</FormLabel>
              <Input type="password" placeholder="********" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              {senha !== confirmarSenha && confirmarSenha !== '' && (
                <Text fontSize="xs" color="red.500" mt={1}>As senhas não coincidem.</Text>
              )}
            </FormControl>
            <Button
              variant="solidBrand"
              width="full"
              mt={2}
              onClick={handleSubmit}
              isDisabled={!isFormValid}
            >
              Criar Conta 
            </Button>
            <Text fontSize="sm" align="center" color="textColors.default" mt={2}>
              Já possui uma conta?{' '}
              <Link as={RouterLink} to="/login" variant="formLink">Entrar</Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}