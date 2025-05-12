import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  Select,
  HStack,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function CriarContaSteps() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    matricula: '',
    anoIngresso: '',
    curso: '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNext = () => {
    // Você pode validar os campos aqui antes de avançar
    setStep(2);
  };

  
  const isStep1Valid =
  formData.email.trim() !== '' &&
  formData.senha.trim() !== '' &&
  formData.confirmarSenha.trim() !== '' &&
  formData.senha === formData.confirmarSenha;

  const isStep2Valid =
  formData.nome.trim() !== '' &&
  formData.matricula.trim() !== '' &&
  formData.anoIngresso.trim() !== '' &&
  formData.curso.trim() !== '';


    const passwordMismatch =
    formData.confirmarSenha && formData.senha !== formData.confirmarSenha;

    const handleSubmit = async () => {
  try {
    const response = await fetch('localhost:8081', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar os dados');
    }

    const data = await response.json();
    console.log('Success:', data);
    // You can redirect, show a message, etc.
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
};



  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navbar */}
      <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
        <Text fontWeight="bold">[doa]Unifei</Text>
        <HStack spacing={4}>
          <Link href="#">Suas doações</Link>
          <Link href="#">Lista de espera</Link>
          <Divider orientation="vertical" h="20px" />
          <Button size="sm" variant="outline">Receber</Button>
          <Button size="sm" colorScheme="blackAlpha">Doar</Button>
        </HStack>
      </Flex>

      {/* Form Steps */}
      <Container maxW="md" py={20}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          {step === 1 && (
  <VStack spacing={4} align="stretch">
    <Heading size="md">Criar conta</Heading>
    <Text fontSize="sm">
      Preencha os campos abaixo para criar sua conta
      <br />
      <Text as="span" fontStyle="italic">
        • Cadastre-se com o email institucional (<strong>@unifei.edu.br</strong>)
      </Text>
    </Text>

    <FormControl>
      <FormLabel>Email</FormLabel>
      <Input
        type="email"
        placeholder="exemplo@unifei.edu.br"
        value={formData.email}
        onChange={handleChange('email')}
      />
    </FormControl>

    <FormControl>
      <FormLabel>Senha</FormLabel>
      <Input
        type="password"
        value={formData.senha}
        onChange={handleChange('senha')}
      />
    </FormControl>

    <FormControl isInvalid={passwordMismatch}>
      <FormLabel>Confirmar senha</FormLabel>
      <Input
        type="password"
        value={formData.confirmarSenha}
        onChange={handleChange('confirmarSenha')}
      />
      {passwordMismatch && (
        <Text fontSize="xs" color="red.500" mt={1}>
          As senhas não coincidem.
        </Text>
      )}
    </FormControl>

    <Button
      colorScheme="blackAlpha"
      onClick={handleNext}
      isDisabled={!isStep1Valid}
    >
      Avançar
    </Button>

    <Text fontSize="sm" align="center">
      Já possui uma conta?{' '}
      <Link color="blue.500" href="#">
        Entrar
      </Link>
    </Text>
  </VStack>
)}


          {step === 2 && (
  <VStack spacing={4} align="stretch">
    <Heading size="md">Boas vindas!</Heading>
    <Text fontSize="sm">
      Antes de prosseguir, complete seu cadastro com algumas informações pessoais
    </Text>

    <FormControl>
      <FormLabel>Seu nome</FormLabel>
      <Input
        placeholder="Seu nome aqui"
        value={formData.nome}
        onChange={handleChange('nome')}
      />
    </FormControl>

    <HStack spacing={4}>
      <FormControl>
        <FormLabel>N° de matrícula</FormLabel>
        <Input
          placeholder="00000000000"
          value={formData.matricula}
          onChange={handleChange('matricula')}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Ano de ingresso</FormLabel>
        <Input
          placeholder="20XX"
          value={formData.anoIngresso}
          onChange={handleChange('anoIngresso')}
        />
      </FormControl>
    </HStack>

    <FormControl>
      <FormLabel>Curso</FormLabel>
      <Select
        placeholder="Selecione seu curso"
        value={formData.curso}
        onChange={handleChange('curso')}
      >
        <option value="Engenharia de Computação">Engenharia de Computação</option>
        <option value="Engenharia Elétrica">Sistemas de Informação</option>
        <option value="Engenharia Elétrica">Ciência da Computação</option>
        <option value="Outro">Outro</option>
      </Select>
    </FormControl>

    <Button
      colorScheme="blackAlpha"
      onClick={handleSubmit}
      isDisabled={!isStep2Valid}
    >
      Completar cadastro
    </Button>
  </VStack>
)}

        </Box>
      </Container>
    </Box>
  );
}
