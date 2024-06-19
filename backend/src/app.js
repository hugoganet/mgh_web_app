require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json()); // Enable parsing JSON bodies

// Use the Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// Import routes
const eansRoutes = require('./api/routes/eansRoutes');
const asinsRoutes = require('./api/routes/asinsRoutes');
const skusRoutes = require('./api/routes/skusRoutes');
const warehousesRoutes = require('./api/routes/warehousesRoutes');
const countriesRoutes = require('./api/routes/countriesRoutes');
const pricingRulesRoutes = require('./api/routes/pricingRulesRoutes');
const vatCategoriesRoutes = require('./api/routes/vatCategoriesRoutes');
const vatRatesPerCountryRoutes = require('./api/routes/vatRatesPerCountryRoutes');
const productTaxCategoriesRoutes = require('./api/routes/productTaxCategoriesRoutes');
const priceGridFbaFeesRoutes = require('./api/routes/priceGridFbaFeesRoutes');
const brandsRoutes = require('./api/routes/brandsRoutes');
const productCategoriesRoutes = require('./api/routes/productCategoriesRoutes');
const amazonReferralFeesRoutes = require('./api/routes/amazonReferralFeesRoutes');
const productCategoriesRanksRoutes = require('./api/routes/productCategoriesRanksRoutes');
const catalogRoutes = require('./api/routes/catalogRoutes');
const suppliersRoutes = require('./api/routes/suppliersRoutes');
const donationsRoutes = require('./api/routes/donationsRoutes');
const minimumSellingPricesRoutes = require('./api/routes/minimumSellingPricesRoutes');
const suppliersOrdersRoutes = require('./api/routes/suppliersOrdersRoutes');
const fbaFeesRoutes = require('./api/routes/fbaFeesRoutes');
const productAndAmzReferralFeesCategoriesMappingRoutes = require('./api/routes/productAndAmzReferralFeeCategoriesMappingRoutes');
const warehousesStockRoutes = require('./api/routes/warehousesStockRoutes');
const eansInDonationsRoutes = require('./api/routes/eansInDonationsRoutes');
const eansInSuppliersOrdersRoutes = require('./api/routes/eansInSuppliersOrdersRoutes');
const suppliersBrandCatalogRoutes = require('./api/routes/suppliersBrandCatalogRoutes');
const eansInAsinsRoutes = require('./api/routes/eansInAsinsRoutes');
const asinWarehouseQuantityRoutes = require('./api/routes/asinWarehouseQuantityRoutes');
const afnInventoryDailyUpdatesRoutes = require('./api/routes/afnInventoryDailyUpdateRoutes');
const sellingPriceHistory = require('./api/routes/sellingPricesHistoryRoutes');
const keepaDataUploadRoutes = require('./api/routes/keepaDataUploadRoutes');
const catalogUploadRoutes = require('./api/routes/catalogUploadRoutes');
const asinSourcingCatalogRoutes = require('./api/routes/asinSourcingCatalogRoutes');
const keepaDataRoutes = require('./api/routes/keepaDataRoutes');

// Routes
app.use('/eans', eansRoutes);
app.use('/asins', asinsRoutes);
app.use('/skus', skusRoutes);
app.use('/warehouses', warehousesRoutes);
app.use('/countries', countriesRoutes);
app.use('/pricingRules', pricingRulesRoutes);
app.use('/vatCategories', vatCategoriesRoutes);
app.use('/vatRatesPerCountry', vatRatesPerCountryRoutes);
app.use('/productTaxCategories', productTaxCategoriesRoutes);
app.use('/priceGridFbaFees', priceGridFbaFeesRoutes);
app.use('/brands', brandsRoutes);
app.use('/productCategories', productCategoriesRoutes);
app.use('/amazonReferralFees', amazonReferralFeesRoutes);
app.use('/productCategoriesRanks', productCategoriesRanksRoutes);
app.use('/catalog', catalogRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/donations', donationsRoutes);
app.use('/minimumSellingPrices', minimumSellingPricesRoutes);
app.use('/suppliersOrders', suppliersOrdersRoutes);
app.use('/fbaFees', fbaFeesRoutes);
app.use(
  '/productAndAmzReferralFeeCategories',
  productAndAmzReferralFeesCategoriesMappingRoutes,
);
app.use('/warehousesStock', warehousesStockRoutes);
app.use('/eansInDonations', eansInDonationsRoutes);
app.use('/eansInSuppliersOrders', eansInSuppliersOrdersRoutes);
app.use('/suppliersBrandCatalog', suppliersBrandCatalogRoutes);
app.use('/eansInAsins', eansInAsinsRoutes);
app.use('/asinWarehouseQuantity', asinWarehouseQuantityRoutes);
app.use('/afnInventoryDailyUpdates', afnInventoryDailyUpdatesRoutes);
app.use('/sellingPricesHistory', sellingPriceHistory);
app.use('/uploadKeepaData', keepaDataUploadRoutes);
app.use('/uploadCatalog', catalogUploadRoutes);
app.use('/keepaData', keepaDataRoutes);
app.use('/asinSourcingCatalog', asinSourcingCatalogRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

module.exports = app;
