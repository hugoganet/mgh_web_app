/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vat_rates_per_country', {
      vatRatePerCountryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'countryCode',
        },
      },
      vatCategoryId: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'vat_categories',
          key: 'vatCategoryId',
        },
      },
      vatRate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vat_rates_per_country');
  },
};
