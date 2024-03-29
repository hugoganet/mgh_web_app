/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_afn_shipments', {
      eanInAfnShipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      afnShipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_shipments',
          key: 'afn_shipment_id',
        },
      },
      ean: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      eanShippedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_afn_shipments');
  },
};
