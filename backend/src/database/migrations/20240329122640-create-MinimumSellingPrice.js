/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('minimum_selling_prices', {
      minimumSellingPriceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      skuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      pricingRuleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pricing_rules',
          key: 'pricing_rule_id',
        },
      },
      enrolledInPanEu: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      eligibleForPanEu: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      minimumSellingPriceLocalAndPanEu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      minimumSellingPriceEfn: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceLocalAndPanEu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceEfn: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('minimum_selling_prices');
  },
};
