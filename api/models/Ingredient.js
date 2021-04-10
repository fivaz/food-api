const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Dynamic association
     * */
    static associate({ Meal, MealIngredient }) {
      Ingredient.belongsToMany(Meal, {
        through: MealIngredient,
        foreignKey: 'ingredientId',
        as: 'meals',
      });

      Ingredient.hasMany(MealIngredient, {
        foreignKey: 'ingredientId',
        as: 'mealIngredients',
      });

      Ingredient.addScope('withMeal', (mealId) => ({
        include: {
          model: MealIngredient,
          as: 'mealIngredients',
          required: false,
          where: { mealId: Number(mealId) },
        },
        raw: true,
        nest: true,
      }));
    }
  }

  Ingredient.init({
    name: DataTypes.STRING,
    unit: DataTypes.STRING,
    isCountable: DataTypes.BOOLEAN,
    price: DataTypes.DOUBLE,
    quantity: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'Ingredient',
  });

  return Ingredient;
};
