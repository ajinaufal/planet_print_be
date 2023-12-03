const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
    },
});

const RatingModels = mongoose.model('ratings', RatingSchema);

module.exports = RatingModels;
