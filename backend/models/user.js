const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique
  password: { type: String, required: true }, // Mot de passe
});

// Plugin pour la validation d'unicité
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

