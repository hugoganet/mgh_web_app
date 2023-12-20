const sequelize = require('./database.js'); // Assuming this is the path to your Sequelize instance

/**
 * Create a SQL view to get the total warehouse quantity for each ASIN
 * @async
 * @function createSqlViews
 * @return {Promise<void>} Promise object that represents the completion of the operation
 * @throws {Error} Error creating SQL view
 */
async function createSqlViews() {
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

  try {
    await sequelize.query(createAsinWarehouseQuantitiesView);
    console.log('SQL view created successfully.');
  } catch (error) {
    console.error('Error creating SQL view:', error);
    throw error;
  }
}

module.exports = createSqlViews;
