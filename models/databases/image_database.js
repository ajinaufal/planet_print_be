const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    path: {
        type: String,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ImageModels = mongoose.model('images', ImageSchema);

module.exports = ImageModels;
