const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DishIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Dish, Ingredient }) {
      DishIngredient.belongsTo(Ingredient, {
        foreignKey: 'ingredientId',
      });
      DishIngredient.belongsTo(Dish, {
        foreignKey: 'dishId',
      });
    }
  }

  DishIngredient.init({
    quantity: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'DishIngredient',
  });

  return DishIngredient;
};
