import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from './services/AuthService';
import ListUsers from './components/ListUsers';
import UserForm from './components/UserForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import Home from './components/Home';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      navigate('/profile'); // se já tiver logado, manda pro perfil
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setCurrentUser(undefined);
    navigate('/'); // manda pro login após sair
  };

  return (
    <div className="App">
      <nav className="bg-[#4d4d4d] p-4 shadow-md text-white">
        <ul className="flex items-center justify-center space-x-8 font-medium">
          <li>
            <Link to="/" className="text-[#ff9900] hover:underline">
              Início
            </Link>
          </li>

          {currentUser ? (
            <>
              <li>
                <Link to="/profile" className="text-[#ff9900] hover:underline">
                  Perfil
                </Link>
              </li>
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
                <Link to="/login" className="text-[#ff9900] hover:underline">
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<ListUsers />} />
        <Route path="/users/create" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
