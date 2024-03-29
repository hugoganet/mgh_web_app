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
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      skuAcquisitionCostExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAcquisitionCostInc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      skuAfnTotalQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      skuAverageSellingPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMargin: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      skuAverageNetMarginPercentage: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageReturnOnInvestmentRate: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      skuAverageDailyReturnOnInvestmentRate: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      numberOfActiveDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numberOfUnitSold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      skuAverageUnitSoldPerDay: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      skuRestockAlertQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      skuIsTest: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('skus');
  },
};
