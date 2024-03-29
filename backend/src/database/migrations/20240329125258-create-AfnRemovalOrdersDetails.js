/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_orders_details', {
      afnRemovalOrderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      afnRemovalOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_removal_orders',
          key: 'afn_removal_order_id',
        },
      },
      skuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      fnsku: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      disposition: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      requestedQuantity: {
        type: Sequelize.INTEGER,
      },
      cancelledQuantity: {
        type: Sequelize.INTEGER,
      },
      disposedQuantity: {
        type: Sequelize.INTEGER,
      },
      shippedQuantity: {
        type: Sequelize.INTEGER,
      },
      inProcessQuantity: {
        type: Sequelize.INTEGER,
      },
      removalFee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      currency: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_orders_details');
  },
};
