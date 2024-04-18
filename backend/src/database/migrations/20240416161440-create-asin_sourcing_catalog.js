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
      keepaDataId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: 'keepa_data',
          key: 'keepa_data_id',
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
        type: Sequelize.DECIMAL(10, 2),
      },
      minimumSellingPriceEfn: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimMonthlyRevenu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimMonthlyMarginExc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimAcquisitionCostExc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estimPersonalMonthlyQuantitySold: {
        type: Sequelize.INTEGER,
      },
      pvMoyenConstate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fbaFees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      prepFees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      transportFees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      isHazmat: {
        type: Sequelize.BOOLEAN,
      },
      estimMonthlyQuantitySold: {
        type: Sequelize.INTEGER,
      },
      estimNumberOfSeller: {
        type: Sequelize.INTEGER,
      },
      desiredNumberOfWeeksCovered: {
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asin_sourcing_catalog');
  },
};
