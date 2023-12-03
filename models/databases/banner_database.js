const mongoose = require('mongoose');

const BannersSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const BannersModels = mongoose.model('banners', BannersSchema);

module.exports = BannersModels;
