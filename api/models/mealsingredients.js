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
            models.ingredients.belongsToMany(models.meals, {through: this,foreignKey:'ingredientId'})
            models.meals.belongsToMany(models.ingredients, {through: this,foreignKey:'mealId'})
        }
    }

    MealIngredients.init({
        quantity: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'mealIngredients',
    });
    return MealIngredients;
};
