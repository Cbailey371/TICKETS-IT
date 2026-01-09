const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationConfig = sequelize.define('NotificationConfig', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    smtp_host: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    smtp_port: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    smtp_user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    smtp_pass: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

module.exports = NotificationConfig;
