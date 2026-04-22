const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departamento: {
    type: DataTypes.ENUM(
      'administracao',
      'laboratorio_principal',
      'banco_de_sangue',
      'tarv',
      'consulta_externa',
      'estomatologia',
      'dermatologia'
    ),
    allowNull: false,
    defaultValue: 'administracao',
  },
});

module.exports = Usuario;
