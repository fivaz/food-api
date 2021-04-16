const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../helpers/vars');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Admin Admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin@admin.com', SALT_ROUNDS),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Tester Test',
        email: 'test@test.com',
        password: await bcrypt.hash('test@test.com', SALT_ROUNDS),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {});
  },
};
