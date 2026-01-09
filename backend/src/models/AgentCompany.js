const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgentCompany = sequelize.define('AgentCompany', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Foreign keys created by association
}, {
    timestamps: false,
});

module.exports = AgentCompany;
