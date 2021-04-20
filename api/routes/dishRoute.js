const { Router } = require('express');
const controller = require('../controllers/DishController');

const router = Router();

router.get('/dishes', (req, res) => controller.getAll(req, res));
router.get('/dishes/:id', (req, res) => controller.get(req, res));
router.post('/dishes', (req, res) => controller.create(req, res));
router.put('/dishes/:id', (req, res) => controller.update(req, res));
router.delete('/dishes/:id', (req, res) => controller.delete(req, res));

module.exports = router;
