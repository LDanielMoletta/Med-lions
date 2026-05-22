// src/routes/api.js
const express = require('express');
const router = express.Router();

// Importa os controladores que você já criou
const medicoCtrl = require('../controllers/medicoController');
const pacienteCtrl = require('../controllers/pacienteController');
const consultaCtrl = require('../controllers/consultaController');
const relatorioCtrl = require('../reports/relatorioController');

// --- ROTAS DE MÉDICOS ---
router.get('/medicos', (req, res) => {
    const { nome, especialidade } = req.query;
    if (nome) return res.json(medicoCtrl.buscarMedicoPorNome(nome));
    if (especialidade) return res.json(medicoCtrl.buscarMedicoPorEspecialidade(especialidade));
    res.json(medicoCtrl.listarMedicos());
});

router.post('/medicos', (req, res) => {
    try {
        const { nome, especialidade } = req.body;
        const novo = medicoCtrl.criarMedico(nome, especialidade);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.put('/medicos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const atualizado = medicoCtrl.atualizarMedico(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

router.delete('/medicos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        medicoCtrl.excluirMedico(id);
        res.json({ mensagem: "Médico removido com sucesso." });
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// --- ROTAS DE PACIENTES ---
router.get('/pacientes', (req, res) => {
    const { nome, dataNascimento } = req.query;
    if (nome) return res.json(pacienteCtrl.buscarPacientePorNome(nome));
    if (dataNascimento) return res.json(pacienteCtrl.buscarPacientePorDataNascimento(dataNascimento));
    res.json(pacienteCtrl.listarPacientes());
});

router.post('/pacientes', (req, res) => {
    try {
        const { nome, dataNascimento } = req.body;
        const novo = pacienteCtrl.criarPaciente(nome, dataNascimento);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// --- ROTAS DE CONSULTAS ---
router.get('/consultas', (req, res) => {
    const { data, descricao } = req.query;
    if (data) return res.json(consultaCtrl.buscarConsultaPorData(data));
    if (descricao) return res.json(consultaCtrl.buscarConsultaPorDescricao(descricao));
    res.json(consultaCtrl.listarConsultas());
});

router.post('/consultas', (req, res) => {
    try {
        const { data, idMedico, idPaciente, descricao } = req.body;
        const nova = consultaCtrl.criarConsulta(data, parseInt(idMedico), parseInt(idPaciente), descricao);
        res.status(201).json(nova);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/consultas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        consultaCtrl.excluirConsulta(id);
        res.json({ mensagem: "Consulta cancelada com sucesso." });
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// --- ROTAS DE RELATÓRIOS ---
router.get('/relatorios/consultas-medico/:id', (req, res) => {
    res.json(relatorioCtrl.relatorioConsultasPorMedico(parseInt(req.params.id)));
});

router.get('/relatorios/pacientes-medico/:id', (req, res) => {
    res.json(relatorioCtrl.relatorioPacientesPorMedico(parseInt(req.params.id)));
});

router.get('/relatorios/medicos-paciente/:id', (req, res) => {
    res.json(relatorioCtrl.relatorioMedicosPorPaciente(parseInt(req.params.id)));
});

router.get('/relatorios/consultas-mes', (req, res) => {
    try {
        const { mes } = req.query; // Ex: ?mes=2026-06
        res.json(relatorioCtrl.relatorioConsultasPorMes(mes));
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

module.exports = router;
