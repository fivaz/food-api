const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ingredient, MealIngredient, History }) {
      Meal.belongsToMany(Ingredient, {
        through: MealIngredient,
        foreignKey: 'mealId',
        as: 'ingredients',
      });

      Meal.hasMany(MealIngredient, {
        foreignKey: 'mealId',
      });

      Meal.hasMany(History, {
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
