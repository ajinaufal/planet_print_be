const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    carts: {
        type: [String],
        required: true,
    },
    discount: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    uniq: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    approval: {
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

const TransactionModels = mongoose.model('transactions', TransactionSchema);

module.exports = TransactionModels;
