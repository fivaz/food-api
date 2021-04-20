const createError = require('http-errors');
const { checkRight } = require('../helpers/user-gate');

class Controller {
  constructor() {
    if (this.constructor === Controller) {
      throw new Error('Controller is abstract and cannot be instantiated!');
    }
    this.model = null;
  }

  // TODO check if I should merge both scopes into the same one
  findAllComplete(userId) {
    return this.model.scope(['defaultScope', { method: ['full', userId] }])
      .findAll();
  }

  findAllSimple(userId) {
    return this.model.scope(['defaultScope', { method: ['fromUser', userId] }])
      .findAll();
  }

  findAll(userId, scope = 'simple') {
    return scope === 'full' ? this.findAllComplete(userId) : this.findAllSimple(userId);
  }

  findComplete(id, userId) {
    return this.model.scope(['defaultScope', { method: ['full', userId] }])
      .findByPk(id);
  }

  findSimple(id, userId) {
    return this.model.scope(['defaultScope', { method: ['fromUser', userId] }])
      .findByPk(id);
  }

  find(id, userId, scope = 'simple') {
    return scope === 'full' ? this.findComplete(id, userId) : this.findSimple(id, userId);
  }

  async findOrFail(id) {
    const model = await this.model.findByPk(id);
    if (model) {
      return model;
    }
    throw createError(404, 'the resource does not exist');
  }

  async getAll(req, res) {
    try {
      const models = await this.findAll(req.user.id, req.query?.scope);

      return res.status(200)
        .json(models);
    } catch (error) {
      return res.status(500)
        .json(error);
    }
  }

  // TODO check once the id doesnt exist
  async get(req, res) {
    try {
      const models = await this.find(req.params.id, req.user.id, req.query?.scope);

      return res.status(200)
        .json(models);
    } catch (error) {
      return res.status(500)
        .json(error);
    }
  }

  async create(req, res) {
    const data = req.body;
    try {
      data.userId = req.user.id;
      const { id } = await this.model.create(data);
      const meal = await this.find(id, req.user.id, req.query?.scope);

      return res.status(201)
        .json(meal);
    } catch (error) {
      return res.status(500)
        .json(error);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    try {
      const foundMeal = await this.findOrFail(id);
      checkRight(req.user, foundMeal);

      const data = { ...req.body, userId: req.user.id };
      await this.model.update(data, { where: { id } });
      const meal = await this.find(id, req.user.id, req.query?.scope);

      return res.status(200)
        .json(meal);
    } catch (error) {
      return res.status(error.status || 500)
        .json(error);
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const foundMeal = await this.findOrFail(id);
      checkRight(req.user, foundMeal);
      await foundMeal.destroy();

      return res.status(200)
        .json('ressource removed');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error);
    }
  }
}

module.exports = Controller;
