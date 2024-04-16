/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_asins', {
      ean_in_asin_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      asin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      ean_in_asin_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_asins');
  },
};