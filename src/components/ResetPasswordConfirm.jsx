// src/components/ResetPasswordConfirm.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordConfirm() {
  const location = useLocation();
  const navigate = useNavigate();

  // usa URLSearchParams sobre location.search (compatível com v5 e v6)
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Token ausente. Verifique o link enviado por email.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("Senha inválida. Use pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/reset", {
        token,
        newPassword: password,
      });

      // backend retorna string de sucesso (conforme seu controller)
      setMessage(res.data || "Senha redefinida com sucesso.");
      // redireciona para login após 2s
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Erro ao resetar senha:", err);
      setError(err.response?.data || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white border rounded-lg shadow-md p-8 w-96 text-center">
          <h2 className="text-lg font-bold text-black mb-2">Nova Senha</h2>

          {/* Mensagens */}
          {message && <div className="mb-4 text-sm text-green-600">{message}</div>}
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          {/* Se não tiver token, mostra aviso */}
          {!token ? (
            <div className="text-sm text-gray-700">
              Link inválido ou expirado. Solicite um novo reset de senha.
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4 mt-6">
              <input
                type="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FA9D06] focus:border-transparent transition-all"
                required
                minLength={6}
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3 rounded-md transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#FA9D06] text-black hover:bg-[#e68a00] hover:shadow-lg"
                }`}
              >
                {loading ? "Redefinindo..." : "Confirmar Nova Senha"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResetPasswordConfirm;
