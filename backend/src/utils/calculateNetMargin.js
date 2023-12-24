// The profit made from a single sale after deducting all direct costs associated with that sale.
const calculateNetMargin = (cogs, revenueExcTax, fbaFees) => {
  // console.log('cogs', cogs);
  // console.log('revenueExcTax', revenueExcTax);
  // console.log('fbaFees', fbaFees);
  const netMargin = (revenueExcTax - cogs - fbaFees).toFixed(2);
  return netMargin;
};

const calculateNetMarginPercentage = (cogs, revenueExcTax, fbaFees) => {
  const netMargin = ((revenueExcTax - cogs - fbaFees) / revenueExcTax).toFixed(
    5,
  );
  return netMargin;
};

module.exports = {
  calculateNetMargin,
  calculateNetMarginPercentage,
};
