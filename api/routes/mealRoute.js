const { Router } = require('express');
const MealController = require('../controllers/MealController');

const router = Router();

router.get('/meals', MealController.getAll);

module.exports = router;
