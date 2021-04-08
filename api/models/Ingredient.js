module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: DataTypes.STRING,
    unit: DataTypes.STRING,
    isCountable: DataTypes.BOOLEAN,
    price: DataTypes.DOUBLE,
    quantity: DataTypes.DOUBLE,
  }, {});

  Ingredient.associate = ({ Meal, MealIngredients }) => {
    Ingredient.belongsToMany(Meal, {
      through: MealIngredients,
      foreignKey: 'ingredientId',
      as: 'meals',
    });
    Ingredient.hasMany(MealIngredients, {
      as: 'mealIngredients',
      foreignKey: 'ingredientId',
    });
  };

  return Ingredient;
};
