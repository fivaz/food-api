const SALT_ROUNDS = 10;
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Stefane Fivaz',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin@admin.com', SALT_ROUNDS),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {});
  },
};
