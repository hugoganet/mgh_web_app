/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eans_in_donations', {
      eanInDonationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ean: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: 'eans',
          key: 'ean',
        },
      },
      donationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'donations',
          key: 'donation_id',
        },
      },
      eanDonationQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eans_in_donations');
  },
};
