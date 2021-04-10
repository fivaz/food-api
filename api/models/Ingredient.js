const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Dish, DishIngredient }) {
      Ingredient.belongsToMany(Dish, {
        through: DishIngredient,
        foreignKey: 'ingredientId',
        as: 'dishes',
      });

      Ingredient.hasMany(DishIngredient, {
        foreignKey: 'ingredientId',
        as: 'dishIngredients',
      });

      Ingredient.addScope('withDish', (dishId) => ({
        include: {
          model: DishIngredient,
          as: 'dishIngredients',
          required: false,
          where: { dishId: Number(dishId) },
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
