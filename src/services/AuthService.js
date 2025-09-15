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
        
        const loginData = {
            email: email.trim(),
            password: password
        };

        const response = await api.post('login', loginData);
        
        console.log('Resposta recebida:', response.data);

        if (response.data && response.data.id) {
            const userData = {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                tipo: response.data.tipo,
                estabelecimentoId: response.data.estabelecimentoId ?? null, // 👈 GUARDA O ID DO ESTABELECIMENTO
                message: response.data.message || response.data.token,      // 👈 usa message ou token (compatível com backend)
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(userData));
            
            return {
                success: true,
                data: userData,
                message: userData.message || 'Login realizado com sucesso!'
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
        
        let errorMessage = 'Erro interno do servidor';
        
        if (error.response) {
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
            errorMessage = 'Erro de conexão interna, verifique sua API.';
            console.log('Erro de rede:', error.request);
        } else {
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
            if (user && user.isAuthenticated) {
                return user;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        localStorage.removeItem('user');
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

export const clearInvalidSession = () => {
    localStorage.removeItem('user');
};

export const validateSession = async () => {
    const user = getCurrentUser();
    if (!user) {
        return false;
    }
    return true;
};
