/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans', {
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        primaryKey: true,
      },
      productName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'brands', // Ensure this matches the actual table name and primary key
          key: 'brandId',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans');
  },
};
