/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('afn_removal_orders', {
      afnRemovalOrderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazonId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastUpdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      orderType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      orderStatus: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      totalRemovalFee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      removalFeeCurrency: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afn_removal_orders');
  },
};
