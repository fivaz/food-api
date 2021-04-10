const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ingredient, DishIngredient, Meal }) {
      Dish.belongsToMany(Ingredient, {
        through: DishIngredient,
        foreignKey: 'dishId',
        as: 'ingredients',
      });

      Dish.hasMany(DishIngredient, {
        foreignKey: 'dishId',
      });

      Dish.hasMany(Meal, {
        foreignKey: 'dishId',
      });

      Dish.addScope('full', {
        include: {
          model: Ingredient,
          as: 'ingredients',
          through: {
            as: 'dishIngredients',
            attributes: ['quantity'],
          },
        },
      });
    }
  }

  Dish.init({
    name: DataTypes.STRING,
    category: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'tea', 'supper', 'dinner'),
  }, {
    sequelize,
    modelName: 'Dish',
  });

  return Dish;
};
