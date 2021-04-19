const createError = require('http-errors');
const { Meal } = require('../models');
const { checkRight } = require('../helpers/user-gate');

class MealController {
  static async findAllFull(userId) {
    return Meal.scope(['defaultScope', { method: ['full', userId] }])
      .findAll();
  }

  static async findFull(id, userId) {
    return Meal.scope(['defaultScope', { method: ['full', userId] }])
      .findByPk(id);
  }

  static async findOrFail(id) {
    const dish = await Meal.findByPk(id);
    if (dish) {
      return dish;
    }
    throw createError(404, 'the resource does not exist');
  }

  static async getAll(req, res) {
    try {
      const meals = await MealController.findAllFull(req.user.id);
      return res.status(200)
        .json(meals);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async create(req, res) {
    const data = req.body;
    try {
      data.userId = req.user.id;
      const { id } = await Meal.create(data);
      const meal = await MealController.findFull(id, req.user.id);

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
      const foundMeal = await MealController.findOrFail(id);
      checkRight(req.user, foundMeal);

      const data = { ...req.body, userId: req.user.id };
      await Meal.update(data, { where: { id } });
      const meal = await MealController.findFull(id, req.user.id);

      return res.status(200)
        .json(meal);
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.message);
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const foundMeal = await MealController.findOrFail(id);
      checkRight(req.user, foundMeal);
      await foundMeal.destroy();

      return res.status(200)
        .json('meal removed');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.message);
    }
  }
}

module.exports = MealController;
