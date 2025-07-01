// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userValidators = require('../validators/UserValidator');

const modelSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório'],
        unique: true,
        lowercase: true,
        validate: userValidators.email
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [8, 'A senha precisa ter no mínimo 8 caracteres'],
        validate: userValidators.password
    }
}, {
    timestamps: true,
    collection: 'users'
});

modelSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

modelSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const modelName = "User";

if (mongoose.connection?.models[modelName]) {
    module.exports = mongoose.connection.models[modelName];
} else {
    module.exports = mongoose.model(modelName, modelSchema);
}