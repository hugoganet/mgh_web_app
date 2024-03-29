/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fba_fees', {
      fba_fee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      package_length: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      package_width: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      package_height: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      package_weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      price_grid_fba_fee_id: {
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
