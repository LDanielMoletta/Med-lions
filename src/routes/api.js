// src/routes/api.js
const express = require('express');
const router = express.Router();

const medicoCtrl = require('../controllers/medicoController');
const pacienteCtrl = require('../controllers/pacienteController');
const consultaCtrl = require('../controllers/consultaController');
const relatorioCtrl = require('../reports/relatorioController');

// --- ROTAS DE MÉDICOS ---
router.get('/medicos', async (req, res) => {
    try {
        const { nome, especialidade } = req.query;
        if (nome && especialidade) {
            const porNome = await medicoCtrl.buscarMedicoPorNome(nome);
            const porEspecialidade = await medicoCtrl.buscarMedicoPorEspecialidade(especialidade);
            const combinados = [...porNome, ...porEspecialidade];
            const unicos = Array.from(new Map(combinados.map(m => [String(m._id), m])).values());
            return res.json(unicos);
        }
        if (nome) return res.json(await medicoCtrl.buscarMedicoPorNome(nome));
        if (especialidade) return res.json(await medicoCtrl.buscarMedicoPorEspecialidade(especialidade));
        return res.json(await medicoCtrl.listarMedicos());
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
});

router.post('/medicos', async (req, res) => {
    try {
        const { nome, especialidade } = req.body;
        const novo = await medicoCtrl.criarMedico(nome, especialidade);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.put('/medicos/:id', async (req, res) => {
    try {
        const atualizado = await medicoCtrl.atualizarMedico(req.params.id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

router.delete('/medicos/:id', async (req, res) => {
    try {
        await medicoCtrl.excluirMedico(req.params.id);
        res.json({ mensagem: 'Médico removido com sucesso.' });
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// --- ROTAS DE PACIENTES ---
router.get('/pacientes', async (req, res) => {
    try {
        const { nome, dataNascimento } = req.query;
        if (nome) return res.json(await pacienteCtrl.buscarPacientePorNome(nome));
        if (dataNascimento) return res.json(await pacienteCtrl.buscarPacientePorDataNascimento(dataNascimento));
        return res.json(await pacienteCtrl.listarPacientes());
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
});

router.post('/pacientes', async (req, res) => {
    try {
        const { nome, dataNascimento } = req.body;
        const novo = await pacienteCtrl.criarPaciente(nome, dataNascimento);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.put('/pacientes/:id', async (req, res) => {
    try {
        const atualizado = await pacienteCtrl.atualizarPaciente(req.params.id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

router.delete('/pacientes/:id', async (req, res) => {
    try {
        await pacienteCtrl.excluirPaciente(req.params.id);
        res.json({ mensagem: 'Paciente removido com sucesso.' });
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// --- ROTAS DE CONSULTAS ---
router.get('/consultas', async (req, res) => {
    try {
        const { data, descricao } = req.query;
        if (data) return res.json(await consultaCtrl.buscarConsultaPorData(data));
        if (descricao) return res.json(await consultaCtrl.buscarConsultaPorDescricao(descricao));
        return res.json(await consultaCtrl.listarConsultas());
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
});

router.post('/consultas', async (req, res) => {
    try {
        const { dataHora, medico, paciente, motivo } = req.body;
        const nova = await consultaCtrl.criarConsulta(dataHora, medico, paciente, motivo);
        res.status(201).json(nova);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/consultas/:id', async (req, res) => {
    try {
        await consultaCtrl.excluirConsulta(req.params.id);
        res.json({ mensagem: 'Consulta cancelada com sucesso.' });
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
});

// --- ROTAS DE RELATÓRIOS ---
router.get('/relatorios/consultas-medico/:id', async (req, res) => {
    try {
        res.json(await relatorioCtrl.relatorioConsultasPorMedico(req.params.id));
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/relatorios/pacientes-medico/:id', async (req, res) => {
    try {
        res.json(await relatorioCtrl.relatorioPacientesPorMedico(req.params.id));
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/relatorios/medicos-paciente/:id', async (req, res) => {
    try {
        res.json(await relatorioCtrl.relatorioMedicosPorPaciente(req.params.id));
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/relatorios/consultas-mes', async (req, res) => {
    try {
        const { mes } = req.query; // Ex: ?mes=2026-06
        res.json(await relatorioCtrl.relatorioConsultasPorMes(mes));
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.get('/status', async (req, res) => {
    try {
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    const expectedUser = process.env.APP_USER || 'admin';
    const expectedPass = process.env.APP_PASS || 'admin123';

    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
    }

    if (usuario === expectedUser && senha === expectedPass) {
        return res.json({ sucesso: true, usuario });
    }

    res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
});

module.exports = router;
