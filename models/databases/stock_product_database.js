const mongoose = require('mongoose');

const StockProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
    },
});

const StockProductModels = mongoose.model('stock_product', StockProductSchema);

module.exports = StockProductModels;
