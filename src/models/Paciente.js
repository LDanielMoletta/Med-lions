const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do paciente é obrigatório'],
        trim: true
    },
    dataNascimento: {
        type: Date,
        required: [true, 'A data de nascimento é obrigatória']
    }
}, { timestamps: true });

module.exports = mongoose.model('Paciente', PacienteSchema);
