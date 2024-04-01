/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('minimum_selling_prices', {
      minimum_selling_price_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      pricing_rule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pricing_rules',
          key: 'pricing_rule_id',
        },
      },
      enrolled_in_pan_eu: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      eligible_for_pan_eu: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      minimum_selling_price_local_and_pan_eu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      minimum_selling_price_efn: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maximum_selling_price_local_and_pan_eu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maximum_selling_price_efn: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('minimum_selling_prices');
  },
};
