// The profit made from a single sale after deducting all direct costs associated with that sale.
const calculateNetMargin = (cogs, revenueExcTax, fbaFees) => {
  const netMargin = revenueExcTax - cogs - fbaFees;
  console.log(`netMargin => ${netMargin}`);
  return netMargin;
};

const calculateNetMarginPercentage = (cogs, revenueExcTax, fbaFees) => {
  const netMargin = (revenueExcTax - cogs - fbaFees) / revenueExcTax;
  console.log(`netMargin => ${netMargin}`);
  return netMargin;
};

module.exports = {
  calculateNetMargin,
  calculateNetMarginPercentage,
};
