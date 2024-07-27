const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactsSent: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },  
  steps: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  opened: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'campaigns',
});

module.exports = Campaign;