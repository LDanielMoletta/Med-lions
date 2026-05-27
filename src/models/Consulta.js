const mongoose = require('mongoose');

const ConsultaSchema = new mongoose.Schema({
    dataHora: {
        type: Date,
        required: [true, 'A data e hora da consulta são obrigatórias']
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'Uma consulta precisa de um médico']
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'Uma consulta precisa de um paciente']
    },
    motivo: {
        type: String,
        trim: true,
        default: 'Consulta de rotina'
    }
}, { timestamps: true });

module.exports = mongoose.model('Consulta', ConsultaSchema);
