var express = require('express');
const { getProduct, deleteProduct, createProduct } = require('../controllers/product_controller');
var router = express.Router();

router.get('/', getProduct);
router.post('/create', createProduct);
router.post('/delete', deleteProduct);

module.exports = router;
