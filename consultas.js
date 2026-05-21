// criar cadastro de consultas com ID unica e sequencial, data, hora e ID do medico
// cada consulta deve estar associada a um medico existente
// cada medico pode atender com horarios diferentes, mas não pode ter mais de uma consulta no mesmo horário
// criar um array para armazenar as consultas
// criar uma função para agendar uma consulta
// cirar sub menus para atualizar e excluir consultas
// e exportar as funções para serem usadas em outros arquivos

let consultas = [];
let idConsulta = 1;

function agendarConsulta(data, hora, idMedico, idPaciente, descricao) {
    const consulta = {
        id: idConsulta,
        data: data,
        hora: hora,
        idMedico: idMedico,
        idPaciente: idPaciente,
        descricao: descricao
    };
    consultas.push(consulta);
    idConsulta++;
    return consulta;
}

function atualizarConsulta(id, data, hora, idMedico, idPaciente, descricao) {
    const consulta = consultas.find(c => c.id === id);
    if (!consulta) {
        return "Consulta não encontrada.";
    }
    consulta.data = data || consulta.data;
    consulta.hora = hora || consulta.hora;
    consulta.idMedico = idMedico || consulta.idMedico;
    consulta.idPaciente = idPaciente || consulta.idPaciente;
    consulta.descricao = descricao || consulta.descricao;
    return "Consulta atualizada com sucesso.";
}

function excluirConsulta(id) {
    const index = consultas.findIndex(c => c.id === id);
    if (index === -1) {
        return "Consulta não encontrada.";
    }
    consultas.splice(index, 1);
    return "Consulta excluída com sucesso.";
}

module.exports = {
    agendarConsulta,
    atualizarConsulta,
    excluirConsulta,
    consultas
};
