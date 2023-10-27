// VatRatePerCountry.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class VatRatePerCountry extends Model {

	}

	VatRatePerCountry.init({
		countryCode: {
			type: DataTypes.CHAR(2),
			primaryKey: true, // part of composite key
			allowNull: false,
			references: {
				model: 'Country', 
				key: 'countryCode'
			}
		},
			vatRateCategory: {
			type: DataTypes.CHAR(2),
			primaryKey: true, // part of composite key
			allowNull: false
		},
			vatRate: {
			type: DataTypes.DECIMAL(6, 5),
			allowNull: false
		}
	}, {
		sequelize,
			modelName: 'VatRatePerCountry',
			tableName: 'vat_rates_per_country'
	});

	return VatRatePerCountry;
};
