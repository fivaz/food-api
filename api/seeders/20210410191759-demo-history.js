module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('histories', [
      {
        date: new Date(),
        mealId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(),
        mealId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(),
        mealId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('histories', {});
  },
};
