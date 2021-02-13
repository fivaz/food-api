const {Router} = require('express')
const IngredientController = require('../controllers/IngredientController')

const router = Router()

router.get('/ingredients', IngredientController.getAll)

module.exports = router