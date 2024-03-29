/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_inventory_daily_updates', {
      afnInventoryDailyUpdateId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      skuId: {
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
      countryCode: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      actualPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      afnFulfillableQuantity: {
        type: Sequelize.INTEGER,
      },
      reportDocumentId: {
        type: Sequelize.STRING(250),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_inventory_daily_updates');
  },
};
