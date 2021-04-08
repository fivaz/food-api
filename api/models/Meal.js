module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    name: DataTypes.STRING,
    category: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'tea', 'supper', 'dinner'),
  }, {});

  Meal.associate = ({ Ingredient, MealIngredients }) => {
    Meal.belongsToMany(Ingredient, {
      through: MealIngredients,
      foreignKey: 'mealId',
      as: 'ingredients',
    });
    Meal.hasMany(MealIngredients, {
      foreignKey: 'mealId',
    });
  };
  return Meal;
};
