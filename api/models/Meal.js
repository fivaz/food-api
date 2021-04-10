const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Dynamic association
     * */
    static associate({ Ingredient, MealIngredient }) {
      Meal.belongsToMany(Ingredient, {
        through: MealIngredient,
        foreignKey: 'mealId',
        as: 'ingredients',
      });

      Meal.hasMany(MealIngredient, {
        foreignKey: 'mealId',
      });

      Meal.addScope('full', {
        include: {
          model: Ingredient,
          as: 'ingredients',
          through: {
            as: 'mealIngredients',
            attributes: ['quantity'],
          },
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
