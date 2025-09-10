import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/UserService';

function ListUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja deletar este usuário?")) {
            return;
        }

        setDeletingId(id);

        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
            alert('Usuário deletado com sucesso!');
        } catch (err) {
            setError('Erro ao deletar o usuário.');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Carregando usuários...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Erro ao buscar usuários: {error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lista de Usuários</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {users.map(user => (
                    <li key={user.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-left">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">{user.name}</h3>
                        <div className="text-gray-600 text-sm space-y-1">
                            {user.cep && <p><strong className="font-medium text-gray-800">CEP:</strong> {user.cep}</p>}
                            <p><strong className="font-medium text-gray-800">Email:</strong> {user.email}</p>
                            {user.cpf && <p><strong className="font-medium text-gray-800">CPF:</strong> {user.cpf}</p>}
                            {user.endereco && <p><strong className="font-medium text-gray-800">Endereço:</strong> {user.endereco}</p>}
                            {user.bairro && <p><strong className="font-medium text-gray-800">Bairro:</strong> {user.bairro}</p>}
                            {user.cidade && <p><strong className="font-medium text-gray-800">Cidade:</strong> {user.cidade}</p>}
                            {user.uf && <p><strong className="font-medium text-gray-800">UF:</strong> {user.uf}</p>}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button className="w-full py-2 px-4 bg-white-100 text-yellow-400 font-semibold">
                                <Link to={`/users/${user.id}/edit`}
                                >
                                    Editar
                                </Link>
                            </button>
                            <button
                                className="w-full py-2 px-4 bg-white-100 text-red-400 font-semibold"
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                            >
                                {deletingId === user.id ? 'Deletando...' : 'Deletar'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListUsers;