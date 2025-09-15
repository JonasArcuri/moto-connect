import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function FeedEstabelecimento() {
    const { user } = useAuth(); // pega o user logado
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.estabelecimentoId) return;

        fetch(`http://localhost:8080/api/vagas/estabelecimento/${user.estabelecimentoId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar vagas");
                return res.json();
            })
            .then((data) => setVagas(data))
            .catch((err) => console.error("Erro ao carregar vagas:", err))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            {/* Main */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="grid gap-6 max-w-5xl w-full">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        📋 Minhas Vagas
                    </h2>

                    {loading ? (
                        <p className="text-center text-gray-500">Carregando...</p>
                    ) : vagas.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Nenhuma vaga criada ainda.
                        </p>
                    ) : (
                        vagas.map((vaga) => (
                            <div
                                key={vaga.id}
                                className="bg-white rounded-xl shadow-md p-6 text-center"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {vaga.restaurante}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 text-left text-gray-700">
                                    <p className="border rounded-md p-2">📍 {vaga.endereco}</p>
                                    <p className="border rounded-md p-2">💰 {vaga.valor}</p>
                                    <p className="border rounded-md p-2">📊 Taxas: {vaga.taxas}</p>
                                    <p className="border rounded-md p-2">🕒 {vaga.horario}</p>
                                    <p className="border rounded-md p-2">📌 {vaga.zona}</p>
                                    <p className="border rounded-md p-2">🏷️ {vaga.tipo}</p>
                                    <p className="col-span-2 border rounded-md p-2">
                                        📝 {vaga.descricao}
                                    </p>
                                </div>

                                {/* Botões */}
                                <div className="flex justify-center gap-4 mt-6">
                                    <button className="visu bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
                                        Editar
                                    </button>
                                    <button className="match bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow">
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
                <p className="text-sm font-bold">Todos os Direitos Reservados @2025.</p>
            </footer>
        </div>
    );
}

export default FeedEstabelecimento;
