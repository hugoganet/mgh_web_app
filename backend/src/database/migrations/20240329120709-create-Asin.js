/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asins', {
      asinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      asin: {
        type: Sequelize.STRING(10),
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
      productCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      productCategoryRankId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'product_categories_ranks',
          key: 'product_category_rank_id',
        },
      },
      productTaxCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_tax_categories',
          key: 'product_tax_category_id',
        },
      },
      asinPreparation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      urlAmazon: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      urlImage: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      asinName: {
        type: Sequelize.TEXT(),
        allowNull: false,
      },
      asinNumberOfActiveSku: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asinAverageUnitSoldPerDay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      isBatteryRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHazmat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asins');
  },
};
