module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mealIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.DOUBLE,
      },
      mealId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'meals',
          key: 'id',
        },
      },
      ingredientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ingredients',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('mealIngredients');
  },
};
