const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const Avaliacao = sequelize.define('Avaliacao', {
  tipo: {
    type: DataTypes.ENUM('internamento', 'endovenoso'),
    allowNull: false
  },
  descricao: DataTypes.TEXT
});

Paciente.hasMany(Avaliacao);
Avaliacao.belongsTo(Paciente);

module.exports = Avaliacao;