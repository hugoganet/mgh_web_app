const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Daily average exchange rates for all currencies
   */
  class DailyAverageExchangeRate extends Model {}

  DailyAverageExchangeRate.init(
    {
      dailyAverageExchangeRateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      rateToEur: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DailyAverageExchangeRate',
      tableName: 'daily_average_exchange_rates',
      timestamps: true,
    },
  );

  return DailyAverageExchangeRate;
};
