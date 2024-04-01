/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const createAsinWarehouseQuantitiesView = `
      CREATE OR REPLACE VIEW asin_warehouse_quantities AS
      SELECT
        a.asin_id,
        MIN(ws.warehouse_in_stock_quantity / eia.ean_in_asin_quantity) AS total_warehouse_quantity
      FROM
        asins a
        JOIN eans_in_asins eia ON a.asin_id = eia.asin_id
        JOIN eans e ON eia.ean = e.ean
        JOIN warehouses_stock ws ON e.ean = ws.ean
      GROUP BY
        a.asin_id;
    `;

    await queryInterface.sequelize.query(createAsinWarehouseQuantitiesView);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'DROP VIEW IF EXISTS asin_warehouse_quantities',
    );
  },
};
