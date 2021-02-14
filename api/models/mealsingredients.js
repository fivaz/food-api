'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MealIngredients extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Ingredients.belongsToMany(models.Meals, {through: this,foreignKey:'ingredientId'})
            models.Meals.belongsToMany(models.Ingredients, {through: this,foreignKey:'mealId'})
        }
    }

    MealIngredients.init({
        quantity: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'MealIngredients',
    });
    return MealIngredients;
};