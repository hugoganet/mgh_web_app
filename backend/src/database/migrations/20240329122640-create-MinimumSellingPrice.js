/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('minimum_selling_prices', {
      minimumSellingPriceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      pricingRuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pricing_rules',
          key: 'pricing_rule_id',
        },
      },
      enrolledInPanEu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      eligibleForPanEu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      minimumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      minimumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('minimum_selling_prices');
  },
};
