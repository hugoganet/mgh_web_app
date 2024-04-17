/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('formatted_catalog', {
      formatted_catalog_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      supplier_part_number: {
        type: Sequelize.STRING(50),
      },
      product_name: {
        type: Sequelize.STRING(250),
      },
      product_price_exc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      product_vat_rate: {
        type: Sequelize.DECIMAL(6, 5),
      },
      currency_code: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('formatted_catalog');
  },
};
