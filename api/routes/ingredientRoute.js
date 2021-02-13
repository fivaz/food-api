const {Router} = require('express')
const IngredientController = require('../controllers/IngredientController')

const router = Router()

router.get('/ingredients', IngredientController.getAll)
router.get('/ingredients/:id', IngredientController.get)
router.post('/ingredients', IngredientController.create)
router.put('/ingredients/:id', IngredientController.update)

module.exports = router