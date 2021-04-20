const { Router } = require('express');
const controller = require('../controllers/MealController');

const router = Router();

router.get('/meals', (req, res) => controller.getAll(req, res));
router.get('/meals/:id', (req, res) => controller.get(req, res));
router.post('/meals', (req, res) => controller.create(req, res));
router.put('/meals/:id', (req, res) => controller.update(req, res));
router.delete('/meals/:id', (req, res) => controller.delete(req, res));

module.exports = router;
