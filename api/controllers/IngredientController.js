const { Ingredient } = require('../models');

class IngredientController {
  static async getAll(req, res) {
    try {
      const ingredients = await (req.query?.dishId
        ? IngredientController.findAllWithQuantities(req.query?.dishId)
        : Ingredient.findAll());

      return res.status(200)
        .json(ingredients);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async findAllWithQuantities(dishId) {
    return Ingredient.scope(['defaultScope', { method: ['withDish', dishId] }])
      .findAll();
  }

  static async get(req, res) {
    try {
      const element = await Ingredient.findByPk(req.params.id);
      return res.status(200)
        .json(element);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async create(req, res) {
    try {
      const ingredient = await Ingredient.create(req.body);
      return res.status(201)
        .json(ingredient);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      await Ingredient.update(req.body, { where: { id } });
      const updatedIngredient = await Ingredient.findByPk(id);
      return res.status(200)
        .json(updatedIngredient);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async delete(req, res) {
    try {
      await Ingredient.destroy({ where: { id: req.params.id } });
      return res.status(200)
        .json('ingredient removed');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = IngredientController;
