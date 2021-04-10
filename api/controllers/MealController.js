const { Meal } = require('../models');

class MealController {
  static async getAll(req, res) {
    try {
      const meals = await Meal.scope(['defaultScope', 'full'])
        .findAll();
      return res.status(200)
        .json(meals);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = MealController;
