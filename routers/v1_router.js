var express = require("express");
var router = express.Router();

const {
    register,
    login,
} = require("../controllers/authentication_controller.js");
const productController = require("../controllers/product_controller.js");
const {
    updateCategory,
    getCategory,
} = require("../controllers/category_controllers.js");
const { upload } = require("../middleware/file_middleware.js");

router.post("/login", login);
router.post("/register", upload.single("photo"), register);

router.post("/product");

router.post("/product/category", getCategory);
router.post("/product/category/update", upload.single("photo"), updateCategory);

module.exports = router;
