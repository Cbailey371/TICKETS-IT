const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TicketType = sequelize.define('TicketType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sla_response: {
        type: DataTypes.INTEGER, // in minutes
        defaultValue: 60,
    },
    sla_resolution: {
        type: DataTypes.INTEGER, // in hours
        defaultValue: 24,
    },
    is_global: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

module.exports = TicketType;
