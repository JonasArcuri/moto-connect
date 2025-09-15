// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Por favor, insira seu email.");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido.");
      setLoading(false);
      return;
    }

    try {
      // Faz chamada para o backend
      const response = await axios.post("http://localhost:8080/auth/request-reset", {
        email,
      });

      // Mostra mensagem vinda do backend
      setSuccess(
        response.data ||
          "Se este email estiver cadastrado, enviaremos um link de redefinição."
      );
    } catch (err) {
      console.error("Erro no reset:", err);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Erro inesperado. Tente novamente em alguns instantes.");
      }
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
          <h2 className="text-lg font-bold text-black mb-2">Reset de Senha</h2>
          <a
            href="/login"
            className="text-[#FA9D06] font-semibold underline hover:text-[#e68a00] transition-colors"
          >
            Voltar para Login
          </a>

          <form onSubmit={handleReset} className="flex flex-col gap-4 mt-6">
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
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FA9D06] focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`w-full font-bold py-3 rounded-md transition-all duration-200 ${
                loading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#FA9D06] text-black hover:bg-[#e68a00] hover:shadow-lg transform hover:scale-[1.02]"
              }`}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Link de Reset"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
        <p className="text-xs">Todos os Direitos Reservados @2025.</p>
      </footer>
    </div>
  );
}

export default ResetPassword;
