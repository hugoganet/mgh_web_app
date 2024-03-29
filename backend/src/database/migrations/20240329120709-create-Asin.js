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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      productCategoryRankId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'product_categories_ranks',
          key: 'product_category_rank_id',
        },
      },
      productTaxCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_tax_categories',
          key: 'product_tax_category_id',
        },
      },
      asinPreparation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      urlAmazon: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      urlImage: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      asinName: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      asinNumberOfActiveSku: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      asinAverageUnitSoldPerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      isBatteryRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHazmat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asins');
  },
};
