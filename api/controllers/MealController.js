const { Meal, Ingredient } = require('../models');

class MealController {
  static async getAll(req, res) {
    try {
      const options = req.query?.full ? {
        include: {
          model: Ingredient,
          as: 'ingredients',
        },
      } : {};
      const all = await Meal.findAll(options);
      return res.status(200)
        .json(all);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async get(req, res) {
    const { id } = req.params;
    try {
      const element = req.query?.full
        ? await MealController.findOneFull(id)
        : await MealController.findOne(id);

      return res.status(200)
        .json(element);
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
    // const records = MealController.getMealIngredients(meal, id);
    // await MealIngredients.bulkCreate(records);
    return MealController.findOneFull(id);
  }

  static getMealIngredients(meal, id) {
    return meal.ingredients.map((ingredient) => {
      const { mealIngredients } = ingredient;
      mealIngredients.ingredientId = ingredient.id;
      mealIngredients.mealId = id;
      return mealIngredients;
    });
  }

  static async findOneFull(id) {
    return Meal.findOne({
      where: { id: Number(id) },
      include: {
        model: Ingredient,
        as: 'ingredients',
      },
    });
  }

  // TODO check if I can remove these Number(id)
  static async findOne(id) {
    return Meal.findOne({
      where: { id: Number(id) },
    });
  }

  // TODO try to do this better
  static async update(req, res) {
    const id = Number(req.params.id);
    const newData = req.body;
    try {
      await Meal.update(newData, { where: { id } });
      let result = await Meal.findOne({ where: { id } });
      if (newData.ingredients?.length > 0) {
        result = await MealController.updateChildren(newData, id);
      }
      return res.status(200)
        .json(result);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }

  static async updateChildren(newData, id) {
    // const records = MealController.getMealIngredients(newData, id);
    // TODO check afterBulkDestroy as an option
    // await MealIngredients.destroy({ where: { mealId: id } });
    // await MealIngredients.bulkCreate(records);
    return MealController.findOneFull(id);
  }

  static async delete(req, res) {
    const id = Number(req.params.id);
    try {
      await Promise.all([
        // MealIngredients.destroy({ where: { mealId: id } }),
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
