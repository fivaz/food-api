const forbidden = require('./NotAuthorizedError');
const { User } = require('../models');

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
      throw forbidden;
    }
  }

  static checkIs(loggedUser, user) {
    if (loggedUser.id !== user.id) {
      throw forbidden;
    }
  }
}

module.exports = Policy;
