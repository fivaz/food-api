const { Router } = require('express');
const controller = require('../controllers/IngredientController');

const router = Router();

router.get('/ingredients', (req, res) => controller.getAll(req, res));
router.get('/ingredients/:id', (req, res) => controller.get(req, res));
router.post('/ingredients', (req, res) => controller.create(req, res));
router.put('/ingredients/:id', (req, res) => controller.update(req, res));
router.delete('/ingredients/:id', (req, res) => controller.delete(req, res));

module.exports = router;
