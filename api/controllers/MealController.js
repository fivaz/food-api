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
      const createdMeal = await (meal.ingredients?.length > 0
        ? MealController.createWithChildren(meal)
        : Meal.create(meal));

      return res.status(201)
        .json(createdMeal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async createWithChildren(meal) {
    const { id } = await Meal.create(meal);
    const meaIngredients = MealController.getMealIngredients(meal.ingredients, id);
    await MealIngredient.bulkCreate(meaIngredients);
    return Meal.scope(['defaultScope', 'full'])
      .findByPk(id);
  }

  static getMealIngredients(ingredients, mealId) {
    return ingredients.map((ingredient) => {
      const { mealIngredients } = ingredient;
      mealIngredients.ingredientId = ingredient.id;
      mealIngredients.mealId = mealId;
      return mealIngredients;
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    const newMeal = req.body;
    try {
      await Promise.all([
        Meal.update(newMeal, { where: { id } }),
        MealController.updateChildren(newMeal, id),
      ]);
      const meal = await Meal.scope(['defaultScope', 'full'])
        .findByPk(id);

      return res.status(200)
        .json(meal);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async updateChildren(meal, id) {
    const mealIngredients = MealController.getMealIngredients(meal.ingredients, id);
    await MealIngredient.destroy({ where: { mealId: id } });
    await MealIngredient.bulkCreate(mealIngredients);
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Promise.all([
        MealIngredient.destroy({ where: { mealId: id } }),
        Meal.destroy({ where: { id } }),
      ]);
      return res.status(200)
        .json('meal removed');
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = MealController;
