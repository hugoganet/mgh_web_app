/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vat_categories', {
      vatCategoryId: {
        type: Sequelize.STRING(2),
        primaryKey: true,
        allowNull: false,
      },
      vatCategoryDefinition: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vat_categories');
  },
};
