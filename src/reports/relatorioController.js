const Consulta = require('../models/Consulta');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');

const relatorioConsultasPorMedico = async (idMedico) => {
    return Consulta.find({ medico: idMedico }).populate('paciente').lean();
};

const relatorioPacientesPorMedico = async (idMedico) => {
    const idsPacientes = await Consulta.find({ medico: idMedico }).distinct('paciente');
    return Paciente.find({ _id: { $in: idsPacientes } }).lean();
};

const relatorioMedicosPorPaciente = async (idPaciente) => {
    const idsMedicos = await Consulta.find({ paciente: idPaciente }).distinct('medico');
    return Medico.find({ _id: { $in: idsMedicos } }).lean();
};

const relatorioConsultasPorMes = async (anoMes) => {
    if (!anoMes) {
        throw new Error("É necessário informar o ano e mês no formato 'AAAA-MM'.");
    }

    const [ano, mes] = anoMes.split('-').map(Number);
    if (!ano || !mes || mes < 1 || mes > 12) {
        throw new Error("Formato inválido. Use 'AAAA-MM'.");
    }

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 1);

    return Consulta.find({
        dataHora: {
            $gte: inicio,
            $lt: fim
        }
    }).populate('medico paciente').lean();
};

module.exports = {
    relatorioConsultasPorMedico,
    relatorioPacientesPorMedico,
    relatorioMedicosPorPaciente,
    relatorioConsultasPorMes
};
