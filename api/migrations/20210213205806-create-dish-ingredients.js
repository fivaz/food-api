module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dishIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.DOUBLE,
      },
      dishId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'dishes',
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
    await queryInterface.dropTable('dishIngredients');
  },
};
