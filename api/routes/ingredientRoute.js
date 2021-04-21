const { Router } = require('express');
const controller = require('../controllers/IngredientController');

const router = Router();

router.get('/ingredients', controller.getAll);
router.get('/ingredients/:id', controller.get);
router.post('/ingredients', controller.create);
router.put('/ingredients/:id', controller.update);
router.delete('/ingredients/:id', controller.delete);

module.exports = router;
