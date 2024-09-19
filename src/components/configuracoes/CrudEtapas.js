import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../api/apiService';
import CrudModal from './CrudModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react';
import CrudModalEtapa from './CrudModalEtapa';

const CrudEtapas = () => {
    const [etapas, setEtapas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchEtapas();
    }, []);

    const fetchEtapas = async () => {
        try {
            const response = await api.get('/etapas');
            setEtapas(response.data);
        } catch (error) {
            console.error('Erro ao buscar etapas:', error.message);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (editId) {
                await api.put(`/etapas/${editId}`, values);
            } else {
                await api.post('/etapas', values);
            }

            resetForm();
            setEditId(null);
            setIsModalOpen(false);
            fetchEtapas();
        } catch (error) {
            console.error('Erro ao salvar etapa:', error.message);
        }
    };

    const handleEdit = (etapa) => {
        setEditId(etapa._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/etapas/${id}`);
            fetchEtapas();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Erro ao excluir etapa:', error.message);
        }
    };

    const confirmDelete = (etapa) => {
        setItemToDelete(etapa);
        setIsDeleteModalOpen(true);
    };

    // Validação Yup
    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Nome é obrigatório'),
        codigo: Yup.string().required('Código é obrigatório'),
        posicao: Yup.number()
            .required('Posição é obrigatória')
            .positive('Posição deve ser positiva')
            .integer('Posição deve ser um número inteiro'),
        status: Yup.string().required('Status é obrigatório'),
    });

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Etapas</h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Criar Nova Etapa
            </button>

            <ul className="space-y-4">
                {etapas.map((etapa) => (
                    <li key={etapa._id} className="bg-white dark:bg-gray-900 p-4 rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-bold">{etapa.nome}</h3>
                            <p>Código: {etapa.codigo}</p>
                            <p>Posição: {etapa.posicao}</p>
                            <p>Status: {etapa.status}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(etapa)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => confirmDelete(etapa)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <CrudModalEtapa
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editId ? 'Editar Etapa' : 'Criar Etapa'}
            >
                <Formik
                    initialValues={{
                        nome: '',
                        codigo: '',
                        posicao: '',
                        status: 'ativo',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, resetForm }) => (
                        <Form>
                            <div className="mb-2">
                                <label className="block text-gray-700 dark:text-gray-300">Nome:</label>
                                <Field
                                    type="text"
                                    name="nome"
                                    className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                                />
                                <ErrorMessage name="nome" component="div" className="text-red-500" />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 dark:text-gray-300">Código:</label>
                                <Field
                                    type="text"
                                    name="codigo"
                                    className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                                />
                                <ErrorMessage name="codigo" component="div" className="text-red-500" />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 dark:text-gray-300">Posição:</label>
                                <Field
                                    type="number"
                                    name="posicao"
                                    className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                                />
                                <ErrorMessage name="posicao" component="div" className="text-red-500" />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 dark:text-gray-300">Status:</label>
                                <Field
                                    as="select"
                                    name="status"
                                    className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="arquivado">Arquivado</option>
                                </Field>
                                <ErrorMessage name="status" component="div" className="text-red-500" />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {editId ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
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
        </div>
    );
};

export default CrudEtapas;
