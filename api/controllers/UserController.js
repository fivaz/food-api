const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SALT_ROUNDS = 10;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secretkey';

class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200)
        .json(users);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async get(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      return res.status(200)
        .json(user);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async login(req, res) {
    try {
      const foundUser = await User.findOne({ where: { email: req.body.email } });
      if (foundUser && await bcrypt.compare(req.body.password, foundUser.password)) {
        const signedUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          token: jwt.sign(foundUser.id, TOKEN_SECRET),
        };
        return res.status(200)
          .json(signedUser);
      }
      return res.status(401)
        .json('incorrect email or password');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async register(req, res) {
    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
      };
      const createdUser = await User.create(user);
      return res.status(201)
        .json(createdUser);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    try {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
      };
      await User.update(newUser, { where: { id } });
      const user = await User.findByPk(id);
      return res.status(200)
        .json(user);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      return res.status(200)
        .json('user removed');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = UserController;
