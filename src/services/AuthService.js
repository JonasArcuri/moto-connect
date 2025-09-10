// src/services/AuthService.js
import axios from 'axios';

const API_AUTH_URL = 'http://localhost:8080/auth/';

// Configuração do axios com interceptors para melhor tratamento de erros
const api = axios.create({
    baseURL: API_AUTH_URL,
    timeout: 10000, // 10 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para tratamento de respostas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erro na requisição:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    try {
        console.log('Tentando fazer login com:', { email, password: '***' });
        
        // Garantir que os dados estão corretos
        const loginData = {
            email: email.trim(),
            password: password
        };

        const response = await api.post('login', loginData);
        
        console.log('Resposta recebida:', response.data);
        
        // Verificar se o login foi bem-sucedido
        // Seu backend retorna: { id, name, email, token (que é a mensagem), tipo }
        if (response.data && response.data.id) {
            // Estruturar os dados do usuário corretamente
            const userData = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                tipo: response.data.tipo,
                message: response.data.token, // Na verdade é a mensagem de sucesso
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };

            // Salvar no localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            return {
                success: true,
                data: userData,
                message: response.data.token || 'Login realizado com sucesso!'
            };
        } else {
            throw new Error('Resposta inválida do servidor');
        }

    } catch (error) {
        console.error('Erro detalhado no login:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        
        // Tratamento específico de erros
        let errorMessage = 'Erro interno do servidor';
        
        if (error.response) {
            // Erro HTTP (4xx, 5xx)
            const status = error.response.status;
            const data = error.response.data;
            
            console.log('Dados de erro do servidor:', data);
            
            switch (status) {
                case 400:
                    errorMessage = typeof data === 'string' ? data : (data?.message || 'Credenciais inválidas');
                    break;
                case 401:
                    errorMessage = 'Email ou senha incorretos';
                    break;
                case 404:
                    errorMessage = 'Serviço de autenticação não encontrado';
                    break;
                case 500:
                    errorMessage = 'Erro interno do servidor';
                    break;
                default:
                    errorMessage = data?.message || `Erro ${status}`;
            }
        } else if (error.request) {
            // Erro de rede
            errorMessage = 'Erro de conexão. Verifique sua internet.';
            console.log('Erro de rede:', error.request);
        } else {
            // Outros erros
            errorMessage = error.message || 'Erro desconhecido';
        }

        return {
            success: false,
            data: null,
            message: errorMessage
        };
    }
};

export const logout = () => {
    try {
        localStorage.removeItem('user');
        return {
            success: true,
            message: 'Logout realizado com sucesso'
        };
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        return {
            success: false,
            message: 'Erro ao fazer logout'
        };
    }
};

export const getCurrentUser = () => {
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            
            // Verificar se os dados ainda são válidos
            if (user && user.isAuthenticated) {
                return user;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        localStorage.removeItem('user'); // Limpar dados corrompidos
        return null;
    }
};

export const isAuthenticated = () => {
    const user = getCurrentUser();
    return user !== null && user.isAuthenticated === true;
};

export const getUserType = () => {
    const user = getCurrentUser();
    return user?.tipo || null;
};

export const getUserInfo = () => {
    const user = getCurrentUser();
    if (user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            tipo: user.tipo
        };
    }
    return null;
};

// Função para limpar dados inválidos
export const clearInvalidSession = () => {
    localStorage.removeItem('user');
};

// Função para validar se o token ainda é válido (se implementar JWT futuramente)
export const validateSession = async () => {
    const user = getCurrentUser();
    if (!user) {
        return false;
    }
    
    // Aqui você pode adicionar validação de token JWT quando implementar
    // Por enquanto, apenas verifica se existe usuário
    return true;
};