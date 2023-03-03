'use strict';

/** @type {import('sequelize-cli').Migration} */
const ItemCategory = {
  ELECTRONICS: 'electronics',
  FURNITURE_HOME: 'furniture and home',
  HEALTH_BEAUTY: 'health and beauty',
  AGRICULTURE_FOOD: 'agriculture and food',
  OTHER: 'other',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Items', {
      name: Sequelize.DataTypes.STRING,
      count: Sequelize.DataTypes.NUMBER,
      pricePerUnit: Sequelize.DataTypes.NUMBER,
      availableForSale: Sequelize.DataTypes.BOOLEAN,
      category: Sequelize.DataTypes.ENUM(Object.values(ItemCategory)),
      creationDate: Sequelize.DataTypes.DATE,
      updatedOn: Sequelize.DataTypes.DATE,
      deletionDate: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Items');
  },
};
