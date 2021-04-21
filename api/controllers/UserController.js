const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Controller = require('./Controller');
const { User } = require('../models');

const { TOKEN_SECRET } = require('../helpers/vars');

class UserController extends Controller {
  // static async getAll(req, res) {
  //   try {
  //     const users = await User.findAll();
  //     return res.status(200)
  //       .json(users);
  //   } catch (error) {
  //     return res.status(500)
  //       .json(error.message);
  //   }
  // }
  //
  // static async get(req, res) {
  //   const { id } = req.params;
  //   try {
  //     const user = await User.findByPk(id);
  //     return res.status(200)
  //       .json(user);
  //   } catch (error) {
  //     return res.status(500)
  //       .json(error.message);
  //   }
  // }

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

  // static async update(req, res) {
  //   const { id } = req.params;
  //   try {
  //     await User.update(req.body, { where: { id } });
  //     const user = await User.findByPk(id);
  //     return res.status(200)
  //       .json(user);
  //   } catch (error) {
  //     return res.status(500)
  //       .json(error.message);
  //   }
  // }
}

module.exports = UserController;
