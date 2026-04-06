const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    receiverName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiverEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiverAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    packageWeight: {
        type: DataTypes.STRING
    },
    packageType: {
        type: DataTypes.STRING
    },
    originCountry: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Nigeria'
    },
    destinationCountry: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'United States'
    },
    shipmentStatus: {
        type: DataTypes.ENUM('Register/Creating', 'Sort', 'Dispatch', 'Transit', 'Customs', 'Destination Hub', 'Out for Delivery', 'Delivered', 'Cancelled'),
        defaultValue: 'Register/Creating'
    },
    currentLocation: {
        type: DataTypes.STRING,
        defaultValue: 'Origin Warehouse'
    },
    createdBy: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: true
    },
    customsFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    insuranceFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    deliveryCharges: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    storageFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    showFinancials: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['trackingNumber']
        }
    ]
});

User.hasMany(Shipment, { foreignKey: 'createdBy', as: 'managedShipments' });
Shipment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Shipment;
