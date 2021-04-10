module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('meals', [
      {
        date: new Date(),
        dishId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(),
        dishId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(),
        dishId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('meals', {});
  },
};
