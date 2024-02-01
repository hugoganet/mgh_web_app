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
  } = params;

  const apiOperation = 'getMyFeesEstimateForASIN';
  const endpoint = '/products/fees/v0/items/' + asin + '/feesEstimate';
  const method = 'POST';

  const feeEstimateRequest = {
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
      {}, // Path parameters if any, in this case, ASIN is part of the endpoint
      feeEstimateRequest, // Request body
      createLog,
      apiOperation,
      (isGrantless = false),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { getMyFeesEstimateForAsin };

getMyFeesEstimateForAsin({
  marketplaceId: 'A33AVAJ2PDY3EV', // Turkey
  asin: 'B00008D0TQ',
  price: 100,
  isAmazonFulfilled: true,
  currencyCode: 'TRY',
  OptionalFulfillmentProgram: 'FBA_CORE', // 'FBA_EFN' / 'FBA_CORE'
  createLog: true,
});
