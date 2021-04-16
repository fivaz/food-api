module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('dishes', [
      {
        id: 1,
        name: 'Chicken Filet with Rice',
        category: 'lunch',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Nutella and Peanut butter Sandwich',
        category: 'tea',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Spaghetti of Chicken and Eggs',
        category: 'dinner',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('dishes', {});
  },
};
