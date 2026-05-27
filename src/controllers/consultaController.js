const mongoose = require('mongoose');
const Consulta = require('../models/Consulta');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');

const criarConsulta = async (data, idMedico, idPaciente, motivo) => {
    if (!data || !idMedico || !idPaciente) {
        throw new Error('Data/hora, médico e paciente são obrigatórios.');
    }

    if (!mongoose.Types.ObjectId.isValid(idMedico)) {
        throw new Error(`ID de médico inválido: ${idMedico}`);
    }
    if (!mongoose.Types.ObjectId.isValid(idPaciente)) {
        throw new Error(`ID de paciente inválido: ${idPaciente}`);
    }

    const dataHora = new Date(data);
    if (isNaN(dataHora)) {
        throw new Error('Formato de data/hora inválido. Use AAAA-MM-DD HH:MM.');
    }

    const medicoExiste = await Medico.exists({ _id: idMedico });
    const pacienteExiste = await Paciente.exists({ _id: idPaciente });

    if (!medicoExiste) {
        throw new Error(`Não é possível agendar: Médico com ID ${idMedico} não existe.`);
    }
    if (!pacienteExiste) {
        throw new Error(`Não é possível agendar: Paciente com ID ${idPaciente} não existe.`);
    }

    const medicoOcupado = await Consulta.exists({ medico: idMedico, dataHora });
    if (medicoOcupado) {
        throw new Error(`Agenda indisponível: O médico já possui uma consulta marcada na data/horário: ${data}.`);
    }

    const consulta = new Consulta({
        dataHora,
        medico: idMedico,
        paciente: idPaciente,
        motivo: motivo?.trim() || 'Consulta de rotina'
    });

    return consulta.save();
};

const listarConsultas = async () => {
    return Consulta.find().populate('medico paciente').sort({ dataHora: 1 }).lean();
};

const excluirConsulta = async (id) => {
    const consultaRemovida = await Consulta.findByIdAndDelete(id);
    if (!consultaRemovida) {
        throw new Error(`Consulta com ID ${id} não foi encontrada.`);
    }
    return consultaRemovida;
};

const buscarConsultaPorData = async (data) => {
    const dataHora = new Date(data);
    if (isNaN(dataHora)) {
        throw new Error('Formato de data inválido. Use AAAA-MM-DD ou AAAA-MM-DD HH:MM.');
    }

    const proximoDia = new Date(dataHora);
    if (data.length === 10) {
        proximoDia.setDate(proximoDia.getDate() + 1);
    } else {
        proximoDia.setSeconds(proximoDia.getSeconds() + 1);
    }

    return Consulta.find({
        dataHora: {
            $gte: dataHora,
            $lt: proximoDia
        }
    }).populate('medico paciente').lean();
};

const buscarConsultaPorMedico = async (idMedico) => {
    return Consulta.find({ medico: idMedico }).populate('medico paciente').lean();
};

const buscarConsultaPorPaciente = async (idPaciente) => {
    return Consulta.find({ paciente: idPaciente }).populate('medico paciente').lean();
};

const buscarConsultaPorDescricao = async (descricao) => {
    return Consulta.find({ motivo: new RegExp(descricao, 'i') }).populate('medico paciente').lean();
};

module.exports = {
    criarConsulta,
    listarConsultas,
    excluirConsulta,
    buscarConsultaPorData,
    buscarConsultaPorMedico,
    buscarConsultaPorPaciente,
    buscarConsultaPorDescricao
};
