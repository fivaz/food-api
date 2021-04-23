const { Router } = require('express');
const controller = require('../controllers/UserController');

const router = Router();

router.get('/users/:id', controller.get);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.put('/users/:id', controller.update);
router.delete('/users/:id', controller.delete);

module.exports = router;
