/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses', {
      warehouse_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouse_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      warehouse_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      warehouse_postcode: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouse_city: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouse_country: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouse_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      warehouse_contact_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouse_contact_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouse_contact_email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses');
  },
};
