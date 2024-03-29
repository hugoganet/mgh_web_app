/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_inventory_daily_updates', {
      afn_inventory_daily_update_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      sku: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      country_code: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      actual_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      afn_fulfillable_quantity: {
        type: Sequelize.INTEGER,
      },
      report_document_id: {
        type: Sequelize.STRING(250),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_inventory_daily_updates');
  },
};
