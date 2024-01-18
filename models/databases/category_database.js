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
    },
    isActive: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const CategoryModels = mongoose.model('category_product', CategoryProductSchema);

module.exports = CategoryModels;
