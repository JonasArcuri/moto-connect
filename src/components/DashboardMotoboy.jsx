import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function DashboardMotoboy() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não houver usuário logado, redireciona para o login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <p className="text-center text-gray-500">Carregando Perfil...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-[#4d4d4d] text-white p-4 flex flex-col shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-100">Meu Gerenciamento</h2>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/feedmotoboy')}
              className="bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md"
            >
              Feed
            </button>
            <button className="bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md">
              Matches
            </button>
            <button className="bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md">
              Relatórios
            </button>
            <hr className="border-t border-gray-600 my-4" />
            <button className="bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md">
              Configurações
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md"
            >
              Sair
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow bg-white p-6 shadow-inner flex flex-col">
          <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded-t-lg mb-4 text-sm font-medium">
            Meu Perfil - Gerenciamento
          </div>

          <div className="flex-grow bg-gray-50 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Bem-vindo(a), {user.name}!
            </h2>
            <p className="text-gray-700 mb-2">
              Aqui você pode gerenciar seu perfil, gerar relatórios de extras, corridas, valores ganhos e visualizar
              estatísticas do seu rendimento.
            </p>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center w-full">
        <p className="text-xs">Todos os Direitos Reservados @2025.</p>
      </footer>
    </div>
  );
}

export default DashboardMotoboy;
