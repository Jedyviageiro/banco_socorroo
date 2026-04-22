const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');

const BancoSanguePedido = sequelize.define('BancoSanguePedido', {
  tipoSolicitacao: {
    type: DataTypes.ENUM('tipagem', 'prova_compatibilidade', 'reserva', 'transfusao'),
    allowNull: false,
  },
  componente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grupoSanguineo: {
    type: DataTypes.STRING,
  },
  unidades: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  urgencia: {
    type: DataTypes.ENUM('baixa', 'moderada', 'alta', 'critica'),
    allowNull: false,
    defaultValue: 'moderada',
  },
  estado: {
    type: DataTypes.ENUM('pendente', 'preparacao', 'pronto', 'entregue'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  justificacaoClinica: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Paciente.hasMany(BancoSanguePedido);
BancoSanguePedido.belongsTo(Paciente);

module.exports = BancoSanguePedido;
