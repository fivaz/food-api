const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MealIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
