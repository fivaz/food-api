'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Ingredients', [
            {
                name: 'Salt',
                isCountable: false,
                price: null,
                unit: 'g',
                quantity: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Rice',
                isCountable: true,
                price: 9.95,
                unit: 'g',
                quantity: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Grilled Chicken BBQ',
                isCountable: true,
                price: 4.3,
                unit: 'g',
                quantity: 500,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Bread',
                isCountable: true,
                price: 1.75,
                unit: 'pc',
                quantity: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Madeleine?',
                isCountable: true,
                price: 2.55,
                unit: 'pc',
                quantity: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Milk?',
                isCountable: true,
                price: 1.55,
                unit: 'l',
                quantity: 1.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Ingredients', {}, {});
    }
};
