module.exports = (sequelize, DataTypes) => {
  const MealIngredients = sequelize.define('MealIngredients', {
    quantity: DataTypes.DOUBLE,
  }, {});

  MealIngredients.associate = ({ Meal, Ingredient }) => {
    MealIngredients.belongsTo(Ingredient, {
      foreignKey: 'ingredientId',
    });
    MealIngredients.belongsTo(Meal, {
      foreignKey: 'mealId',
    });
  };

  return MealIngredients;
};
