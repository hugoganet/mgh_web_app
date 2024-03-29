/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_inventory_daily_updates', {
      afnInventoryDailyUpdateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      sku: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      actualPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      afnFulfillableQuantity: {
        type: DataTypes.INTEGER,
      },
      reportDocumentId: {
        type: DataTypes.STRING(250),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_inventory_daily_updates');
  },
};
