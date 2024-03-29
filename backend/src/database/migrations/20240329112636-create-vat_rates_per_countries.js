/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vat_rates_per_country', {
      vat_rate_per_country_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      vat_category_id: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'vat_categories',
          key: 'vat_category_id',
        },
      },
      vat_rate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vat_rates_per_country');
  },
};
