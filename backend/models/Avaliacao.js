const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const Avaliacao = sequelize.define('Avaliacao', {
  tipo: {
    type: DataTypes.ENUM('internamento', 'endovenoso'),
    allowNull: false
  },
  departamento: {
    type: DataTypes.ENUM(
      'laboratorio_principal',
      'banco_de_sangue',
      'tarv',
      'consulta_externa',
      'estomatologia',
      'dermatologia'
    ),
    allowNull: false
  },
  descricao: DataTypes.TEXT
});

Paciente.hasMany(Avaliacao);
Avaliacao.belongsTo(Paciente);

module.exports = Avaliacao;
