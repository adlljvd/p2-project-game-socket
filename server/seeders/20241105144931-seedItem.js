'use strict';

let item = require('../data/item.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    item.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()

      return el
    })

    await queryInterface.bulkInsert('Items', item, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {})
  }
};
