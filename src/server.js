// src/server.js
const express = require('express');
const apiRoutes = require('./routes/api');

// Importa os controllers para popular dados de exemplo na API
const medicoCtrl = require('./controllers/medicoController');
const pacienteCtrl = require('./controllers/pacienteController');
const consultaCtrl = require('./controllers/consultaController');

const app = express();
const PORT = 3000;

// Middleware para permitir que o Express entenda requisições com dados em formato JSON
app.use(express.json());

// Função para pré-carregar dados e a API não iniciar vazia
const carregarDadosIniciais = () => {
    medicoCtrl.criarMedico("Dr. Carlos Silva", "Cardiologia");
    medicoCtrl.criarMedico("Dra. Ana Costa", "Pediatria");
    pacienteCtrl.criarPaciente("Marcos Oliveira", "1985-04-12");
    consultaCtrl.criarConsulta("2026-06-10 14:00", 1, 1, "Rotina cardiovascular");
};
carregarDadosIniciais();

// Vincula as rotas criadas ao prefixo /api
app.use('/api', apiRoutes);

// Inicializa o servidor HTTP
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor da API rodando com sucesso!`);
    console.log(`📍 URL Base: http://localhost:${PORT}/api`);
    console.log(`📂 Endpoints disponíveis:`);
    console.log(`   - GET/POST  http://localhost:${PORT}/api/medicos`);
    console.log(`   - GET/POST  http://localhost:${PORT}/api/pacientes`);
    console.log(`   - GET/POST  http://localhost:${PORT}/api/consultas`);
    console.log(`   - GET       http://localhost:${PORT}/api/relatorios/consultas-medico/1`);
});
