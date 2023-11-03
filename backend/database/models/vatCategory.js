const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class VatCategory extends Model {

	}
	VatCategory.init({
		vatCategoryId: {
			type: DataTypes.STRING(2),
			primaryKey: true,
			allowNull: false,
		},
			
		vatCategoryDefinition: {
			type: DataTypes.STRING(30),
			allowNull: false,
			unique: true,
		},
	}, {
		sequelize,
			modelName: 'VatCategory',
			tableName: 'vat_categories',
	});

	return VatCategory;
};
