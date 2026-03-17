const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Shipment = require('./Shipment');
const User = require('./User');

const TrackingHistory = sequelize.define('TrackingHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    updatedBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

Shipment.hasMany(TrackingHistory, { foreignKey: 'trackingNumber', sourceKey: 'trackingNumber', as: 'history' });
TrackingHistory.belongsTo(Shipment, { foreignKey: 'trackingNumber', targetKey: 'trackingNumber' });

module.exports = TrackingHistory;
