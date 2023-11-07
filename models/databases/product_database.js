const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category_product",
        required: true,
    },
    photo: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    specification: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const ProductModels = mongoose.model("product", ProductSchema);

module.exports = ProductModels;
