import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            {/* Main */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-[#4d4d4d] shadow-lg rounded-xl p-10 max-w-xl w-full text-center">
                    {/* Logo */}
                    <img
                        src={Logo}
                        alt="MotoConnect Logo"
                        className="mx-auto mb-6 w-40 h-auto"
                    />

                    <h2 className="text-2xl font-bold text-white mb-4">
                        Bem-vindo à Aplicação da MotoConnect 🚀
                    </h2>
                    <p className="text-white text-lg mb-6">
                        Use a navegação para utilizar o Sistema.
                    </p>

                    {/* Botões */}
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/login"
                            className="bg-[#ff9900] hover:bg-[#e68a00] text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/users/create"
                            className="bg-[#00cc99] hover:bg-[#00b386] text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
                <p className="text-sm font-bold">Todos os Direitos Reservados á @JonasArcuri, MotoConnect 2025.</p>
            </footer>
        </div>
    );
}

export default Home;
