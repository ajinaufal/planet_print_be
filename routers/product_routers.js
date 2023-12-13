var express = require('express');
const { productCreate, getProduct, deleteProduct } = require('../controllers/product_controller');
var router = express.Router();

router.post('/create', productCreate);
router.post('/delete', deleteProduct);
router.get('/', getProduct);

module.exports = router;
