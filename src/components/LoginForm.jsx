import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor, insira um email válido.');
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, password);

            if (result.success) {
                setSuccess(result.message);
                const userType = result.data.tipo;

                console.log('Login bem-sucedido:', result.data);
                console.log('Tipo de usuário:', userType);

                setTimeout(() => {
                    switch (userType) {
                        case 'Estabelecimento':
                            navigate('/dashboard-estabelecimento');
                            break;
                        case 'Motoboy':
                            navigate('/dashboard-motoboy');
                            break;
                        default:
                            navigate('/profile');
                    }
                }, 1000);

            } else {
                setError(result.message);
            }

        } catch (err) {
            console.error('Erro inesperado no login:', err);
            setError('Erro inesperado. Tente novamente em alguns instantes.');
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white border rounded-lg shadow-md p-8 w-96 text-center">
                    <h2 className="text-lg font-bold text-black mb-2">Login - Sistema</h2>
                    <a 
                        href="/cadastro" 
                        className="text-[#FA9D06] font-semibold underline hover:text-[#e68a00] transition-colors"
                    >
                        Ou crie uma nova conta
                    </a>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                <div className="flex justify-between items-center">
                                    <span>{error}</span>
                                    <button 
                                        type="button" 
                                        onClick={clearMessages}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                                <div className="flex justify-between items-center">
                                    <span>{success}</span>
                                    <button 
                                        type="button" 
                                        onClick={clearMessages}
                                        className="text-green-500 hover:text-green-700 ml-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FA9D06] focus:border-transparent transition-all"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FA9D06] focus:border-transparent transition-all"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <a 
                            href="/reset" 
                            className="bg-[#FA9D06] text-black py-3 rounded-md hover:bg-[#e68a00] hover:shadow-lg transform hover:scale-[1.02]"
                        >
                            Esqueci minha senha
                        </a>

                        <button
                            type="submit"
                            className={`w-full font-bold py-3 rounded-md transition-all duration-200 ${
                                loading 
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#FA9D06] text-black hover:bg-[#e68a00] hover:shadow-lg transform hover:scale-[1.02]'
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                    Entrando...
                                </div>
                            ) : (
                                'Entrar'
                            )}
                        </button>

                        <div className="mt-4 text-xs text-gray-500">
                            <p>Aceita tanto Estabelecimentos quanto Motoboys</p>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
                <p className="text-xs">Todos os Direitos Reservados @2025.</p>
            </footer>
        </div>
    );
}

export default LoginForm;
