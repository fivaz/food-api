const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const ingredients = require('./ingredientRoute');
const dishes = require('./dishRoute');
const meals = require('./mealRoute');
const users = require('./userRoute');

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secretkey';

// TODO add a proper missing token error

module.exports = (app) => {
  app.use(jwt({ secret: TOKEN_SECRET, algorithms: ['HS256'] })
    .unless({ path: ['/login', '/register'] }));
  app.use(bodyParser.json());
  app.use(ingredients);
  app.use(dishes);
  app.use(meals);
  app.use(users);
};
