const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * @function getMyFeesEstimateForAsin
 * @description Fetches fees estimate for a given ASIN.
 * @async
 * @param {Object} params - Parameters for the fee estimates request.
 * @return {Promise<Object>} - Fees estimate for the specified ASIN.
 */
async function getMyFeesEstimateForAsin(params) {
  const {
    marketplaceId,
    asin,
    price,
    isAmazonFulfilled,
    currencyCode,
    OptionalFulfillmentProgram,
    createLog,
    logContext = 'getMyFeesEstimateForAsin',
  } = params;

  const apiOperation = 'getMyFeesEstimateForASIN';
  const endpoint = '/products/fees/v0/items/' + asin + '/feesEstimate';
  const method = 'POST';

  const body = {
    FeesEstimateRequest: {
      MarketplaceId: marketplaceId,
      IsAmazonFulfilled: isAmazonFulfilled,
      PriceToEstimateFees: {
        ListingPrice: {
          Amount: price,
          CurrencyCode: currencyCode,
        },
      },
      Identifier: `request_${asin}`,
      OptionalFulfillmentProgram: OptionalFulfillmentProgram,
    },
  };

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      (queryParams = {}), // ASIN is part of the endpoint
      body,
      logContext,
      createLog,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 1, burst: 2 }),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getMyFeesEstimateForAsin };

// getMyFeesEstimateForAsin({
//   marketplaceId: 'A33AVAJ2PDY3EV', // Turkey
//   asin: 'B00008D0TQ',
//   price: 100,
//   isAmazonFulfilled: true,
//   currencyCode: 'TRY',
//   OptionalFulfillmentProgram: 'FBA_CORE', // 'FBA_EFN' / 'FBA_CORE'
//   createLog: true,
// });
