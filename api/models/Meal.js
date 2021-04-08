const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ingredient, MealIngredients }) {
      Meal.belongsToMany(Ingredient, {
        through: MealIngredients,
        as: 'ingredients',
      });
    }
  }

  Meal.init({
    name: DataTypes.STRING,
    category: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'tea', 'supper', 'dinner'),
  }, {
    sequelize,
    modelName: 'Meal',
  });
  return Meal;
};
