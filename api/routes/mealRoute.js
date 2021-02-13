const {Router} = require('express');
const MealController = require('../controllers/MealController');

const router = Router();

router.get('/meals', MealController.getAll);
router.get('/meals/:id', MealController.get);
router.post('/meals', MealController.create);
router.put('/meals/:id', MealController.update);
router.delete('/meals/:id', MealController.delete);

module.exports = router;