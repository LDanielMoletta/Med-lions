const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const conectarBanco = require('./config/db');

const medicoCtrl = require('./controllers/medicoController');
const pacienteCtrl = require('./controllers/pacienteController');
const consultaCtrl = require('./controllers/consultaController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    console.log(`REQ ${req.method} ${req.originalUrl}`);
    next();
});
app.get('/api/test', (req, res) => res.json({ ok: true, route: '/api/test' }));
app.use('/api', (req, res, next) => {
    console.log(`API PREFIX ${req.method} ${req.originalUrl} -> ${req.path}`);
    next();
});
app.use('/api', (req, res, next) => {
    console.log('API SIMPLE MIDDLEWARE');
    next();
});
console.log('apiRoutes object:', typeof apiRoutes, apiRoutes && apiRoutes.stack && apiRoutes.stack.length);
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ erro: 'Endpoint não encontrado.' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const carregarDadosIniciais = async () => {
    const medicosExistentes = await medicoCtrl.listarMedicos();
    const pacientesExistentes = await pacienteCtrl.listarPacientes();
    if (medicosExistentes.length > 0 && pacientesExistentes.length > 0) {
        return;
    }

    const medico1 = await medicoCtrl.criarMedico('Dr. Carlos Silva', 'Cardiologia');
    const medico2 = await medicoCtrl.criarMedico('Dra. Ana Costa', 'Pediatria');
    const paciente1 = await pacienteCtrl.criarPaciente('Marcos Oliveira', '1985-04-12');

    await consultaCtrl.criarConsulta('2026-06-10 14:00', medico1._id, paciente1._id, 'Rotina cardiovascular');
};

const startServer = async () => {
    await conectarBanco();
    await carregarDadosIniciais();

    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor rodando com sucesso!`);
        console.log(`📍 Acesse: http://localhost:${PORT}`);
        console.log(`📂 API: http://localhost:${PORT}/api`);
    });
};

startServer().catch(error => {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
});
