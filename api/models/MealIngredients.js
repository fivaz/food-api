const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MealIngredient extends Model {
    /**
     * Dynamic association
     * */
    static associate({ Meal, Ingredient }) {
      MealIngredient.belongsTo(Ingredient, {
        foreignKey: 'ingredientId',
      });
      MealIngredient.belongsTo(Meal, {
        foreignKey: 'mealId',
      });
    }
  }

  MealIngredient.init({
    quantity: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'MealIngredient',
  });

  return MealIngredient;
};
