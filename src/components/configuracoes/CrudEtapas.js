import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../api/apiService";
import CrudModalEtapa from "./CrudModalEtapa";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  Flex,
  useToast,
  useColorMode,
} from "@chakra-ui/react";

const CrudEtapas = () => {
  const [etapas, setEtapas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [initialValues, setInitialValues] = useState({
    nome: "",
    codigo: "",
    posicao: "",
    status: "ativo",
  });
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetchEtapas();
  }, []);

  const fetchEtapas = async () => {
    try {
      const response = await api.get("/etapas");
      setEtapas(response.data);
    } catch (error) {
      toast({
        title: "Erro ao buscar etapas.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        posicao: parseInt(values.posicao, 10), // Convertendo posicao para número inteiro
      };

      if (editId) {
        await api.put(`/etapas/${editId}`, payload);
      } else {
        await api.post("/etapas", payload);
      }

      resetForm();
      setEditId(null);
      setIsModalOpen(false);
      fetchEtapas();
      toast({
        title: `Etapa ${editId ? "atualizada" : "criada"} com sucesso!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar etapa.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (etapa) => {
    setEditId(etapa._id);
    setInitialValues({
      nome: etapa.nome,
      codigo: etapa.codigo,
      posicao: etapa.posicao,
      status: etapa.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/etapas/${id}`);
      fetchEtapas();
      setIsDeleteModalOpen(false);
      toast({
        title: "Etapa excluída com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir etapa.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (etapa) => {
    setItemToDelete(etapa);
    setIsDeleteModalOpen(true);
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    codigo: Yup.string().required("Código é obrigatório"),
    posicao: Yup.number()
      .required("Posição é obrigatória")
      .positive("Posição deve ser positiva")
      .integer("Posição deve ser um número inteiro"),
    status: Yup.string().required("Status é obrigatório"),
  });

  return (
    <Box p={4} bg="gray.900" textColor="gray.100" rounded="lg" shadow="md">
      <Heading size="lg" mb={4}>
        Gerenciamento de Etapas
      </Heading>

      <Button onClick={() => setIsModalOpen(true)} mb={4} colorScheme="blue">
        Criar Nova Etapa
      </Button>

      <Stack spacing={4}>
        {etapas.map((etapa) => (
          <Box
            key={etapa._id}
            bg="gray.700"
            p={4}
            rounded="lg"
            shadow="sm"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Heading size="md">{etapa.nome}</Heading>
              <Text>Código: {etapa.codigo}</Text>
              <Text>Posição: {etapa.posicao}</Text>
              <Text>Status: {etapa.status}</Text>
            </Box>
            <Flex>
              <Button
                onClick={() => handleEdit(etapa)}
                colorScheme="yellow"
                mr={2}
              >
                Editar
              </Button>
              <Button onClick={() => confirmDelete(etapa)} colorScheme="red">
                Excluir
              </Button>
            </Flex>
          </Box>
        ))}
      </Stack>

      <CrudModalEtapa
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? "Editar Etapa" : "Criar Etapa"}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, resetForm }) => (
            <Form>
              <FormControl mb={2} isInvalid={!!ErrorMessage.name}>
                <FormLabel>Nome:</FormLabel>
                <Field
                  as={Input}
                  name="nome"
                  bg="gray.600"
                  focusBorderColor="blue.500"
                />
                <FormErrorMessage>
                  {<ErrorMessage name="nome" />}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={2} isInvalid={!!ErrorMessage.codigo}>
                <FormLabel>Código:</FormLabel>
                <Field
                  as={Input}
                  name="codigo"
                  bg="gray.600"
                  focusBorderColor="blue.500"
                />
                <FormErrorMessage>
                  {<ErrorMessage name="codigo" />}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={2} isInvalid={!!ErrorMessage.posicao}>
                <FormLabel>Posição:</FormLabel>
                <NumberInput
                  min={1}
                  value={values.posicao}
                  onChange={(valueString, valueNumber) =>
                    setFieldValue("posicao", valueNumber)
                  }
                >
                  <NumberInputField bg="gray.600" focusBorderColor="blue.500" />
                </NumberInput>
                <FormErrorMessage>
                  {<ErrorMessage name="posicao" />}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={2} isInvalid={!!ErrorMessage.status}>
                <FormLabel>Status:</FormLabel>
                <Field
                  as="select"
                  name="status"
                  className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="arquivado">Arquivado</option>
                </Field>
                <FormErrorMessage>
                  <ErrorMessage name="status" />
                </FormErrorMessage>
              </FormControl>

              <Flex justify="flex-end" mt={4}>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  mr={2}
                  colorScheme="gray"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="blue"
                >
                  {editId ? "Atualizar" : "Criar"}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </CrudModalEtapa>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(itemToDelete._id)}
        item={itemToDelete}
      />
    </Box>
  );
};

export default CrudEtapas;
