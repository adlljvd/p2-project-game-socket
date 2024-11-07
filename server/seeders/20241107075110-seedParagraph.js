'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const paragraph = require('../data/paragraph.json')
    paragraph.forEach(el => {
      delete el.id

      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Paragraphs', paragraph, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Paragraphs', null, {})
  }
};
