'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Category, { foreignKey: 'CategoryId' })
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'CategoryId is required'
        },
        notEmpty: {
          msg: 'CategoryId is required'
        }
      }
    },
    maxPlayer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 4
    },
    game: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Game is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};