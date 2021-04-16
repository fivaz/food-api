const createError = require('http-errors');
const { Dish, DishIngredient } = require('../models');
const { hasAccess } = require('../helpers/user-gate');

class DishController {
  static async getAll(req, res) {
    try {
      const dishes = await (req.query?.scope === 'full'
        ? Dish.scope(['defaultScope', { method: ['full', req.user.id] }])
          .findAll()
        : Dish.scope(['defaultScope', { method: ['fromUser', req.user.id] }])
          .findAll());

      return res.status(200)
        .json(dishes);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async get(req, res) {
    const { id } = req.params;
    try {
      const dish = await (req.query?.scope === 'full'
        ? Dish.scope(['defaultScope', { method: ['full', req.user.id] }])
          .findByPk(id)
        : Dish.scope(['defaultScope', { method: ['fromUser', req.user.id] }])
          .findByPk(id));

      return res.status(200)
        .json(dish);
    } catch (error) {
      return res.json(error.message);
    }
  }

  static async create(req, res) {
    const dish = req.body;
    dish.userId = req.user.id;
    try {
      const createdDish = await (dish.ingredients?.length > 0
        ? DishController.createWithChildren(dish)
        : Dish.create(dish));

      return res.status(201)
        .json(createdDish);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async createWithChildren(dish) {
    const { id } = await Dish.create(dish);
    const meaIngredients = DishController.getDishIngredients(dish.ingredients, id);
    await DishIngredient.bulkCreate(meaIngredients);
    return Dish.scope(['defaultScope', 'full'])
      .findByPk(id);
  }

  static getDishIngredients(ingredients, dishId) {
    return ingredients.map((ingredient) => {
      const { dishIngredients } = ingredient;
      dishIngredients.ingredientId = ingredient.id;
      dishIngredients.dishId = dishId;
      return dishIngredients;
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    try {
      const oldDish = await DishController.findOrFail(id);
      hasAccess(req.user, oldDish);

      const newDish = { ...req.body, userId: req.user.id };
      await Promise.all([
        Dish.update(newDish, { where: { id } }),
        DishController.updateChildren(newDish, id),
      ]);
      const dish = await Dish.scope(['defaultScope', { method: ['full', req.user.id] }])
        .findByPk(id);

      return res.status(200)
        .json(dish);
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.message);
    }
  }

  static async updateChildren(dish, id) {
    const dishIngredients = DishController.getDishIngredients(dish.ingredients, id);
    await DishIngredient.destroy({ where: { dishId: id } });
    await DishIngredient.bulkCreate(dishIngredients);
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const dish = await DishController.findOrFail(id);
      hasAccess(req.user, dish);

      // TODO constraint problem
      await DishIngredient.destroy({ where: { dishId: id } });
      await dish.destroy(id);

      return res.status(200)
        .json('dish removed');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.message);
    }
  }

  static async findOrFail(id) {
    const dish = await Dish.findByPk(id);
    if (dish) {
      return dish;
    }
    throw createError(404, 'the resource does not exist');
  }
}

module.exports = DishController;
