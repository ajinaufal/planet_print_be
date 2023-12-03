const mongoose = require('mongoose');

const CategoryProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const CategoryProductModels = mongoose.model('category_product', CategoryProductSchema);

module.exports = CategoryProductModels;
