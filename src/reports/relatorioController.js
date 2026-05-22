// src/reports/relatorioController.js

const { consultas, medicos, pacientes } = require('../database/repository');

// 6. RELATÓRIO: Listar todas as consultas realizadas por um médico específico
const relatorioConsultasPorMedico = (idMedico) => {
    return consultas.filter(c => c.idMedico === idMedico);
};

// 6. RELATÓRIO: Listar todos os pacientes atendidos por um médico específico
const relatorioPacientesPorMedico = (idMedico) => {
    // Filtra as consultas do médico
    const consultasDoMedico = consultas.filter(c => c.idMedico === idMedico);
    
    // Mapeia para pegar os IDs dos pacientes de forma única (sem duplicados)
    const idsPacientes = [...new Set(consultasDoMedico.map(c => c.idPaciente))];
    
    // Retorna os objetos completos dos pacientes
    return pacientes.filter(p => idsPacientes.includes(p.id));
};

// 6. RELATÓRIO: Listar todos os médicos que atenderam um paciente específico
const relatorioMedicosPorPaciente = (idPaciente) => {
    // Filtra as consultas do paciente
    const consultasDoPaciente = consultas.filter(c => c.idPaciente === idPaciente);
    
    // Mapeia para pegar os IDs dos médicos de forma única (sem duplicados)
    const idsMedicos = [...new Set(consultasDoPaciente.map(c => c.idMedico))];
    
    // Retorna os objetos completos dos médicos
    return medicos.filter(m => idsMedicos.includes(m.id));
};

// 6. RELATÓRIO: Listar todas as consultas realizadas em um mês específico
// Espera o formato "AAAA-MM" (Ex: "2026-05") ou apenas "-MM-" dependendo de como salvou a string
const relatorioConsultasPorMes = (anoMes) => {
    if (!anoMes) {
        throw new Error("É necessário informar o ano e mês no formato 'AAAA-MM'.");
    }
    return consultas.filter(c => c.data.startsWith(anoMes));
};

module.exports = {
    relatorioConsultasPorMedico,
    relatorioPacientesPorMedico,
    relatorioMedicosPorPaciente,
    relatorioConsultasPorMes
};
