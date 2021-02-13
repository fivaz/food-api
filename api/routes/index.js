const bodyParser = require('body-parser')
const ingredients = require('./ingredientRoute')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(ingredients)
};