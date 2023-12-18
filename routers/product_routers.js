var express = require('express');
const { productCreate, getProduct, deleteProduct } = require('../controllers/product_controller');
var router = express.Router();

router.get('/', getProduct);
router.post('/create', productCreate);
router.post('/delete', deleteProduct);

module.exports = router;
