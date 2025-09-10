import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/AuthService';

function ProfilePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            navigate('/login'); // Redireciona para login se não houver usuário logado
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) {
        return <p className="text-center text-gray-500">Carregando perfil...</p>;
    }

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Olá, {currentUser.name}</h2>
            <div className="space-y-4">
                <p className="text-lg text-gray-700">
                    <span className="font-semibold">Email:</span> {currentUser.email}
                </p>
                <p>
                    <span className='font-semibold'>Tipo Usuário: {currentUser.tipo}</span>
                </p>
                {/* Você pode adicionar mais informações do usuário aqui, se o seu backend as retornar */}
                <p className="text-sm text-gray-500">
                    Você está logado no sistema.
                </p>
            </div>
        </div>
    );
}

export default ProfilePage;