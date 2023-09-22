var express = require("express");
var router = express.Router();

const authController = require("../controllers/authentication_controller.js");
const productController = require("../controllers/product_controller.js");
const { fileService } = require("../middleware/file_middleware.js");

router.post("/login", authController.login);
router.post("/register", async (req, res, next) => fileService(req, res, "single", "photo", authController.register));

router.post("/product/category", productController.getCategory);
router.post("/product/category/update", async (req, res, next) =>
    fileService(req, res, "single", "image", productController.updateCategory)
);

module.exports = router;
