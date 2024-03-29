/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fba_fees', {
      fbaFeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      packageLength: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWidth: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageHeight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWeight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      priceGridFbaFeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'price_grid_fba_fees',
          key: 'price_grid_fba_fee_id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fba_fees');
  },
};
