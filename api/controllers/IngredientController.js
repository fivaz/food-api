const Controller = require('./Controller');
const { Ingredient } = require('../models');

class IngredientController extends Controller {
  constructor() {
    super();
    this.model = Ingredient;
  }

  async getAll(req, res) {
    try {
      const ingredients = await (req.query?.dishId
        ? this.findAllWithQuantities(req.user.id, req.query?.dishId)
        : this.findAll(req.user.id));

      return res.status(200)
        .json(ingredients);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  async findAllWithQuantities(userId, dishId) {
    return this.model.scope(['defaultScope', { method: ['withDish', userId, dishId] }])
      .findAll();
  }
}

module.exports = new IngredientController();
