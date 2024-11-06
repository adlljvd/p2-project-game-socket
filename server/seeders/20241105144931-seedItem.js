'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const item = require('../data/item.json')
    item.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Items', item, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {})
  }
};
