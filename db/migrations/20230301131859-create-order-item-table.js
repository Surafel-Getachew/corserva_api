'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderItems', {
      orderId: {
        type: Sequelize.DataTypes.NUMBER,
        references: { model: 'orders', key: 'id' },
      },
      itemId: {
        type: Sequelize.DataTypes.NUMBER,
        references: { model: 'items', key: 'id' },
      },
      quantity: Sequelize.DataTypes.NUMBER,
      updatedOn: Sequelize.DataTypes.DATE,
      deletionDate: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('OrderItems');
  },
};
