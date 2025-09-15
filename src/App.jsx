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
import ResetPassword from './components/ResetPassword.jsx';
import ResetPasswordConfirm from "./components/ResetPasswordConfirm.jsx";
import FeedMotoboy from './components/FeedMotoboy.jsx';
import FeedEstabelecimento from './components/FeedEstabelecimento.jsx';
import CriarVaga from './components/CriarVaga.jsx'; // 🔥 importa a página

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redireciona para a Home
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="bg-[#4d4d4d] p-4 shadow-md text-white">
        <ul className="flex items-center justify-center space-x-8 font-medium">
          {/* "Início" só aparece se NÃO estiver logado */}
          {!user && (
            <li>
              <Link to="/" className="text-[#ff9900] hover:underline">
                Início
              </Link>
            </li>
          )}

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
                <>
                  <li>
                    <Link
                      to="/dashboard-estabelecimento"
                      className="text-[#ff9900] hover:underline"
                    >
                      Gerenciamento
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feedestabelecimento"
                      className="text-[#ff9900] hover:underline"
                    >
                      Feed
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/criar-vaga"
                      className="text-[#ff9900] hover:underline"
                    >
                      Criar Vaga
                    </Link>
                  </li> */}
                </>
              )}

              {/* Se for Motoboy */}
              {user.tipo === "Motoboy" && (
                <>
                  <li>
                    <Link
                      to="/dashboard-motoboy"
                      className="text-[#ff9900] hover:underline"
                    >
                      Entregas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feedmotoboy"
                      className="text-[#ff9900] hover:underline"
                    >
                      Feed
                    </Link>
                  </li>
                </>
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
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset/confirm" element={<ResetPasswordConfirm />} />

        {/* Rotas do Estabelecimento */}
        {user?.tipo === "Estabelecimento" && (
          <>
            <Route
              path="/dashboard-estabelecimento"
              element={<DashboardEstabelecimento />}
            />
            <Route
              path="/feedestabelecimento"
              element={<FeedEstabelecimento />}
            />
            <Route
              path="/criar-vaga"
              element={<CriarVaga />}
            />
          </>
        )}

        {/* Rotas do Motoboy */}
        {user?.tipo === "Motoboy" && (
          <>
            <Route
              path="/dashboard-motoboy"
              element={<DashboardMotoboy />}
            />
            <Route
              path="/feedmotoboy"
              element={<FeedMotoboy />}
            />
          </>
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
