'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      deliveryDate: Sequelize.DataTypes.DATE,
      creationDate: Sequelize.DataTypes.DATE,
      updatedOn: Sequelize.DataTypes.DATE,
      deletionDate: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Orders');
  },
};
