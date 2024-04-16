/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asin_sourcing_catalog', {
      asinSourcingCatalogId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      asin: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'keepa_data',
          key: 'asin',
        },
      },
      ean: {
        type: Sequelize.CHAR(13),
        allowNull: false,
        references: {
          model: 'formatted_catalog',
          key: 'ean',
        },
      },
      productCategoryRank: {
        type: Sequelize.DECIMAL(6, 5),
      },
      averageSellingPriceInc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimAsinAcquisitionCostExc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimAsinAcquisitionCostInc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      minimumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      minimumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimMonthlyRevenu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimMonthlyMarginExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimAcquisitionCostExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimPersonalMonthlyQuantitySold: {
        type: DataTypes.INTEGER,
      },
      pvMoyenConstate: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      prepFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      transportFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      isHazmat: {
        type: DataTypes.BOOLEAN,
      },
      estimMonthlyQuantitySold: {
        type: DataTypes.INTEGER,
      },
      estimNumberOfSeller: {
        type: DataTypes.INTEGER,
      },
      desiredNumberOfWeeksCovered: {
        type: DataTypes.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asin_sourcing_catalog');
  },
};
