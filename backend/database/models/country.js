const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Country extends Model {
	
	}

	Country.init({
		countryCode: {
			type: DataTypes.CHAR(2),
			primaryKey: true,
			allowNull: false
		},
		countryName: {
			type: DataTypes.STRING(50),
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Country',
		tableName: 'countries'
	});

	return Country;
};
