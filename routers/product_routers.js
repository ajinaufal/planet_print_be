var express = require('express');
const { productCreate, getProduct } = require('../controllers/product_controller');
var router = express.Router();

router.post('/create', productCreate);
router.get('/', getProduct);

module.exports = router;
