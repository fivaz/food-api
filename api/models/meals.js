'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Meals extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }

    Meals.init({
        name: DataTypes.STRING,
        category: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'tea', 'supper', 'dinner')
    }, {
        sequelize,
        modelName: 'meals',
    });
    return Meals;
};
