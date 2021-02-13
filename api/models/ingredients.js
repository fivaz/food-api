'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ingredients extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Ingredients.init({
        name: DataTypes.STRING,
        unit: DataTypes.STRING,
        coutable: DataTypes.BOOLEAN,
        price: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'Ingredients',
    });
    return Ingredients;
};