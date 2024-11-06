'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Item, { foreignKey: 'CategoryId' })
      Category.hasMany(models.Room, { foreignKey: 'CategoryId' })
    }
  }
  Category.init({
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
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'imgUrl is required'
        },
        notEmpty: {
          msg: 'imgUrl is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};