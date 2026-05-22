// src/database/repository.js

// Arrays que armazenam os dados em memória
const medicos = [];
const pacientes = [];
const consultas = [];

// Contadores para geração de IDs sequenciais automáticos
let proximoMedicoId = 1;
let proximoPacienteId = 1;
let proximoConsultaId = 1;

// Funções utilitárias para gerar e incrementar os IDs
const gerarMedicoId = () => proximoMedicoId++;
const gerarPacienteId = () => proximoPacienteId++;
const gerarConsultaId = () => proximoConsultaId++;

// Função para resetar o banco (útil caso vá criar testes automatizados)
const limparBanco = () => {
    medicos.length = 0;
    pacientes.length = 0;
    consultas.length = 0;
    proximoMedicoId = 1;
    proximoPacienteId = 1;
    proximoConsultaId = 1;
};

// Exporta as estruturas e funções para serem usadas nos controllers
module.exports = {
    medicos,
    pacientes,
    consultas,
    gerarMedicoId,
    gerarPacienteId,
    gerarConsultaId,
    limparBanco
};
