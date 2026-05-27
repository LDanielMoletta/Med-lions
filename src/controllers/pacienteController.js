const Paciente = require('../models/Paciente');

const criarPaciente = async (nome, dataNascimento) => {
    if (!nome || !dataNascimento) {
        throw new Error('Nome e data de nascimento são obrigatórios.');
    }

    const data = new Date(dataNascimento);
    if (isNaN(data)) {
        throw new Error('Formato de data de nascimento inválido. Use AAAA-MM-DD.');
    }

    const paciente = new Paciente({ nome, dataNascimento: data });
    return paciente.save();
};

const listarPacientes = async () => {
    return Paciente.find().lean();
};

const atualizarPaciente = async (id, novosDados) => {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        throw new Error(`Paciente com ID ${id} não foi encontrado.`);
    }

    if (novosDados.nome) paciente.nome = novosDados.nome;
    if (novosDados.dataNascimento) {
        const data = new Date(novosDados.dataNascimento);
        if (isNaN(data)) {
            throw new Error('Formato de data de nascimento inválido. Use AAAA-MM-DD.');
        }
        paciente.dataNascimento = data;
    }

    return paciente.save();
};

const excluirPaciente = async (id) => {
    const pacienteRemovido = await Paciente.findByIdAndDelete(id);
    if (!pacienteRemovido) {
        throw new Error(`Paciente com ID ${id} não foi encontrado.`);
    }
    return pacienteRemovido;
};

const buscarPacientePorNome = async (nome) => {
    return Paciente.find({ nome: new RegExp(nome, 'i') }).lean();
};

const buscarPacientePorDataNascimento = async (dataNascimento) => {
    const data = new Date(dataNascimento);
    if (isNaN(data)) {
        throw new Error('Formato de data de nascimento inválido. Use AAAA-MM-DD.');
    }

    const proximoDia = new Date(data);
    proximoDia.setDate(proximoDia.getDate() + 1);

    return Paciente.find({
        dataNascimento: {
            $gte: data,
            $lt: proximoDia
        }
    }).lean();
};

module.exports = {
    criarPaciente,
    listarPacientes,
    atualizarPaciente,
    excluirPaciente,
    buscarPacientePorNome,
    buscarPacientePorDataNascimento
};
