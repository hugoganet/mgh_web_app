/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('donations', {
      donationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      donationTo: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      donationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      donationNote: {
        type: DataTypes.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('donations');
  },
};
