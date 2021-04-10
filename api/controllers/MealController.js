const { Meal, MealIngredient } = require('../models');

class MealController {
  static async getAll(req, res) {
    try {
      const meals = await (req.query?.scope === 'full'
        ? Meal.scope(['defaultScope', 'full'])
          .findAll()
        : Meal.findAll());

      return res.status(200)
        .json(meals);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async get(req, res) {
    const { id } = req.params;
    try {
      const meal = await (req.query?.scope === 'full'
        ? Meal.scope(['defaultScope', 'full'])
          .findByPk(id)
        : Meal.findByPk(id));

      return res.status(200)
        .json(meal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async create(req, res) {
    const meal = req.body;
    try {
      let createdMeal = await Meal.create(meal);
      if (meal.ingredients?.length > 0) {
        createdMeal = await MealController.createChildren(meal, createdMeal.id);
      }
      return res.status(201)
        .json(createdMeal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async createChildren(meal, id) {
    const records = MealController.getMealIngredients(meal, id);
    await MealIngredient.bulkCreate(records);
    return Meal.scope(['defaultScope', 'full'])
      .findByPk(id);
  }

  static getMealIngredients(meal, id) {
    return meal.ingredients.map((ingredient) => {
      const { mealIngredients } = ingredient;
      mealIngredients.ingredientId = ingredient.id;
      mealIngredients.mealId = id;
      return mealIngredients;
    });
  }

  // TODO try to do this better
  static async update(req, res) {
    const id = Number(req.params.id);
    const newData = req.body;
    try {
      await Meal.update(newData, { where: { id } });
      let mealController = await Meal.findByPk(id);
      if (newData.ingredients?.length > 0) {
        mealController = await MealController.updateChildren(newData, id);
      }
      return res.status(200)
        .json(mealController);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async updateChildren(newData, id) {
    const records = MealController.getMealIngredients(newData, id);
    // TODO check afterBulkDestroy as an option
    await MealIngredient.destroy({ where: { mealId: id } });
    await MealIngredient.bulkCreate(records);
    return Meal.scope(['defaultScope', 'full'])
      .findByPk(id);
  }

  static async delete(req, res) {
    const id = Number(req.params.id);
    try {
      await Promise.all([
        MealIngredient.destroy({ where: { mealId: id } }),
        Meal.destroy({ where: { id } }),
      ]);
      return res.status(200)
        .json(`row ${id} deleted`);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = MealController;
