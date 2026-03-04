const {sequelize} = require('../config/database');
const User = require ('./User');
const Inventory = require ('./Inventory');

User.hasMany(Inventory, {as: 'ownedInventories', foreignKey:'ownerID'});
Inventory.belongsTo(User, {as: 'owner', foreignKey:'ownerID'});
User.belongsToMany(Inventory, {through: 'InventoryAccess', as: 'accessibleInventories'});
Inventory.belongsToMany(User, {through: 'InventoryAccess', as: 'writers'});


const models = {
    User,
    Inventory
};

module.exports = {sequelize, models}