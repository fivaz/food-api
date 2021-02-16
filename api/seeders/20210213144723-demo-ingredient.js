'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('ingredients', [
            {
                id: 1,
                name: 'Salt',
                isCountable: false,
                price: null,
                unit: 'g',
                quantity: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'Rice',
                isCountable: true,
                price: 9.95,
                unit: 'g',
                quantity: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                name: 'Grilled Chicken BBQ',
                isCountable: true,
                price: 4.3,
                unit: 'g',
                quantity: 500,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 4,
                name: 'Bread',
                isCountable: true,
                price: 1.75,
                unit: 'pc',
                quantity: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 5,
                name: 'Madeleine?',
                isCountable: true,
                price: 2.55,
                unit: 'pc',
                quantity: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 6,
                name: 'Milk?',
                isCountable: true,
                price: 1.55,
                unit: 'l',
                quantity: 1.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 7,
                name: 'Chicken Chest',
                isCountable: true,
                price: 15,
                unit: 'g',
                quantity: 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('ingredients', {}, {});
    }
};
