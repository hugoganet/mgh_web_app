/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_average_exchange_rates', {
      dailyAverageExchangeRateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      currencyCode: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      rateToEur: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_average_exchange_rates');
  },
};
