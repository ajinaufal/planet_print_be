const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: [String],
        default: [],
        required: true,
    },
    user: {
        type: String,
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
    },
});

const CartModels = mongoose.model('carts', CartSchema);

module.exports = CartModels;
