const { Dish, DishIngredient } = require('../models');

class DishController {
  static async getAll(req, res) {
    try {
      const dishes = await (req.query?.scope === 'full'
        ? Dish.scope(['defaultScope', 'full'])
          .findAll()
        : Dish.findAll());

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
        ? Dish.scope(['defaultScope', 'full'])
          .findByPk(id)
        : Dish.findByPk(id));

      return res.status(200)
        .json(dish);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async create(req, res) {
    const dish = req.body;
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
    const newDish = req.body;
    try {
      await Promise.all([
        Dish.update(newDish, { where: { id } }),
        DishController.updateChildren(newDish, id),
      ]);
      const dish = await Dish.scope(['defaultScope', 'full'])
        .findByPk(id);

      return res.status(200)
        .json(dish);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async updateChildren(dish, id) {
    const dishIngredients = DishController.getDishIngredients(dish.ingredients, id);
    await DishIngredient.destroy({ where: { dishId: id } });
    await DishIngredient.bulkCreate(dishIngredients);
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Promise.all([
        DishIngredient.destroy({ where: { dishId: id } }),
        Dish.destroy({ where: { id } }),
      ]);
      return res.status(200)
        .json('dish removed');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = DishController;
