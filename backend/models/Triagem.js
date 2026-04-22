const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const Triagem = sequelize.define('Triagem', {
  temperatura: DataTypes.FLOAT,
  pressao: DataTypes.STRING,
  saturacaoOxigenio: DataTypes.FLOAT,
  frequenciaCardiaca: DataTypes.INTEGER,
  frequenciaRespiratoria: DataTypes.INTEGER,
  nivelDor: DataTypes.INTEGER,
  estadoGeral: DataTypes.STRING,
  sintomas: DataTypes.TEXT,
  diagnosticoSugerido: DataTypes.STRING,
  departamentoSugerido: {
    type: DataTypes.ENUM(
      'laboratorio_principal',
      'banco_de_sangue',
      'tarv',
      'consulta_externa',
      'estomatologia',
      'dermatologia'
    ),
  },
  prioridadeAtendimento: {
    type: DataTypes.ENUM('baixa', 'moderada', 'alta', 'muito_alta'),
  },
  motivoEncaminhamento: DataTypes.TEXT
});

Paciente.hasMany(Triagem);
Triagem.belongsTo(Paciente);

module.exports = Triagem;
