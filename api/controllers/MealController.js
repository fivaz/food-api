const Controller = require('./Controller');
const { Meal } = require('../models');

class MealController extends Controller {
  constructor() {
    super();
    this.model = Meal;
  }
}

module.exports = new MealController();
