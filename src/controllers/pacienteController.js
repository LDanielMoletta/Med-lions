// src/controllers/pacienteController.js

// Importa o banco de dados em memória e a função de ID do repositório
const { pacientes, gerarPacienteId } = require('../database/repository');

// 1. CRIAÇÃO: Adiciona um novo paciente com ID sequencial
const criarPaciente = (nome, dataNascimento) => {
    if (!nome || !dataNascimento) {
        throw new Error("Nome e data de nascimento são obrigatórios.");
    }

    const novoPaciente = {
        id: gerarPacienteId(),
        nome,
        dataNascimento // Espera uma string formatada (ex: "1990-05-15" ou "15/05/1990")
    };

    pacientes.push(novoPaciente);
    return novoPaciente;
};

// 2. LEITURA: Retorna todos os pacientes cadastrados
const listarPacientes = () => {
    return pacientes;
};

// 3. ATUALIZAÇÃO: Atualiza os dados de um paciente existente pelo ID
const atualizarPaciente = (id, novosDados) => {
    const paciente = pacientes.find(p => p.id === id);
    
    if (!paciente) {
        throw new Error(`Paciente com ID ${id} não foi encontrado.`);
    }

    if (novosDados.nome) paciente.nome = novosDados.nome;
    if (novosDados.dataNascimento) paciente.dataNascimento = novosDados.dataNascimento;

    return paciente;
};

// 4. EXCLUSÃO: Remove um paciente do sistema pelo ID
const excluirPaciente = (id) => {
    const indice = pacientes.findIndex(p => p.id === id);

    if (indice === -1) {
        throw new Error(`Paciente com ID ${id} não foi encontrado.`);
    }

    const [pacienteRemovido] = pacientes.splice(indice, 1);
    return pacienteRemovido;
};

// 5. BUSCA: Busca pacientes por nome (parcial/case-insensitive)
const buscarPacientePorNome = (nome) => {
    return pacientes.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
};

// 5. BUSCA: Busca pacientes por data de nascimento (exata)
const buscarPacientePorDataNascimento = (dataNascimento) => {
    return pacientes.filter(p => p.dataNascimento === dataNascimento);
};

// Exporta todas as funções do controlador
module.exports = {
    criarPaciente,
    listarPacientes,
    atualizarPaciente,
    excluirPaciente,
    buscarPacientePorNome,
    buscarPacientePorDataNascimento
};
