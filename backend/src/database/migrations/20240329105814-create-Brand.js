/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      brandId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      brandName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('brands');
  },
};
