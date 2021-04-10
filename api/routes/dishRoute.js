const { Router } = require('express');
const DishController = require('../controllers/DishController');

const router = Router();

router.get('/dishes', DishController.getAll);
router.get('/dishes/:id', DishController.get);
router.post('/dishes', DishController.create);
router.put('/dishes/:id', DishController.update);
router.delete('/dishes/:id', DishController.delete);

module.exports = router;
