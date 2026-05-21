// criar cadastro medicos com ID unica e sequencial, nome e especialidade
// criar um array para armazenar os medicos
// criar uma função para cadastrar um medico
// cirar sub menus para atualizar e excluir medicos
// e exportar as funções para serem usadas em outros arquivos

let medicos = [];
let idMedico = 1;

function cadastrarMedico(nome, especialidade) {
    const medico = {
        id: idMedico,
        nome: nome,
        especialidade: especialidade
    };
    medicos.push(medico);
    idMedico++;
    return medico;
}

function atualizarMedico(id, nome, especialidade) {
    const medico = medicos.find(m => m.id === id);
    if (!medico) {
        return "Médico não encontrado.";
    }
    medico.nome = nome || medico.nome;
    medico.especialidade = especialidade || medico.especialidade;
    return "Médico atualizado com sucesso.";
}

function excluirMedico(id) {
    const index = medicos.findIndex(m => m.id === id);
    if (index === -1) {
        return "Médico não encontrado.";
    }   
    medicos.splice(index, 1);
    return "Médico excluído com sucesso.";
}

module.exports = {
    cadastrarMedico,
    atualizarMedico,
    excluirMedico,
    medicos
};
