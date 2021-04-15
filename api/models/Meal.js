const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Dish, User }) {
      Meal.belongsTo(Dish, {
        foreignKey: 'dishId',
        as: 'dish',
      });

      Meal.belongsTo(User, { foreignKey: 'userId' });

      Meal.addScope('full', {
        include: {
          model: Dish.scope(['defaultScope', 'full']),
          as: 'dish',
        },
      });
    }
  }

  Meal.init({
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Meal',
  });
  return Meal;
};
