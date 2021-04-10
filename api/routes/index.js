const bodyParser = require('body-parser');
const ingredients = require('./ingredientRoute');
const dishes = require('./dishRoute');
const meals = require('./mealRoute');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(ingredients);
  app.use(dishes);
  app.use(meals);
};
