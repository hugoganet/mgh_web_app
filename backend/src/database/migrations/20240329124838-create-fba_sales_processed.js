/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fba_sales_processed', {
      fba_sale_processed_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: true,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      amazon_sales_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      sales_ship_country_code: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      sales_item_selling_price_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      sales_item_currency: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
      sales_sku_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sales_fba_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_purchase_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sales_cogs: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_gross_margin_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_gross_margin_per_item: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_gross_margin_percentage_per_item: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      sales_net_margin_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_net_margin_per_item: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sales_net_margin_percentage_per_item: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
      sales_roi_per_item: {
        type: Sequelize.DECIMAL(10, 5),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fba_sales_processed');
  },
};
