var express = require("express");
var router = express.Router();

const upload = require("../middleware/file_middleware.js");

const authController = require("../controllers/authentication_controller.js");
const productController = require("../controllers/product_controller.js");

router.post("/login", authController.login);
router.post("/register", upload.single("photo"), authController.register);

router.post("/product/category", productController.getCategory);
router.post("/product/category/update", productController.updateCategory);

module.exports = router;
