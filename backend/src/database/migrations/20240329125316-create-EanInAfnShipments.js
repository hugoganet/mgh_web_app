/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_afn_shipments', {
      eanInAfnShipmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      afnShipmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_shipments',
          key: 'afn_shipment_id',
        },
      },
      ean: {
        type: Sequelize.CHAR(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      eanShippedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_afn_shipments');
  },
};
