const Controller = require('./Controller');
const { Dish, DishIngredient } = require('../models');
const { checkRight } = require('../helpers/user-gate');

class DishController extends Controller {
  constructor() {
    super();
    this.model = Dish;
  }

  async create(req, res) {
    const data = req.body;
    data.userId = req.user.id;
    try {
      const { id } = await (data.ingredients?.length > 0
        ? this.createWithChildren(data)
        : this.model.create(data));

      const dish = await this.find(id, req.user.id, req.query?.scope);

      return res.status(201)
        .json(dish);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  async createWithChildren(dish) {
    const { id } = await this.model.create(dish);
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

  async update(req, res) {
    const { id } = req.params;
    try {
      const foundDish = await this.findOrFail(id);
      checkRight(req.user, foundDish);

      const data = { ...req.body, userId: req.user.id };
      await Promise.all([
        this.model.update(data, { where: { id } }),
        DishController.updateChildren(data, id),
      ]);

      const dish = await this.find(id, req.user.id, req.query?.scope);

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

  async delete(req, res) {
    const { id } = req.params;
    try {
      const foundDish = await this.findOrFail(id);
      checkRight(req.user, foundDish);

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

module.exports = new DishController();
