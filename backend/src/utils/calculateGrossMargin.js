// calculate gross margin : Represents the difference between the revenue from sales and the cost of goods sold (COGS).
const calculateGrossMargin = (cogs, revenueExcTax) => {
  const grossMargin = revenueExcTax - cogs;
  console.log(`grossMargin => ${grossMargin}`);
  return grossMargin;
};

const calculateGrossMarginPercentage = (cogs, revenueExcTax) => {
  const grossMargin = (revenueExcTax - cogs) / revenueExcTax;
  console.log(`grossMargin => ${grossMargin}`);
  return grossMargin;
};

module.exports = {
  calculateGrossMargin,
  calculateGrossMarginPercentage,
};
