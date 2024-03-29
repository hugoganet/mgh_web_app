/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_shipments_details', {
      afnRemovalShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      afnRemovalOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_removal_orders',
          key: 'afn_removal_order_id',
        },
      },
      dataStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dataEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      shipmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      fnsku: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      disposition: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      shippedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carrier: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_shipments_details');
  },
};
