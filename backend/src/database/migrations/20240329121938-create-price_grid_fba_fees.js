/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_grid_fba_fees', {
      price_grid_fba_fee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      fba_package_category_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      category_max_weight: {
        type: Sequelize.DECIMAL(10, 2),
      },
      category_max_length: {
        type: Sequelize.DECIMAL(10, 2),
      },
      category_max_width: {
        type: Sequelize.DECIMAL(10, 2),
      },
      category_max_height: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_fee_local_and_pan_eu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_fee_efn_eu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_fee_low_price_local_and_pan_eu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_fee_low_price_efn: {
        type: Sequelize.DECIMAL(10, 2),
      },
      low_price_threshold_inc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      hazmat_fee: {
        type: Sequelize.DECIMAL(10, 2),
      },
      currency_code: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('price_grid_fba_fees');
  },
};
