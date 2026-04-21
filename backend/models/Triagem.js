const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const Triagem = sequelize.define('Triagem', {
  temperatura: DataTypes.FLOAT,
  pressao: DataTypes.STRING,
  sintomas: DataTypes.TEXT
});

Paciente.hasMany(Triagem);
Triagem.belongsTo(Paciente);

module.exports = Triagem;