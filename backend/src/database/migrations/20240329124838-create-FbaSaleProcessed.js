/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fba_sales_processed', {
      fbaSaleProcessedId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        allowNull: true,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      amazonSalesId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      salesShipCountryCode: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      salesItemSellingPriceExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      salesItemCurrency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
      salesSkuQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      salesFbaFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesPurchaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      salesCogs: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginPerItem: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesGrossMarginPercentagePerItem: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      salesNetMarginTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesNetMarginPerItem: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salesNetMarginPercentagePerItem: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      salesRoiPerItem: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fba_sales_processed');
  },
};
