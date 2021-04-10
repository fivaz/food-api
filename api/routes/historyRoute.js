const { Router } = require('express');
const HistoryController = require('../controllers/HistoryController');

const router = Router();

router.get('/histories', HistoryController.getAll);

module.exports = router;
