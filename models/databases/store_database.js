const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String,
    },
    slug: {
        type: String,
    },
    type: {
        type: String,
    },
    status: {
        type: String,
    },
    showcase: {
        type: [String],
    },
    products: {
        type: [String],
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
    },
});

const ImageModels = mongoose.model('images', ImageSchema);

module.exports = ImageModels;
