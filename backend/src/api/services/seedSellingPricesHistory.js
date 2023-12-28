const db = require('../models/index');

const seedSellingPriceHistory = async () => {
  console.log('Seeding SellingPriceHistory...');
  try {
    const inventoryUpdates = await db.AfnInventoryDailyUpdate.findAll({});

    for (const update of inventoryUpdates) {
      const dateString = update.updatedAt.toISOString().split('T')[0];

      const record = {
        skuId: update.skuId,
        dailyPrice: update.actualPrice,
        currencyCode: update.currencyCode,
        date: dateString,
      };

      if (update.afnFulfillableQuantity > 0) {
        await db.SellingPriceHistory.upsert(record, {
          where: {
            skuId: update.skuId,
            date: dateString,
          },
        });
      } else {
        continue;
      }
    }

    console.log('SellingPriceHistory has been populated with recent data.');
  } catch (error) {
    console.error('Error seeding SellingPriceHistory:', error);
  }
};

module.exports = {
  seedSellingPriceHistory,
};
