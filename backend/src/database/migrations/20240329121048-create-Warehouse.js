/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses', {
      warehouseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      warehouseName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      warehouseAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      warehousePostcode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      warehouseCity: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      warehouseCountry: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      warehouseNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      warehouseContactName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      warehouseContactNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      warehouseContactEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses');
  },
};
