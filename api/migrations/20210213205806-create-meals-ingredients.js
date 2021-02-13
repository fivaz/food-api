'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('MealIngredients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.DOUBLE
            },
            mealId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {model: 'Meals', key: 'id'}
            },
            ingredientId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {model: 'Ingredients', key: 'id'}
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('MealIngredients');
    }
};