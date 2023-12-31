const db = require('../../../../api/models/index');

/**
 * @function seedSellingPriceHistory
 * @description Populates the SellingPriceHistory table with recent data.
 * @async
 * @return {Promise<void>} - A promise that resolves when the SellingPriceHistory table has been populated with recent data.
 */
const seedSellingPriceHistory = async () => {
  try {
    // Get all inventory updates
    const inventoryUpdates = await db.AfnInventoryDailyUpdate.findAll();
    console.log(inventoryUpdates.length);
    // console.log(inventoryUpdates);

    for (const update of inventoryUpdates) {
      // Get the date of the update
      const dateString = update.updatedAt.toISOString().split('T')[0];

      // Create a record to insert into the SellingPriceHistory table
      const record = {
        skuId: update.skuId,
        dailyPrice: update.actualPrice,
        currencyCode: update.currencyCode,
        date: dateString,
      };

      // Only insert records with a positive quantity
      if (update.afnFulfillableQuantity > 0) {
        await db.SellingPriceHistory.upsert(record, {
          where: {
            skuId: update.skuId,
            date: dateString,
          },
        });
        console.log(
          `Record with skuId : ${update.skuId}, inserted into SellingPriceHistory`,
        );
      } else {
        continue;
      }
    }
  } catch (error) {
    console.error('Error seeding SellingPriceHistory:', error);
  }
};

module.exports = {
  seedSellingPriceHistory,
};
