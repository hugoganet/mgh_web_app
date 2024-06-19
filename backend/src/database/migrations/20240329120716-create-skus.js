/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skus', {
      sku_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      fnsku: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      sku_acquisition_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      sku_acquisition_cost_inc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      sku_afn_total_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku_average_selling_price_inc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sku_average_net_margin: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sku_average_net_margin_percentage: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      sku_average_return_on_investment_rate: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      sku_average_daily_return_on_investment_rate: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      number_of_active_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      number_of_unit_sold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku_average_unit_sold_per_day: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      sku_restock_alert_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      sku_is_test: {
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
