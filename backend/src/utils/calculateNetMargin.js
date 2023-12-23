// The profit made from a single sale after deducting all direct costs associated with that sale.
const calculateNetMargin = (cogs, revenueExcTax, fbaFees) => {
  const netMargin = revenueExcTax - cogs - fbaFees;
  return netMargin;
};

const calculateNetMarginPercentage = (cogs, revenueExcTax, fbaFees) => {
  const netMargin = (revenueExcTax - cogs - fbaFees) / revenueExcTax;
  return netMargin;
};

module.exports = {
  calculateNetMargin,
  calculateNetMarginPercentage,
};
