/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_grid_fba_fees', {
      priceGridFbaFeeId: {
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
          key: 'country_code',
        },
      },
      fbaPackageCategoryName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      categoryMaxWeight: {
        type: Sequelize.DECIMAL(10, 2),
      },
      categoryMaxLength: {
        type: Sequelize.DECIMAL(10, 2),
      },
      categoryMaxWidth: {
        type: Sequelize.DECIMAL(10, 2),
      },
      categoryMaxHeight: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaFeeLocalAndPanEu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaFeeEfn: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaFeeLowPriceLocalAndPanEu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaFeeLowPriceEfn: {
        type: Sequelize.DECIMAL(10, 2),
      },
      lowPriceThresholdInc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      hazmatFee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      currencyCode: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('price_grid_fba_fees');
  },
};
