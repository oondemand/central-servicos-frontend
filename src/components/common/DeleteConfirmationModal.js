import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white" mx="auto"  top="20%" position="relative">
        <ModalHeader>Confirmação de Exclusão</ModalHeader>
        <ModalBody>
          {item ? (
            <>
              <Text>Você tem certeza que deseja excluir o seguinte item?</Text>
              <Text mt={4}>
                <strong>Nome:</strong> {item.nome}
              </Text>
              {item.email && (
                <Text>
                  <strong>Email:</strong> {item.email}
                </Text>
              )}
              {item.cnpj && (
                <Text>
                  <strong>CNPJ:</strong> {item.cnpj}
                </Text>
              )}
            </>
          ) : (
            <Text>Item não encontrado.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
