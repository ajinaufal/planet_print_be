var express = require('express');
const { createCategory, deleteCategory } = require('../controllers/category_controllers');

var router = express.Router();

router.post('/create', createCategory);
router.post('/delete', deleteCategory);

module.exports = router;
