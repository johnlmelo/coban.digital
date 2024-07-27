const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Envio = sequelize.define('Envio', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  step: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'envios',
});

module.exports = Envio;
