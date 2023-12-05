var express = require('express');
const { productCreate } = require('../controllers/product_controller');
var router = express.Router();

router.post('/create', productCreate);

module.exports = router;
