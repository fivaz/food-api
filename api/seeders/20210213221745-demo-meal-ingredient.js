'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('MealIngredients', [
            {
                quantity: null,
                mealId: 1,
                ingredientId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                quantity: 200,
                mealId: 1,
                ingredientId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                quantity: 200,
                mealId: 1,
                ingredientId: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('MealIngredients', {}, {});
    }
};
