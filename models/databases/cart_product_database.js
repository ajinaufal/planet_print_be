const mongoose = require("mongoose");

const CartProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

const CartProductModels = mongoose.model("cart_product", CartProductSchema);

module.exports = CartProductModels;
