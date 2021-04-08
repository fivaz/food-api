const bodyParser = require('body-parser');
const ingredients = require('./ingredientRoute');
const meals = require('./mealRoute');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(ingredients);
  app.use(meals);
};
