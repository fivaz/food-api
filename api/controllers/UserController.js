const jwt = require('jsonwebtoken');
const Controller = require('./Controller');
const { User } = require('../models');

const { TOKEN_SECRET } = require('../helpers/vars');

class UserController extends Controller {
  static convertUser(userModel) {
    const user = { ...userModel.toJSON(), password: undefined };
    user.token = jwt.sign(user, TOKEN_SECRET);
    return user;
  }

  static async login(req, res) {
    try {
      const { password, email } = req.body;
      const foundUser = await User.scope(null)
        .findOne({ where: { email } });
      if (foundUser && await foundUser.checkPassword(password)) {
        return res.status(200)
          .json(UserController.convertUser(foundUser));
      }
      return res.status(401)
        .json('incorrect email or password');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.stack);
    }
  }

  static async register(req, res) {
    try {
      const createdUser = await User.create(req.body);
      return res.status(200)
        .json(UserController.convertUser(createdUser));
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.stack);
    }
  }
}

module.exports = UserController;
