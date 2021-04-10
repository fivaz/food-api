module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('dishIngredients', [
      {
        quantity: null,
        dishId: 1,
        ingredientId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quantity: 200,
        dishId: 1,
        ingredientId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quantity: 200,
        dishId: 1,
        ingredientId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('dishIngredients', {});
  },
};
