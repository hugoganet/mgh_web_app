/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('donations', {
      donation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'warehouse_id',
        },
      },
      donation_to: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      donation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      donation_note: {
        type: Sequelize.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('donations');
  },
};
