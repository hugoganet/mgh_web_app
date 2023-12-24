// calculate gross margin : Represents the difference between the revenue from sales and the cost of goods sold (COGS).
const calculateGrossMargin = (cogs, revenueExcTax) => {
  const grossMargin = (revenueExcTax - cogs).toFixed(2);
  return grossMargin;
};

const calculateGrossMarginPercentage = (cogs, revenueExcTax) => {
  const grossMargin = (revenueExcTax - cogs) / revenueExcTax;
  return grossMargin;
};

module.exports = {
  calculateGrossMargin,
  calculateGrossMarginPercentage,
};
