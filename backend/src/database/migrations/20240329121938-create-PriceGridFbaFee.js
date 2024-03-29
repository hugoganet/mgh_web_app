/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_grid_fba_fees', {
      priceGridFbaFeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      fbaPackageCategoryName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      categoryMaxWeight: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxLength: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxWidth: {
        type: DataTypes.DECIMAL(10, 2),
      },
      categoryMaxHeight: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLowPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFeeLowPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      lowPriceThresholdInc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      hazmatFee: {
        type: DataTypes.DECIMAL(10, 2),
      },
      currencyCode: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('price_grid_fba_fees');
  },
};
