const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Sku extends Model {

    }

    Sku.init({
        _country_code: {
            type: DataTypes.CHAR(2),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Country', 
                key: 'countryCode',
            }
        },
        fnsku: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        asin: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'Asin',
                key: 'asin'
            }
        },
        sku_acquisition_cost_exc: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        sku_acquisition_cost_inc: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        sku_afn_total_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        sku_average_selling_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        sku_average_net_margin: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        sku_average_net_margin_percentage: {
            type: DataTypes.DECIMAL(10, 5),
            allowNull: false
        },
        sku_average_return_on_investment_rate: {
            type: DataTypes.DECIMAL(10, 5),
            allowNull: false
        },
        sku_average_daily_return_on_investment_rate: {
            type: DataTypes.DECIMAL(10, 5),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        number_of_active_days: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number_of_unit_sold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sku_average_unit_sold_per_day: {
            type: DataTypes.DECIMAL(10, 5),
            allowNull: false
        },
        sku_restock_alert_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        sku_is_test: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
            modelName: 'Sku',
            tableName: 'skus',
    });

return Sku;
}
