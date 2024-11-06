'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let category = require('../data/category.json')
    category.forEach(el => {
      delete el.id
      el.updatedAt = el.createdAt = new Date()
    })

    await queryInterface.bulkInsert('Categories', category, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
