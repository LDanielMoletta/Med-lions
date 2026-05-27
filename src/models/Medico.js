const mongoose = require('mongoose');

const MedicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do médico é obrigatório'],
        trim: true
    },
    especialidade: {
        type: String,
        required: [true, 'A especialidade do médico é obrigatória'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Medico', MedicoSchema);
