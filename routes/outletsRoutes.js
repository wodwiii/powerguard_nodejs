const express = require('express');
const router = express.Router();
const outletsController = require('../controllers/outletsController');

router.get('/', outletsController.getAllOutlets);
router.put('/control', outletsController.controlOutlet);
router.put('/toggle/:name', outletsController.toggleOutlet);

module.exports = router;
