/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('selling_prices_history', {
      skuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      dailyPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('selling_prices_history');
  },
};
