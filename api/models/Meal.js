const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    static associate({ Ingredient, MealIngredients }) {
      Meal.belongsToMany(Ingredient, {
        through: MealIngredients,
        foreignKey: 'mealId',
        as: 'ingredients',
      });

      Meal.hasMany(MealIngredients, {
        foreignKey: 'mealId',
      });

      Meal.addScope('full', {
        include: {
          model: Ingredient,
          as: 'ingredients',
        },
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
