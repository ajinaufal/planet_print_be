const variantSchema = new mongoose.Schema({
    name: String,
    image: String,
    color: String,
});

const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
});

const ImageModels = mongoose.model('images', ImageSchema);

module.exports = ImageModels;
