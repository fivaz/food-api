const createError = require('http-errors');
const { User } = require('../models');

const message = 'You are not authorized to access this ressource';

class Policy {
  static checkRight(loggedUser, model) {
    if (model instanceof User) {
      Policy.checkIs(loggedUser, model);
    } else {
      Policy.checkOwner(loggedUser, model);
    }
  }

  static checkOwner(loggedUser, model) {
    if (loggedUser.id !== model.userId) {
      throw createError(403, message);
    }
  }

  static checkIs(loggedUser, user) {
    if (loggedUser.id !== user.id) {
      throw createError(403, message);
    }
  }
}

module.exports = Policy;
