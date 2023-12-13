const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    title: { type: String },
    variants: [String],
});

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
        type: String,
        required: true,
    },
    photo: {
        type: [String],
        default: [],
    },
    variants: {
        type: [variantSchema],
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
    isDelete: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const ProductModels = mongoose.model('product', ProductSchema);

module.exports = ProductModels;
