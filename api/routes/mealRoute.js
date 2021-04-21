const { Router } = require('express');
const controller = require('../controllers/MealController');

const router = Router();

router.get('/meals', controller.getAll);
router.get('/meals/:id', controller.get);
router.post('/meals', controller.create);
router.put('/meals/:id', controller.update);
router.delete('/meals/:id', controller.delete);

module.exports = router;
