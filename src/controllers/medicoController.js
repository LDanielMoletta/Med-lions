// src/controllers/medicoController.js

// Importa o banco de dados em memória e a função de ID do repositório
const { medicos, gerarMedicoId } = require('../database/repository');

// 1. CRIAÇÃO: Adiciona um novo médico com ID sequencial
const criarMedico = (nome, especialidade) => {
    if (!nome || !especialidade) {
        throw new Error("Nome e especialidade são obrigatórios.");
    }

    const novoMedico = {
        id: gerarMedicoId(),
        nome,
        especialidade
    };

    medicos.push(novoMedico);
    return novoMedico;
};

// 2. LEITURA: Retorna todos os médicos cadastrados
const listarMedicos = () => {
    return medicos;
};

// 3. ATUALIZAÇÃO: Atualiza os dados de um médico existente pelo ID
const atualizarMedico = (id, novosDados) => {
    const medico = medicos.find(m => m.id === id);
    
    if (!medico) {
        throw new Error(`Médico com ID ${id} não foi encontrado.`);
    }

    if (novosDados.nome) medico.nome = novosDados.nome;
    if (novosDados.especialidade) medico.especialidade = novosDados.especialidade;

    return medico;
};

// 4. EXCLUSÃO: Remove um médico do sistema pelo ID
const excluirMedico = (id) => {
    const indice = medicos.findIndex(m => m.id === id);

    if (indice === -1) {
        throw new Error(`Médico com ID ${id} não foi encontrado.`);
    }

    // Remove 1 elemento a partir do índice encontrado
    const [medicoRemovido] = medicos.splice(indice, 1);
    return medicoRemovido;
};

// 5. BUSCA: Busca médicos por nome (parcial/case-insensitive)
const buscarMedicoPorNome = (nome) => {
    return medicos.filter(m => m.nome.toLowerCase().includes(nome.toLowerCase()));
};

// 5. BUSCA: Busca médicos por especialidade (parcial/case-insensitive)
const buscarMedicoPorEspecialidade = (especialidade) => {
    return medicos.filter(m => m.especialidade.toLowerCase().includes(especialidade.toLowerCase()));
};

// Exporta todas as funções do controlador
module.exports = {
    criarMedico,
    listarMedicos,
    atualizarMedico,
    excluirMedico,
    buscarMedicoPorNome,
    buscarMedicoPorEspecialidade
};
