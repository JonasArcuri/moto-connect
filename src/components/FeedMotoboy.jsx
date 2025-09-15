import React, { useState, useEffect } from "react";

function FeedMotoboy() {
    const [vagas, setVagas] = useState([]);

     useEffect(() => {
        fetch("http://localhost:8080/api/vagas")
          .then((res) => res.json())
          .then((data) => setVagas(data))
          .catch((err) => console.error(err));
      }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            {/* Main */}
            <main className="flex-grow p-6">
                <div className="bg-[#4d4d4d] shadow-lg rounded-xl p-8 max-w-5xl mx-auto text-white">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        📋 Feed de Vagas
                    </h2>
                    <p className="text-lg mb-6 text-center">
                        Confira abaixo as vagas disponíveis para corridas:
                    </p>

                    {vagas.length === 0 ? (
                        <p className="text-center text-gray-300">
                            Nenhuma vaga disponível no momento.
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vagas.map((vaga) => (
                                <div
                                    key={vaga.id}
                                    className="bg-white text-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {vaga.restaurante}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">📍 {vaga.endereco}</p>
                                        <p className="text-sm text-gray-600 mb-1">💰 {vaga.valor}</p>
                                        <p className="text-sm text-gray-600 mb-1">📊 Taxas: {vaga.taxas}</p>
                                        <p className="text-sm text-gray-600 mb-1">🕒 Horário: {vaga.horario}</p>
                                        <p className="text-sm text-gray-600 mb-1">📌 Zona: {vaga.zona}</p>
                                        <p className="text-sm text-gray-600 mb-1">🏷️ Tipo: {vaga.tipo}</p>
                                        <p className="text-sm text-gray-600">{vaga.descricao}</p>
                                    </div>
                                    <button className="mt-4 bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md">
                                        Candidatar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
                <p className="text-sm font-bold">
                    Todos os Direitos Reservados á @JonasArcuri, MotoConnect 2025.
                </p>
            </footer>
        </div>
    );
}

export default FeedMotoboy;
