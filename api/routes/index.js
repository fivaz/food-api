const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const ingredients = require('./ingredientRoute');
const dishes = require('./dishRoute');
const meals = require('./mealRoute');
const users = require('./userRoute');

const { TOKEN_SECRET } = require('../helpers/vars');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(jwt({ secret: TOKEN_SECRET, algorithms: ['HS256'] })
    .unless({ path: ['/login', '/register'] }));

  app.use(ingredients);
  app.use(dishes);
  app.use(meals);
  app.use(users);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401)
        .send('invalid token...');
    }
  });
};
