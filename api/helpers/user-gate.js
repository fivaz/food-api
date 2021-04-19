const createError = require('http-errors');

module.exports = {
  checkRight: ({ id }, { userId }) => {
    if (id !== userId) {
      throw createError(403, 'You are not authorized to access this ressource');
    }
  },
};
