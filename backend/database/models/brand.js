const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  	class Brand extends Model {

    }

    Brand.init({
        brandId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        brandName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        }
        }, {
        sequelize,
        modelName: 'Brand',
		tableName: 'brands' 
    });

    return Brand;
}
