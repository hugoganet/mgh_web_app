/**
 * @function calculateRoi
 * @description Calculates the return on investment
 * @param {decimal} cogs
 * @param {decimal} netMargin
 * @return {decimal} roi
 */
const calculateRoi = (cogs, netMargin) => {
  const roi = netMargin / cogs;
  return roi;
};

module.exports = {
  calculateRoi,
};
