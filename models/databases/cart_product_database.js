const mongoose = require("mongoose");

const CartProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    total: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
    },
});

const CartProductModels = mongoose.model("cart_product", CartProductSchema);

module.exports = CartProductModels;
