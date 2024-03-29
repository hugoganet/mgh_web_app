/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_afn_removal_orders', {
      ean_in_afn_removal_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      afn_removal_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'afn_removal_orders',
          key: 'afn_removal_order_id',
        },
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      ean_shipped_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ean_received_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_afn_removal_orders');
  },
};
