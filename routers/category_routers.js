var express = require('express');
const {
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory,
} = require('../controllers/category_controllers');

var router = express.Router();

router.post('/', getCategory);
router.post('/create', createCategory);
router.post('/delete', deleteCategory);
router.post('/update', updateCategory);

module.exports = router;
