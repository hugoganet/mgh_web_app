const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class VatCategory extends Model {

	}
	VatCategory.init({
		vatCategoryId: {
			type: DataTypes.CHAR(2),
			primaryKey: true,
			allowNull: false,
		},
			
		vatCategoryDefinition: {
			type: DataTypes.CHAR(30),
			allowNull: false,
		},
	}, {
		sequelize,
			modelName: 'VatCategory',
			tableName: 'vat_categories',
	});

	return VatCategory;
};
