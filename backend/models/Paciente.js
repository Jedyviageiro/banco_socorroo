const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idade: {
    type: DataTypes.INTEGER
  },
  sexo: {
    type: DataTypes.STRING
  },
  telefone: {
    type: DataTypes.STRING
  }
});

module.exports = Paciente;