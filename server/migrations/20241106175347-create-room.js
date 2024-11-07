'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notNull: {
            msg: 'name is required'
          },
          notEmpty: {
            msg: 'name is required'
          }
        }
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notNull: {
            msg: 'status is required'
          },
          notEmpty: {
            msg: 'status is required'
          }
        }
      },
      CategoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notNull: {
            msg: 'CategoryId is required'
          },
          notEmpty: {
            msg: 'CategoryId is required'
          }
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      maxPlayer: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      game: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};