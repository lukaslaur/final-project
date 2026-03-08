const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ownerID: {
        type: DataTypes.UUID,
        allowNull:false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull:false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('Equipment', 'Furniture', 'Book', 'Other'),
        defaultValue: 'Other'
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    customIdFormat: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    version: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }

});

module.exports = Inventory;