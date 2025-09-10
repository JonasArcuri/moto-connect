// src/services/UserService.js

const API_BASE_URL = 'http://localhost:8080/users';

// Função para listar todos os usuários
export const getAllUsers = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar os usuários');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro no service getAllUsers:', error);
        throw error;
    }
};

// Função para criar um novo usuário
export const createUser = async (user) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar o usuário');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro no service createUser:', error);
        throw error;
    }
};

// Função para buscar um usuário por ID
export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro no service getUserById:', error);
        throw error;
    }
};

// Função para atualizar um usuário por ID
export const updateUser = async (id, updatedUserData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar o usuário');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro no service updateUser:', error);
        throw error;
    }
};

// Função para deletar um usuário por ID
export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar o usuário');
        }
        return response.status === 204; // Retorna true se a exclusão foi bem-sucedida (No Content)
    } catch (error) {
        console.error('Erro no service deleteUser:', error);
        throw error;
    }
};