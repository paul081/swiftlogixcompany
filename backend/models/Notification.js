const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('status_update', 'shipment_created', 'account_alert'),
        defaultValue: 'status_update'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    relatedId: {
        type: DataTypes.STRING, // e.g., trackingNumber
        allowNull: true
    }
});

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = Notification;
