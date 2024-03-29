/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fba_fees', {
      fbaFeeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      packageLength: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWidth: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      packageHeight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWeight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      priceGridFbaFeeId: {
        type: Sequelize.INTEGER,
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
