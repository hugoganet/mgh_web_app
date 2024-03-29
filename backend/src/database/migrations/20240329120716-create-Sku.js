/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skus', {
      skuId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries', // Ensure this matches the actual table name and primary key
          key: 'countryCode',
        },
      },
      fnsku: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      skuAcquisitionCostExc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAcquisitionCostInc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAfnTotalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      skuAverageSellingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMargin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMarginPercentage: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageReturnOnInvestmentRate: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageDailyReturnOnInvestmentRate: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      numberOfActiveDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      numberOfUnitSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      skuAverageUnitSoldPerDay: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      skuRestockAlertQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      skuIsTest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('skus');
  },
};
