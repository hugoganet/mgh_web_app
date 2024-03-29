/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_categories', {
      product_category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_category_name_en: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      product_category_name_fr: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      product_category_name_de: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      product_category_name_es: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      product_category_name_it: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_categories');
  },
};
