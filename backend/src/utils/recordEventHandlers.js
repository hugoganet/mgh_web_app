const eventBus = require('./eventBus');

// Initialize counters
let counters = {
  sku: {
    sku_created: 0,
    sku_found: 0,
  },
  asin: {
    asin_created: 0,
    asin_found: 0,
  },
  eanInAsin: {
    eanInAsin_created: 0,
    eanInAsin_found: 0,
  },
  fbaFee: {
    fbaFee_created: 0,
    fbaFee_found: 0,
  },
  asinSku: {
    asinSku_created: 0,
    asinSku_found: 0,
  },
  minimumSellingPrice: {
    minimumSellingPrice_created: 0,
    minimumSellingPrice_found: 0,
  },
  afnInventoryDailyUpdate: {
    afnInventoryDailyUpdate_created: 0,
    afnInventoryDailyUpdate_updated: 0,
  },
  sellingPriceHistory: {
    sellingPriceHistory_created: 0,
    sellingPriceHistory_found: 0,
  },
};

/**
 * @function handleRecordEvent
 * @description Handles the 'recordCreated' event by incrementing the counter for the respective record type.
 * @param {{ type: string }} data - The event data, containing the type of the record created.
 */
function handleRecordEvent({ type, action }) {
  if (counters[type] && counters[type][action] !== undefined) {
    counters[type][action]++;
  }
}

/**
 * @function startListening
 * @description Starts listening for 'recordCreated' events.
 */
function startListening() {
  eventBus.on('recordCreated', handleRecordEvent);
}

// Function to stop listening and reset counters
/**
 * @function stopListeningAndReset
 * @description Stops listening for 'recordCreated' events and resets the counters.
 */
function stopListeningAndReset() {
  eventBus.removeListener('recordCreated', handleRecordEvent);
  counters = Object.keys(counters).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        [`${key}_created`]: 0,
        [`${key}_found`]: 0,
      },
    }),
    {},
  );
}

/**
 * @function getCounts
 * @description Returns the current counts for each record type.
 * @return {Object} - The current counts for each record type.
 */
function getCounts() {
  return counters;
}

module.exports = { startListening, stopListeningAndReset, getCounts };
