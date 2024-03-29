/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalog', {
      catalog_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplier_part_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'brand_id',
        },
      },
      unit_pack_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_price_exc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      product_vat_rate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: false,
      },
      catalog_entry_last_update: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('catalog');
  },
};
