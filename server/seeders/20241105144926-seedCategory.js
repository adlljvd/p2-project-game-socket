'use strict';

let category = require('../data/category.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    category.forEach(el => {
      delete el.id
      el.updatedAt = el.createdAt = new Date()

      return el
    })

    await queryInterface.bulkInsert('Categories', category, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
