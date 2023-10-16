var express = require("express");
var router = express.Router();

const {
    register,
    login,
} = require("../controllers/authentication_controller.js");
const {
    getProduct,
    updateProduct,
} = require("../controllers/product_controller.js");
const {
    updateCategory,
    getCategory,
} = require("../controllers/category_controllers.js");
const { upload } = require("../middleware/file_middleware.js");
const {
    updateCart,
    getCart,
    checkoutCart,
} = require("../controllers/cart_controller.js");
const { getDiscount } = require("../controllers/discount_controllers.js");

// Authentication
router.post("/login", login);
router.post("/register", upload.single("photo"), register);

// Category
router.post("/product/category", getCategory);
router.post("/product/category/update", upload.single("photo"), updateCategory);

// Product
router.post("/product", getProduct);
router.post("/product/update", upload.array("photo"), updateProduct);

// Cart
router.post("/cart/update", updateCart);
router.post("/cart/checkout", checkoutCart);
router.post("/cart", getCart);

// Discount
router.get("/discount", getDiscount);

module.exports = router;
