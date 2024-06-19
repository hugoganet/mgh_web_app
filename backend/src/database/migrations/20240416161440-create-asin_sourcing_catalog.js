/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asin_sourcing_catalog', {
      asin_sourcing_catalog_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      keepa_data_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: 'keepa_data',
          key: 'keepa_data_id',
        },
      },
      ean: {
        type: Sequelize.CHAR(13),
        allowNull: false,
        references: {
          model: 'formatted_catalog',
          key: 'ean',
        },
      },
      product_category_rank: {
        type: Sequelize.DECIMAL(6, 5),
      },
      average_selling_price_inc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_asin_acquisition_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_asin_acquisition_cost_inc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      minimum_selling_price_local_and_pan_eu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      minimum_selling_price_efn: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_monthly_revenu: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_monthly_margin_exc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_acquisition_cost_exc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      estim_personal_monthly_quantity_sold: {
        type: Sequelize.INTEGER,
      },
      pv_moyen_constate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      fba_fees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      prep_fees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      transport_fees: {
        type: Sequelize.DECIMAL(10, 2),
      },
      is_hazmat: {
        type: Sequelize.BOOLEAN,
      },
      estim_monthly_quantity_sold: {
        type: Sequelize.INTEGER,
      },
      estim_number_of_seller: {
        type: Sequelize.INTEGER,
      },
      desired_number_of_weeks_covered: {
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asin_sourcing_catalog');
  },
};
