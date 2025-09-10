import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../services/UserService';

function UserForm() {
    // Estados do formulário básicos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [cep, setCep] = useState('');
    const [tipo, setTipo] = useState('');

    // Estados específicos para Estabelecimento
    const [cnpj, setCnpj] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [categoria, setCategoria] = useState('');
    const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [descricao, setDescricao] = useState('');

    // Estados específicos para Motoboy
    const [cnh, setCnh] = useState('');
    const [placaMoto, setPlacaMoto] = useState('');
    const [modeloMoto, setModeloMoto] = useState('');
    const [anoMoto, setAnoMoto] = useState('');
    const [experiencia, setExperiencia] = useState('');
    const [telefoneContato, setTelefoneContato] = useState('');

    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [error, setError] = useState(null);
    const [formTitle, setFormTitle] = useState('Criar Novo Usuário');

    const navigate = useNavigate();
    const { id } = useParams();

    // useEffect para buscar os dados do usuário se estiver no modo de edição
    useEffect(() => {
        if (id) {
            setLoading(true);
            setFormTitle('Editar Usuário');
            const fetchUserData = async () => {
                try {
                    const userData = await getUserById(id);
                    // Dados básicos
                    setName(userData.name);
                    setEmail(userData.email);
                    setPassword(userData.password);
                    setCpf(userData.cpf);
                    setEndereco(userData.endereco);
                    setBairro(userData.bairro);
                    setCidade(userData.cidade);
                    setUf(userData.uf);
                    setCep(userData.cep);
                    setTipo(userData.tipo);

                    // Dados específicos do Estabelecimento
                    if (userData.tipo === 'Estabelecimento') {
                        setCnpj(userData.cnpj || '');
                        setNomeFantasia(userData.nomeFantasia || '');
                        setCategoria(userData.categoria || '');
                        setHorarioFuncionamento(userData.horarioFuncionamento || '');
                        setTelefone(userData.telefone || '');
                        setDescricao(userData.descricao || '');
                    }

                    // Dados específicos do Motoboy
                    if (userData.tipo === 'Motoboy') {
                        setCnh(userData.cnh || '');
                        setPlacaMoto(userData.placaMoto || '');
                        setModeloMoto(userData.modeloMoto || '');
                        setAnoMoto(userData.anoMoto || '');
                        setExperiencia(userData.experiencia || '');
                        setTelefoneContato(userData.telefoneContato || '');
                    }
                } catch (err) {
                    setError('Erro ao carregar os dados do usuário.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [id]);

    const handleCepChange = async (e) => {
        const inputCep = e.target.value.replace(/\D/g, '');
        setCep(inputCep);

        if (inputCep.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${inputCep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setEndereco(data.logradouro);
                    setBairro(data.bairro);
                    setCidade(data.localidade);
                    setUf(data.uf);
                } else {
                    alert('CEP não encontrado.');
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                alert('Erro ao buscar CEP. Tente novamente.');
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const handleTipoChange = (e) => {
        const newTipo = e.target.value;
        setTipo(newTipo);
        
        // Limpar campos específicos quando mudar o tipo
        if (newTipo !== 'Estabelecimento') {
            setCnpj('');
            setNomeFantasia('');
            setCategoria('');
            setHorarioFuncionamento('');
            setTelefone('');
            setDescricao('');
        }
        
        if (newTipo !== 'Motoboy') {
            setCnh('');
            setPlacaMoto('');
            setModeloMoto('');
            setAnoMoto('');
            setExperiencia('');
            setTelefoneContato('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let userData = {
            name, email, password, cpf, cep, endereco, bairro, cidade, uf, tipo
        };

        // Adicionar campos específicos baseado no tipo
        if (tipo === 'Estabelecimento') {
            userData = {
                ...userData,
                cnpj,
                nomeFantasia,
                categoria,
                horarioFuncionamento,
                telefone,
                descricao
            };
        } else if (tipo === 'Motoboy') {
            userData = {
                ...userData,
                cnh,
                placaMoto,
                modeloMoto,
                anoMoto,
                experiencia,
                telefoneContato
            };
        }

        try {
            if (id) {
                await updateUser(id, userData);
                alert('Usuário atualizado com sucesso!');
            } else {
                await createUser(userData);
                alert('Usuário criado com sucesso!');
            }
            navigate('/profile');
        } catch (err) {
            setError('Falha ao salvar usuário. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <p className="text-center text-gray-500">Carregando dados do usuário...</p>;
    }

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos básicos */}
                <div>
                    <label className="block text-gray-700 font-medium">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!id}
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {id && <p className="text-xs text-gray-500 mt-1">Deixe em branco para não alterar a senha.</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Você é:</label>
                    <select
                        value={tipo}
                        onChange={handleTipoChange}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Estabelecimento">Estabelecimento</option>
                        <option value="Motoboy">Motoboy</option>
                    </select>
                </div>

                {/* Campos específicos para Estabelecimento */}
                {tipo === 'Estabelecimento' && (
                    <div className="border-t pt-4 mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Estabelecimento</h3>
                        
                        <div>
                            <label className="block text-gray-700 font-medium">CNPJ</label>
                            <input
                                type="text"
                                value={cnpj}
                                onChange={(e) => setCnpj(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Nome Fantasia</label>
                            <input
                                type="text"
                                value={nomeFantasia}
                                onChange={(e) => setNomeFantasia(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Categoria</label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Selecione a categoria...</option>
                                <option value="Restaurante">Restaurante</option>
                                <option value="Lanchonete">Lanchonete</option>
                                <option value="Pizzaria">Pizzaria</option>
                                <option value="Padaria">Padaria</option>
                                <option value="Farmácia">Farmácia</option>
                                <option value="Supermercado">Supermercado</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Horário de Funcionamento</label>
                            <input
                                type="text"
                                value={horarioFuncionamento}
                                onChange={(e) => setHorarioFuncionamento(e.target.value)}
                                placeholder="Ex: 08:00 às 18:00"
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Telefone</label>
                            <input
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Descrição</label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows="3"
                                placeholder="Descreva seu estabelecimento..."
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                )}

                {/* Campos específicos para Motoboy */}
                {tipo === 'Motoboy' && (
                    <div className="border-t pt-4 mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Motoboy</h3>
                        
                        <div>
                            <label className="block text-gray-700 font-medium">CPF</label>
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">CNH</label>
                            <input
                                type="text"
                                value={cnh}
                                onChange={(e) => setCnh(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Placa da Moto</label>
                            <input
                                type="text"
                                value={placaMoto}
                                onChange={(e) => setPlacaMoto(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Modelo da Moto</label>
                            <input
                                type="text"
                                value={modeloMoto}
                                onChange={(e) => setModeloMoto(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Ano da Moto</label>
                            <input
                                type="number"
                                value={anoMoto}
                                onChange={(e) => setAnoMoto(e.target.value)}
                                min="1990"
                                max="2025"
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Experiência</label>
                            <select
                                value={experiencia}
                                onChange={(e) => setExperiencia(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Selecione...</option>
                                <option value="Menos de 1 ano">Menos de 1 ano</option>
                                <option value="1-2 anos">1-2 anos</option>
                                <option value="3-5 anos">3-5 anos</option>
                                <option value="Mais de 5 anos">Mais de 5 anos</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Telefone de Contato</label>
                            <input
                                type="text"
                                value={telefoneContato}
                                onChange={(e) => setTelefoneContato(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                )}

                {/* Campos de endereço (comum para ambos, mas só para Motoboy se não for estabelecimento) */}
                {(tipo === 'Estabelecimento' || tipo === 'Motoboy') && (
                    <div className="border-t pt-4 mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
                        
                        <div>
                            <label className="block text-gray-700 font-medium">CEP</label>
                            <input
                                type="text"
                                value={cep}
                                onChange={handleCepChange}
                                disabled={loadingCep}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={loadingCep ? "Buscando..." : "Digite o CEP (apenas números)"}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Endereço</label>
                            <input
                                type="text"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Bairro</label>
                            <input
                                type="text"
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Cidade</label>
                            <input
                                type="text"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">UF</label>
                            <input
                                type="text"
                                value={uf}
                                onChange={(e) => setUf(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : (id ? 'Atualizar Usuário' : 'Criar Usuário')}
                </button>
            </form>
        </div>
    );
}

export default UserForm;