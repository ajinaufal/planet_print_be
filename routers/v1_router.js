var express = require("express");
var router = express.Router();

const authController = require("../controllers/authentication_controller.js");
const productController = require("../controllers/product_controller.js");
const categoryController = require("../controllers/category_controllers.js");

router.post("/login", authController.login);
// router.post("/register", async (req, res, next) => fileService(req, res, "single", "photo", authController.register));

router.post("/product/category", categoryController.getCategory);
router.post("/product/category/update", categoryController.updateCategory);

module.exports = router;
