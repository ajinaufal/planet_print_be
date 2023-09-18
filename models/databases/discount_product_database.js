const mongoose = require('mongoose');

const DiscountProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    deskripsi: {
        type: String,
    },
    persen: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdAt: {
        type: Date
    },
});

const DiscountProductModels = mongoose.model('discount_product', DiscountProductSchema);

module.exports = DiscountProductModels;