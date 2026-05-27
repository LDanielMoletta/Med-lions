const Medico = require('../models/Medico');

const criarMedico = async (nome, especialidade) => {
    if (!nome || !especialidade) {
        throw new Error('Nome e especialidade são obrigatórios.');
    }

    const medico = new Medico({ nome, especialidade });
    return medico.save();
};

const listarMedicos = async () => {
    return Medico.find().lean();
};

const atualizarMedico = async (id, novosDados) => {
    const medico = await Medico.findById(id);
    if (!medico) {
        throw new Error(`Médico com ID ${id} não foi encontrado.`);
    }

    if (novosDados.nome) medico.nome = novosDados.nome;
    if (novosDados.especialidade) medico.especialidade = novosDados.especialidade;

    return medico.save();
};

const excluirMedico = async (id) => {
    const medicoRemovido = await Medico.findByIdAndDelete(id);
    if (!medicoRemovido) {
        throw new Error(`Médico com ID ${id} não foi encontrado.`);
    }
    return medicoRemovido;
};

const buscarMedicoPorNome = async (nome) => {
    return Medico.find({ nome: new RegExp(nome, 'i') }).lean();
};

const buscarMedicoPorEspecialidade = async (especialidade) => {
    return Medico.find({ especialidade: new RegExp(especialidade, 'i') }).lean();
};

module.exports = {
    criarMedico,
    listarMedicos,
    atualizarMedico,
    excluirMedico,
    buscarMedicoPorNome,
    buscarMedicoPorEspecialidade
};
