const jwt = require('jsonwebtoken');
const Controller = require('./Controller');
const { checkRight } = require('../helpers/user-gate');
const { User } = require('../models');

const { TOKEN_SECRET } = require('../helpers/vars');

class UserController extends Controller {
  constructor() {
    super();
    this.model = User;
  }

  static convertUser(userObject) {
    const user = {
      ...userObject,
      password: undefined,
    };
    user.token = jwt.sign(user, TOKEN_SECRET);
    return user;
  }

  async login(req, res) {
    try {
      const {
        password,
        email,
      } = req.body;
      const foundUser = await this.model.scope(null)
        .findOne({ where: { email } });
      if (foundUser && await foundUser.checkPassword(password)) {
        return res.status(200)
          .json(UserController.convertUser(foundUser.toJSON()));
      }
      return res.status(401)
        .json('incorrect email or password');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.stack);
    }
  }

  async register(req, res) {
    try {
      const createdUser = await this.model.create(req.body);
      return res.status(200)
        .json(UserController.convertUser(createdUser.toJSON()));
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.stack);
    }
  }

  // TODO check what is the different between this update and Controller one
  async update(req, res) {
    const { id } = req.params;
    try {
      const foundModel = await this.findOrFail(id);
      checkRight(req.user, foundModel);
      const data = {
        ...req.body,
        password: undefined,
      };
      await this.model.update(data, { where: { id } });
      const model = await this.model.findByPk(id);
      return res.status(200)
        .json(UserController.convertUser(model));
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.stack);
    }
  }
}

module.exports = new UserController();
