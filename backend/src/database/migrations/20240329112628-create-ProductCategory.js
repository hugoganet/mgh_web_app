/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_categories', {
      productCategoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      productCategoryNameEn: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      productCategoryNameFr: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      productCategoryNameDe: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      productCategoryNameEs: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      productCategoryNameIt: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_categories');
  },
};
