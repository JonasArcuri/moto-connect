import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // importa o contexto

function CriarVaga() {
    const navigate = useNavigate();
    const { user } = useAuth(); // pega o user logado (estabelecimento)

    const [vaga, setVaga] = useState({
        endereco: "",
        valor: "",
        taxas: "",
        horario: "",
        zona: "",
        tipo: "",
        descricao: "",
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVaga({ ...vaga, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Auth user:", user);
        const estId = user?.estabelecimentoId; // ✅ usa o id do estabelecimento

        if (!estId) {
            setMensagem("❌ Estabelecimento não encontrado. Faça login novamente.");
            return;
        }

        // ✅ Payload com o id do estabelecimento
        const vagaComEstabelecimento = {
            ...vaga,
            estabelecimentoId: Number(estId),
            estabelecimento: { id: Number(estId) }, // em caso do backend esperar objeto
        };

        console.log("Enviando payload para /api/vagas:", vagaComEstabelecimento);

        try {
            const response = await fetch("http://localhost:8080/api/vagas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vagaComEstabelecimento),
            });

            const text = await response.text();
            console.log("Resposta do servidor:", response.status, text);

            if (response.ok) {
                setMensagem("✅ Vaga criada com sucesso!");
                setTimeout(() => navigate("/feedestabelecimento"), 1500);
            } else {
                let errMsg = text;
                try {
                    const parsed = JSON.parse(text);
                    errMsg = parsed.message || JSON.stringify(parsed);
                } catch { }
                setMensagem(`❌ Erro ao criar vaga (${response.status}): ${errMsg}`);
            }
        } catch (error) {
            console.error(error);
            setMensagem("❌ Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <main className="flex-grow flex items-center justify-center p-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full"
                >
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Criar Nova Vaga
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="endereco"
                            placeholder="Endereço"
                            value={vaga.endereco}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="valor"
                            placeholder="Valor Fixo"
                            value={vaga.valor}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="taxas"
                            placeholder="Taxas (ex: R$5, R$10)"
                            value={vaga.taxas}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="horario"
                            placeholder="Horário (ex: 18h às 00h)"
                            value={vaga.horario}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="zona"
                            placeholder="Zona (ex: Sul, Norte)"
                            value={vaga.zona}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                        />
                        <select
                            name="tipo"
                            value={vaga.tipo}
                            onChange={handleChange}
                            className="border p-2 rounded-md"
                            required
                        >
                            <option value="">Selecione o Tipo</option>
                            <option value="Fixo">Fixo</option>
                            <option value="Extra">Extra</option>
                        </select>
                    </div>

                    <textarea
                        name="descricao"
                        placeholder="Descrição da vaga"
                        value={vaga.descricao}
                        onChange={handleChange}
                        className="border p-2 rounded-md w-full mt-4"
                        rows="3"
                    ></textarea>

                    <button
                        type="submit"
                        className="mt-6 w-full bg-[#FA9D06] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#e68a00] transition-colors shadow-md"
                    >
                        Criar Vaga
                    </button>

                    {mensagem && (
                        <p className="mt-4 text-center font-medium text-gray-700">
                            {mensagem}
                        </p>
                    )}
                </form>
            </main>

            <footer className="bg-[#4d4d4d] text-white h-14 flex items-center justify-center">
                <p className="text-sm font-bold">Todos os Direitos Reservados @2025.</p>
            </footer>
        </div>
    );
}

export default CriarVaga;
