/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_shipments_details', {
      afnRemovalShipmentId: {
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
      dataStartTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dataEndTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      requestDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      shipmentDate: {
        type: Sequelize.DATE,
        allowNull: false,
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
      shippedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      carrier: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      trackingNumber: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_shipments_details');
  },
};
