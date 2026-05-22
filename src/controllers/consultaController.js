// src/controllers/consultaController.js

const { consultas, gerarConsultaId, medicos, pacientes } = require('../database/repository');

// 1. CRIAÇÃO: Adiciona uma nova consulta com validações de regras de negócio
const criarConsulta = (data, idMedico, idPaciente, descricao) => {
    if (!data || !idMedico || !idPaciente || !descricao) {
        throw new Error("Todos os campos (data, idMedico, idPaciente, descricao) são obrigatórios.");
    }

    // Validação extra: Garante que o médico e o paciente existem no sistema
    const medicoExiste = medicos.some(m => m.id === idMedico);
    const pacienteExiste = pacientes.some(p => p.id === idPaciente);

    if (!medicoExiste) {
        throw new Error(`Não é possível agendar: Médico com ID ${idMedico} não existe.`);
    }
    if (!pacienteExiste) {
        throw new Error(`Não é possível agendar: Paciente com ID ${idPaciente} não existe.`);
    }

    // REGRA DE REQUISITO: Não permitir consulta para o mesmo médico na mesma data
    // Nota: O formato da data deve ser padronizado (Ex: "2026-05-25" ou "2026-05-25 14:00")
    const medicoOcupado = consultas.some(c => c.idMedico === idMedico && c.data === data);

    if (medicoOcupado) {
        throw new Error(`Agenda indisponível: O médico já possui uma consulta marcada na data/horário: ${data}.`);
    }

    const novaConsulta = {
        id: gerarConsultaId(),
        data,
        idMedico,
        idPaciente,
        descricao
    };

    consultas.push(novaConsulta);
    return novaConsulta;
};

// 2. LEITURA: Listar todas as consultas cadastradas
const listarConsultas = () => {
    return consultas;
};

// 4. EXCLUSÃO: Remover uma consulta do sistema pelo ID
const excluirConsulta = (id) => {
    const indice = consultas.findIndex(c => c.id === id);

    if (indice === -1) {
        throw new Error(`Consulta com ID ${id} não foi encontrada.`);
    }

    const [consultaRemovida] = consultas.splice(indice, 1);
    return consultaRemovida;
};

// 5. BUSCAS ESPECÍFICAS EXIGIDAS NO REQUISITO
const buscarConsultaPorData = (data) => {
    return consultas.filter(c => c.data.includes(data));
};

const buscarConsultaPorMedico = (idMedico) => {
    return consultas.filter(c => c.idMedico === idMedico);
};

const buscarConsultaPorPaciente = (idPaciente) => {
    return consultas.filter(c => c.idPaciente === idPaciente);
};

const buscarConsultaPorDescricao = (descricao) => {
    return consultas.filter(c => c.descricao.toLowerCase().includes(descricao.toLowerCase()));
};

module.exports = {
    criarConsulta,
    listarConsultas,
    excluirConsulta,
    buscarConsultaPorData,
    buscarConsultaPorMedico,
    buscarConsultaPorPaciente,
    buscarConsultaPorDescricao
};
