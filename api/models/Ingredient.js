const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Meal, MealIngredients }) {
      Ingredient.belongsToMany(Meal, {
        through: MealIngredients,
        as: 'meal',
      });
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
