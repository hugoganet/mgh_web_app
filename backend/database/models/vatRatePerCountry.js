// VatRatePerCountry.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class VatRatePerCountry extends Model {

	}

	VatRatePerCountry.init({
		vatRatePerCountryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		countryCode: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			references: {
				model: 'countries', 
				key: 'country_code'
			}
		},
		vatCategoryId: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			references: {
				model: 'vat_categories', 
				key: 'vat_category_id'
			}
		},
			
		vatRate: {
			type: DataTypes.DECIMAL(6, 5),
			allowNull: true,
		},
	}, {
		sequelize,
			modelName: 'VatRatePerCountry',
			tableName: 'vat_rates_per_country',
	});

	return VatRatePerCountry;
};
