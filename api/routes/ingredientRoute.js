const {Router} = require('express')
const IngredientController = require('../controllers/IngredientController')

const router = Router()

router.get('/ingredients', IngredientController.getAll)
router.get('/ingredients/:id', IngredientController.get)

module.exports = router