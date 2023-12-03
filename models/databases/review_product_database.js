const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: String,
    },
    users: {
        type: String,
    },
    deskripsi: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
    },
});

const ReviewModels = mongoose.model('reviews', ReviewSchema);

module.exports = ReviewModels;
