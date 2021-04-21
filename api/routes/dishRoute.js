const { Router } = require('express');
const controller = require('../controllers/DishController');

const router = Router();

router.get('/dishes', controller.getAll);
router.get('/dishes/:id', controller.get);
router.post('/dishes', controller.create);
router.put('/dishes/:id', controller.update);
router.delete('/dishes/:id', controller.delete);

module.exports = router;
