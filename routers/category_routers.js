var express = require('express');
const { getCategory } = require('../controllers/category_controllers');

var router = express.Router();

router.get('/', getCategory);

module.exports = router;
