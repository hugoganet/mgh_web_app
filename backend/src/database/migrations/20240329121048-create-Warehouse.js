/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses', {
      warehouseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouseName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      warehouseAddress: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      warehousePostcode: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouseCity: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouseCountry: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouseNote: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      warehouseContactName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      warehouseContactNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      warehouseContactEmail: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses');
  },
};
