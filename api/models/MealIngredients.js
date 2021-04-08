const { Model } = require('sequelize');
// TODO rename file to mealIngredients (meal in singular)
module.exports = (sequelize, DataTypes) => {
  class MealIngredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }

  MealIngredients.init({
    quantity: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'MealIngredients',
  });

  return MealIngredients;
};
