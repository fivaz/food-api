'use strict';

module.exports = {
    up: async (queryInterface) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * up: async (queryInterface, Sequelize) => {
         *  await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Meals', [
            {
                id: 1,
                name: 'Chicken Filet with Rice',
                category: 'lunch',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    down: async (queryInterface) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * down: async (queryInterface, Sequelize) => {
         *  await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Meals', {}, {});
    }
};
