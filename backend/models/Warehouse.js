const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Warehouse = sequelize.define('Warehouse', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Warehouse;
