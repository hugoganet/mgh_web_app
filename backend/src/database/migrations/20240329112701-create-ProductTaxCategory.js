/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_tax_categories', {
      productTaxCategoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'countryCode',
        },
      },
      productTaxCategoryName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      productTaxCategoryDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      vatCategoryId: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'vat_categories',
          key: 'vatCategoryId',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_tax_categories');
  },
};
