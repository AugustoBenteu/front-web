import {
  Box, Button, Container, FormControl, FormLabel, Heading, Input, Link,
  Text, VStack, Select, HStack, Flex, Divider, useToast, Checkbox, Textarea,
  getToken
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import { criarComputador } from '../services/apiService'; 


export default function DonationSteps() {
  const toast = useToast();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    ano: Number,
    ram: '',
    tipo_hd: '',
    armazenamento: '',
    processador: '',
    detalhes: '',
    id_usuario: localStorage.getItem('matricula'),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle file input (drop or select)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      fotos: files,
    }));
  };

  // Handle dropzone drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setForm((prev) => ({
      ...prev,
      fotos: files,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropzoneClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    form.ano = Number(form.ano);
    await criarComputador(form,authToken );
    
    toast({
      title: 'Formulário enviado!',
      description: 'Seu computador foi cadastrado para doação.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
    // console.log(form);
  };

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

      {/* Donation Form Container */}
      <Container maxW="5xl" py={{ base: 10, md: 20 }}>
        <Box bg="white" p={8} rounded="md" boxShadow="md">
          <form onSubmit={handleSubmit}>
            <Heading size="md" mb={2}>
              Cadastrar um computador para doação
            </Heading>
            <Text mb={4} fontSize="sm">
              Todos os campos são obrigatórios. Somente computadores em perfeitas condições de funcionamento podem ser doados
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Marca</FormLabel>
                  <Input
                    name="marca"
                    placeholder="Marca (ex: Dell)"
                    value={form.marca}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Modelo</FormLabel>
                  <Input
                    name="modelo"
                    placeholder="Modelo (ex: XPS 15)"
                    value={form.modelo}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Ano de aquisição</FormLabel>
                  <Input
                    name="ano"
                    placeholder="Ano"
                    value={form.ano}
                    onChange={handleChange}
                    type='number'
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Memória RAM</FormLabel>
                  <Select
                    name="ram"
                    placeholder="Selecione (de 2GB até 32GB ou mais)"
                    value={form.ram}
                    onChange={handleChange}
                  >
                    <option>2GB</option>
                    <option>4GB</option>
                    <option>8GB</option>
                    <option>16GB</option>
                    <option>32GB+</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo de armazenamento</FormLabel>
                  <Select
                    name="tipo_hd"
                    placeholder="HD ou SSD"
                    value={form.tipo_hd}
                    onChange={handleChange}
                  >
                    <option>HD</option>
                    <option>SSD</option>
                  </Select>
                </FormControl>
              </HStack>
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Armazenamento</FormLabel>
                  <Select
                    name="armazenamento"
                    placeholder="Selecione (256GB+)"
                    value={form.armazenamento}
                    onChange={handleChange}
                  >
                    <option>128GB</option>
                    <option>256GB</option>
                    <option>512GB</option>
                    <option>1TB+</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Processador</FormLabel>
                  <Select
                    name="processador"
                    placeholder="Selecione o processador mais próximo"
                    value={form.processador}
                    onChange={handleChange}
                  >
                    <option>Intel i3</option>
                    <option>Intel i5</option>
                    <option>Intel i7</option>
                    <option>AMD Ryzen 3</option>
                    <option>AMD Ryzen 5</option>
                    <option>AMD Ryzen 7</option>
                  </Select>
                </FormControl>
              </HStack>
              {/* <Checkbox
                name="bomEstado"
                isChecked={form.bomEstado}
                onChange={handleChange}
              >
                O computador está em bom estado de conservação (explicar em detalhes)
              </Checkbox>
              <Checkbox
                name="semConserto"
                isChecked={form.semConserto}
                onChange={handleChange}
              >
                O computador não precisa de modificação ou conserto para funcionar (ex: não precisa de nova bateria porque a atual não segura carga)
              </Checkbox> */}
              <FormControl>
                <FormLabel>Detalhes</FormLabel>
                <Textarea
                  name="detalhes"
                  placeholder="Descreva os detalhes a respeito do estado do computador, funcionamento, necessidade de um sistema operacional, pequenos arranhões ou outros defeitos que não afetam o funcionamento da máquina, etc."
                  value={form.detalhes}
                  onChange={handleChange}
                />
              </FormControl>
              {/* <FormControl>
                <FormLabel>Fotos</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  color="gray.500"
                  cursor="pointer"
                  onClick={handleDropzoneClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  transition="border-color 0.2s"
                  _hover={{ borderColor: "gray.400" }}
                >
                  <input
                    type="file"
                    name="fotos"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Text fontSize="2xl">📷</Text>
                  <Text>Arraste e solte ou clique para selecionar imagens (max. 5mb cada)</Text>
                  {form.fotos.length > 0 && (
                    <Box mt={2}>
                      {form.fotos.map((file, idx) => (
                        <Text key={idx} fontSize="sm" isTruncated>
                          {file.name}
                        </Text>
                      ))}
                    </Box>
                  )}
                </Box>
              </FormControl> */}
              <Button colorScheme="blackAlpha" w="full" mt={2} type="submit">
                Fazer doação
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
