module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'food_dev',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      defaultScope: {
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'food_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      defaultScope: {
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'food',
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define: {
      defaultScope: {
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
  },
};
