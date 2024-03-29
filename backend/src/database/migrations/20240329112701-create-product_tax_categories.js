/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_tax_categories', {
      product_tax_category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      product_tax_category_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      product_tax_category_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      vat_category_id: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'vat_categories',
          key: 'vat_category_id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_tax_categories');
  },
};
