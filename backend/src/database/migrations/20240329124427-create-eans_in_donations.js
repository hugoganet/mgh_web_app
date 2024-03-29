/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_donations', {
      ean_in_donation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      donation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'donations',
          key: 'donation_id',
        },
      },
      ean_donation_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_donations');
  },
};
