const createError = require('http-errors');
const { Dish, DishIngredient } = require('../models');
const { checkRight } = require('../helpers/user-gate');

class DishController {
  static async findAllFull(userId) {
    return Dish.scope(['defaultScope', { method: ['full', userId] }])
      .findAll();
  }

  static async findAll(userId) {
    return Dish.scope(['defaultScope', { method: ['fromUser', userId] }])
      .findAll();
  }

  static async findFull(id, userId) {
    return Dish.scope(['defaultScope', { method: ['full', userId] }])
      .findByPk(id);
  }

  static async find(id, userId) {
    return Dish.scope(['defaultScope', { method: ['fromUser', userId] }])
      .findByPk(id);
  }

  static async findOrFail(id) {
    const dish = await Dish.findByPk(id);
    if (dish) {
      return dish;
    }
    throw createError(404, 'the resource does not exist');
  }

  static async getAll(req, res) {
    try {
      const dishes = await (req.query?.scope === 'full'
        ? DishController.findAllFull(req.user.id)
        : DishController.findAll(req.user.id));

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
        ? DishController.findAll(id, req.user.id)
        : DishController.find(id, req.user.id));

      return res.status(200)
        .json(dish);
    } catch (error) {
      return res.json(error.message);
    }
  }

  static async create(req, res) {
    const data = req.body;
    data.userId = req.user.id;
    try {
      const { id } = await (data.ingredients?.length > 0
        ? DishController.createWithChildren(data)
        : Dish.create(data));

      const dish = await DishController.findFull(id, req.user.id);

      return res.status(201)
        .json(dish);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async createWithChildren(dish) {
    const { id } = await Dish.create(dish);
    const meaIngredients = DishController.getDishIngredients(dish.ingredients, id);
    await DishIngredient.bulkCreate(meaIngredients);
    return { id };
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
      const foundDish = await DishController.findOrFail(id);
      checkRight(req.user, foundDish);

      const data = { ...req.body, userId: req.user.id };
      await Promise.all([
        Dish.update(data, { where: { id } }),
        DishController.updateChildren(data, id),
      ]);

      const dish = await DishController.findFull(id, req.user.id);

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
      const foundDish = await DishController.findOrFail(id);
      checkRight(req.user, foundDish);

      // TODO constraint problem
      await DishIngredient.destroy({ where: { dishId: id } });
      await foundDish.destroy();

      return res.status(200)
        .json('dish removed');
    } catch (error) {
      return res.status(error.status || 500)
        .json(error.message);
    }
  }
}

module.exports = DishController;
