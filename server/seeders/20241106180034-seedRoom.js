'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const room = require('../data/room.json')
    room.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Rooms', room, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rooms', null, {})
  }
};
