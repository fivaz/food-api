'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Ingredients extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }

    Ingredients.init({
        name: DataTypes.STRING,
        unit: DataTypes.STRING,
        isCountable: DataTypes.BOOLEAN,
        price: DataTypes.DOUBLE,
        quantity: DataTypes.DOUBLE,
    }, {
        sequelize,
        modelName: 'ingredients',
    });
    return Ingredients;
};
