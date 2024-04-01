/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('selling_prices_history', {
      selling_price_history_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      daily_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('selling_prices_history');
  },
};
