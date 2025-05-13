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
  HStack,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* Navbar */}
      <Flex as="nav" bg="white" px={8} py={4} justify="space-between" align="center" boxShadow="sm">
        <Text fontWeight="bold">[doa]Unifei</Text>
        <HStack spacing={4}>
          <Link href="#">Home</Link>
          <Link href="#">Contato</Link>
          <Link href="#">Sobre</Link>
          <Divider orientation="vertical" h="20px" />
          <Button variant="outline" size="sm" as={RouterLink} to="/criar-conta">Criar conta</Button>
          <Button colorScheme='blackAlpha' size="sm" as={RouterLink} to="/login">Entrar</Button>
        </HStack>
      </Flex>

      {/* Form Container */}
      <Container maxW="md" py={20}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Entrar</Heading>
            <Text fontSize="sm">
              Insira suas informações para entrar na plataforma
              <br />
            </Text>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input placeholder="exemplo@unifei.edu.br" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input type="password" />
            </FormControl>
            <Button colorScheme="blackAlpha">Entrar</Button>
            <Text fontSize="sm" align="center">
              Não possui uma conta?{' '}
              <Link as={RouterLink} color="blue.500" to="/criar-conta">
                Criar conta
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
