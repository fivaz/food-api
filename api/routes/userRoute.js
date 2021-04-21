const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

// router.get('/users', UserController.getAll);
// router.get('/users/:id', UserController.get);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
// router.put('/users/:id', UserController.update);
// router.delete('/users/:id', UserController.delete);

module.exports = router;
