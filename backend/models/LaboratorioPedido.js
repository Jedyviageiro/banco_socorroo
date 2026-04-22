const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const LaboratorioPedido = sequelize.define('LaboratorioPedido', {
  tipoExame: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prioridade: {
    type: DataTypes.ENUM('rotina', 'urgente', 'muito_urgente'),
    allowNull: false,
    defaultValue: 'rotina',
  },
  amostra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('recebido', 'em_analise', 'concluido'),
    allowNull: false,
    defaultValue: 'recebido',
  },
  indicacaoClinica: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resultadoResumo: {
    type: DataTypes.TEXT,
  },
});

Paciente.hasMany(LaboratorioPedido);
LaboratorioPedido.belongsTo(Paciente);

module.exports = LaboratorioPedido;
