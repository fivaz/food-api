const { Meal } = require('../models');

class MealController {
  static async getAll(req, res) {
    try {
      const meals = await Meal.scope(['defaultScope', { method: ['full', req.user.id] }])
        .findAll();
      return res.status(200)
        .json(meals);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async create(req, res) {
    try {
      const data = req.body;
      data.userId = req.user.id;
      const { id } = await Meal.create(data);
      const meal = await Meal.scope(['defaultScope', { method: ['full', req.user.id] }])
        .findByPk(id);
      return res.status(201)
        .json(meal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    try {
      await Meal.update(req.body, { where: { id } });
      const meal = await Meal.scope(['defaultScope', { method: ['full', req.user.id] }])
        .findByPk(id);
      return res.status(200)
        .json(meal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async delete(req, res) {
    try {
      await Meal.destroy({ where: { id: req.params.id, userId: req.user.id } });
      return res.status(200)
        .json('meal removed');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = MealController;
