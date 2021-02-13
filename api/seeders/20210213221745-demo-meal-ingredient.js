'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('MealIngredients', [
            {
                quantity: null,
                meal_id: 1,
                ingredient_id: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                quantity: 200,
                meal_id: 1,
                ingredient_id: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                quantity: 200,
                meal_id: 1,
                ingredient_id: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('MealIngredients', {}, {});
    }
};
