// src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

import ListUsers from './components/ListUsers';
import UserForm from './components/UserForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import Home from './components/Home';
import DashboardEstabelecimento from './components/DashboardEstabelecimento';
import DashboardMotoboy from './components/DashboardMotoboy';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // hook para navegação

  const handleLogout = () => {
    logout();
    navigate("/"); // redireciona para a Home
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="bg-[#4d4d4d] p-4 shadow-md text-white">
        <ul className="flex items-center justify-center space-x-8 font-medium">
          <li>
            <Link to="/" className="text-[#ff9900] hover:underline">
              Início
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="text-[#ff9900] hover:underline"
                >
                  Perfil
                </Link>
              </li>

              {/* Se for Estabelecimento */}
              {user.tipo === "Estabelecimento" && (
                <li>
                  <Link
                    to="/dashboard-estabelecimento"
                    className="text-[#ff9900] hover:underline"
                  >
                    Gerenciamento
                  </Link>
                </li>
              )}

              {/* Se for Motoboy */}
              {user.tipo === "Motoboy" && (
                <li>
                  <Link
                    to="/dashboard-motoboy"
                    className="text-[#ff9900] hover:underline"
                  >
                    Entregas
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:text-red-100 transition-colors duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-[#ff9900] hover:underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/users/create"
                  className="text-[#ff9900] hover:underline"
                >
                  Criar uma conta
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <hr />

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<ListUsers />} />
        <Route path="/users/create" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Proteção por tipo de usuário */}
        {user?.tipo === "Estabelecimento" && (
          <Route
            path="/dashboard-estabelecimento"
            element={<DashboardEstabelecimento />}
          />
        )}

        {user?.tipo === "Motoboy" && (
          <Route
            path="/dashboard-motoboy"
            element={<DashboardMotoboy />}
          />
        )}

        <Route
          path="*"
          element={
            <h1 className="text-center mt-8">
              404 - Página Não Encontrada
            </h1>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
