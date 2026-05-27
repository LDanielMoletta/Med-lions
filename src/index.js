// src/index.js

const readline = require('readline');
const { Table } = require('console-table-printer');
const conectarBanco = require('./config/db');

const medicoCtrl = require('./controllers/medicoController');
const pacienteCtrl = require('./controllers/pacienteController');
const consultaCtrl = require('./controllers/consultaController');
const relatorioCtrl = require('./reports/relatorioController');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const perguntar = (pergunta) => new Promise((resolve) => rl.question(pergunta, resolve));

const limparEExibirCabecalho = (titulo) => {
    console.clear();
    console.log('================================================================================');
    console.log(` 🏥 SISTEMA DE CONSULTAS MÉDICAS - ${titulo.toUpperCase()}`);
    console.log('================================================================================');
};

const exibirTabela = (titulo, dados, cor = 'white') => {
    if (!dados || dados.length === 0) {
        console.log(`\n⚠️  Nenhum registro encontrado para: ${titulo}`);
        return;
    }
    const tabela = new Table({ title: titulo.toUpperCase() });
    tabela.addRows(dados, { color: cor });
    tabela.printTable();
};

const carregarDadosDeTeste = async () => {
    const medicosExistentes = await medicoCtrl.listarMedicos();
    if (medicosExistentes.length > 0) {
        return;
    }

    const medico1 = await medicoCtrl.criarMedico('Dr. Carlos Silva', 'Cardiologia');
    const medico2 = await medicoCtrl.criarMedico('Dra. Ana Costa', 'Pediatria');
    const medico3 = await medicoCtrl.criarMedico('Dr. Roberto Souza', 'Cardiologia');

    const paciente1 = await pacienteCtrl.criarPaciente('Marcos Oliveira', '1985-04-12');
    const paciente2 = await pacienteCtrl.criarPaciente('Julia Santos', '1993-08-25');
    const paciente3 = await pacienteCtrl.criarPaciente('Lucas Almeida', '2010-11-02');

    await consultaCtrl.criarConsulta('2026-06-10 14:00', medico1._id, paciente1._id, 'Rotina cardiovascular');
    await consultaCtrl.criarConsulta('2026-06-10 16:00', medico1._id, paciente2._id, 'Check-up anual');
    await consultaCtrl.criarConsulta('2026-06-11 09:00', medico2._id, paciente3._id, 'Consulta pediátrica mensal');
};

async function menuPrincipal() {
    while (true) {
        limparEExibirCabecalho('Menu Principal');
        console.log('1. Gerenciar Médicos');
        console.log('2. Gerenciar Pacientes');
        console.log('3. Gerenciar Consultas');
        console.log('4. Relatórios e Relacionamentos');
        console.log('0. Sair do Sistema');
        console.log('================================================================================');
        
        const opcao = await perguntar('Escolha uma opção: ');

        switch (opcao) {
            case '1': await menuMedicos(); break;
            case '2': await menuPacientes(); break;
            case '3': await menuConsultas(); break;
            case '4': await menuRelatorios(); break;
            case '0':
                console.log('\n👋 Encerrando o sistema. Até logo!');
                rl.close();
                return;
            default:
                await perguntar('\n❌ Opção inválida! Pressione [Enter] para tentar novamente.');
        }
    }
}

async function menuMedicos() {
    while (true) {
        limparEExibirCabecalho('Gerenciamento de Médicos');
        console.log('1. Cadastrar Médico');
        console.log('2. Listar Todos os Médicos');
        console.log('3. Atualizar Dados de Médico');
        console.log('4. Remover Médico');
        console.log('5. Buscar Médico por Nome');
        console.log('6. Buscar Médico por Especialidade');
        console.log('0. Voltar ao Menu Principal');
        console.log('================================================================================');
        
        const opcao = await perguntar('Escolha uma opção: ');
        if (opcao === '0') return;

        try {
            switch (opcao) {
                case '1': {
                    const nome = await perguntar('Nome do Médico: ');
                    const esp = await perguntar('Especialidade: ');
                    const novoMed = await medicoCtrl.criarMedico(nome, esp);
                    console.log(`\n✅ Médico cadastrado com sucesso! ID gerado: ${novoMed._id}`);
                    break;
                }
                case '2': {
                    exibirTabela('Médicos Cadastrados', await medicoCtrl.listarMedicos(), 'cyan');
                    break;
                }
                case '3': {
                    const idAlt = await perguntar('ID do Médico a atualizar: ');
                    const novoNome = await perguntar('Novo Nome (deixe vazio para manter): ');
                    const novaEsp = await perguntar('Nova Especialidade (deixe vazio para manter): ');
                    await medicoCtrl.atualizarMedico(idAlt, { nome: novoNome || null, especialidade: novaEsp || null });
                    console.log('\n✅ Dados atualizados com sucesso!');
                    break;
                }
                case '4': {
                    const idDel = await perguntar('ID do Médico a remover: ');
                    await medicoCtrl.excluirMedico(idDel);
                    console.log('\n✅ Médico removido com sucesso!');
                    break;
                }
                case '5': {
                    const bNome = await perguntar('Digite o nome (ou parte dele): ');
                    exibirTabela(`Resultado para: ${bNome}`, await medicoCtrl.buscarMedicoPorNome(bNome), 'cyan');
                    break;
                }
                case '6': {
                    const bEsp = await perguntar('Digite a especialidade (ou parte dela): ');
                    exibirTabela(`Resultado para: ${bEsp}`, await medicoCtrl.buscarMedicoPorEspecialidade(bEsp), 'cyan');
                    break;
                }
                default:
                    console.log('\n❌ Opção inválida!');
            }
        } catch (error) {
            console.error(`\n🛑 Erro: ${error.message}`);
        }
        await perguntar('\nPressione [Enter] para continuar...');
    }
}

async function menuPacientes() {
    while (true) {
        limparEExibirCabecalho('Gerenciamento de Pacientes');
        console.log('1. Cadastrar Paciente');
        console.log('2. Listar Todos os Pacientes');
        console.log('3. Atualizar Dados de Paciente');
        console.log('4. Remover Paciente');
        console.log('5. Buscar Paciente por Nome');
        console.log('6. Buscar Paciente por Data de Nascimento');
        console.log('0. Voltar ao Menu Principal');
        console.log('================================================================================');
        
        const opcao = await perguntar('Escolha uma opção: ');
        if (opcao === '0') return;

        try {
            switch (opcao) {
                case '1': {
                    const nome = await perguntar('Nome do Paciente: ');
                    const dataNasc = await perguntar('Data de Nascimento (AAAA-MM-DD): ');
                    const novoPac = await pacienteCtrl.criarPaciente(nome, dataNasc);
                    console.log(`\n✅ Paciente cadastrado com sucesso! ID gerado: ${novoPac._id}`);
                    break;
                }
                case '2': {
                    exibirTabela('Pacientes Cadastrados', await pacienteCtrl.listarPacientes(), 'green');
                    break;
                }
                case '3': {
                    const idAlt = await perguntar('ID do Paciente a atualizar: ');
                    const nNome = await perguntar('Novo Nome (deixe vazio para manter): ');
                    const nData = await perguntar('Nova Data de Nasc. (deixe vazio para manter): ');
                    await pacienteCtrl.atualizarPaciente(idAlt, { nome: nNome || null, dataNascimento: nData || null });
                    console.log('\n✅ Dados atualizados com sucesso!');
                    break;
                }
                case '4': {
                    const idDel = await perguntar('ID do Paciente a remover: ');
                    await pacienteCtrl.excluirPaciente(idDel);
                    console.log('\n✅ Paciente removido com sucesso!');
                    break;
                }
                case '5': {
                    const bNome = await perguntar('Digite o nome (ou parte dele): ');
                    exibirTabela(`Resultado para: ${bNome}`, await pacienteCtrl.buscarPacientePorNome(bNome), 'green');
                    break;
                }
                case '6': {
                    const bData = await perguntar('Digite a data exata (AAAA-MM-DD): ');
                    exibirTabela(`Resultado para: ${bData}`, await pacienteCtrl.buscarPacientePorDataNascimento(bData), 'green');
                    break;
                }
                default:
                    console.log('\n❌ Opção inválida!');
            }
        } catch (error) {
            console.error(`\n🛑 Erro: ${error.message}`);
        }
        await perguntar('\nPressione [Enter] para continuar...');
    }
}

async function menuConsultas() {
    while (true) {
        limparEExibirCabecalho('Gerenciamento de Consultas');
        console.log('1. Agendar Nova Consulta');
        console.log('2. Listar Todas as Consultas');
        console.log('3. Cancelar/Remover Consulta');
        console.log('4. Buscar por Data');
        console.log('5. Buscar por Descrição');
        console.log('0. Voltar ao Menu Principal');
        console.log('================================================================================');
        const opcao = await perguntar('Escolha uma opção: ');
        if (opcao === '0') return;

        try {
            switch (opcao) {
                case '1': {
                    const data = await perguntar('Data da Consulta (AAAA-MM-DD HH:MM): ');
                    const idMedico = await perguntar('ID do Médico: ');
                    const idPaciente = await perguntar('ID do Paciente: ');
                    const descricao = await perguntar('Descrição da Consulta: ');
                    const novaConsulta = await consultaCtrl.criarConsulta(data, idMedico, idPaciente, descricao);
                    console.log(`\n✅ Consulta agendada com sucesso! ID gerado: ${novaConsulta._id}`);
                    break;
                }
                case '2': {
                    exibirTabela('Consultas Agendadas', await consultaCtrl.listarConsultas(), 'yellow');
                    break;
                }
                case '3': {
                    const idDel = await perguntar('ID da Consulta a cancelar: ');
                    await consultaCtrl.excluirConsulta(idDel);
                    console.log('\n✅ Consulta cancelada com sucesso!');
                    break;
                }
                case '4': {
                    const bData = await perguntar("Digite a data (AAAA-MM-DD ou AAAA-MM-DD HH:MM): ");
                    exibirTabela(`Consultas para data: ${bData}`, await consultaCtrl.buscarConsultaPorData(bData), 'yellow');
                    break;
                }
                case '5': {
                    const bDesc = await perguntar('Digite a descrição (ou parte dela): ');
                    exibirTabela(`Consultas para descrição: ${bDesc}`, await consultaCtrl.buscarConsultaPorDescricao(bDesc), 'yellow');
                    break;
                }
                default:
                    console.log('\n❌ Opção inválida!');
            }
        } catch (error) {
            console.error(`\n🛑 Erro: ${error.message}`);
        }
        await perguntar('\nPressione [Enter] para continuar...');
    }
}

async function menuRelatorios() {
    while (true) {
        limparEExibirCabecalho('Relatórios e Relacionamentos');
        console.log('1. Consultas por Médico');
        console.log('2. Pacientes por Médico');
        console.log('3. Médicos por Paciente');
        console.log('4. Consultas por Mês');
        console.log('0. Voltar ao Menu Principal');
        console.log('================================================================================');
        const opcao = await perguntar('Escolha uma opção: ');
        if (opcao === '0') return;

        try {
            switch (opcao) {
                case '1': {
                    const idMed = await perguntar('ID do Médico: ');
                    exibirTabela(`Consultas do Médico ID ${idMed}`, await relatorioCtrl.relatorioConsultasPorMedico(idMed), 'magenta');
                    break;
                }
                case '2': {
                    const idMed2 = await perguntar('ID do Médico: ');
                    exibirTabela(`Pacientes atendidos pelo Médico ID ${idMed2}`, await relatorioCtrl.relatorioPacientesPorMedico(idMed2), 'magenta');
                    break;
                }
                case '3': {
                    const idPac = await perguntar('ID do Paciente: ');
                    exibirTabela(`Médicos atendidos pelo Paciente ID ${idPac}`, await relatorioCtrl.relatorioMedicosPorPaciente(idPac), 'magenta');
                    break;
                }
                case '4': {
                    const anoMes = await perguntar('Digite o ano e mês (AAAA-MM): ');
                    exibirTabela(`Consultas no mês: ${anoMes}`, await relatorioCtrl.relatorioConsultasPorMes(anoMes), 'magenta');
                    break;
                }
                default:
                    console.log('\n❌ Opção inválida!');
            }
        } catch (error) {
            console.error(`\n🛑 Erro: ${error.message}`);
        }
        await perguntar('\nPressione [Enter] para continuar...');
    }
}

const iniciarSistema = async () => {
    await conectarBanco();
    await carregarDadosDeTeste();
    await menuPrincipal();
};

iniciarSistema().catch(error => {
    console.error('Erro ao iniciar sistema:', error);
    process.exit(1);
});

