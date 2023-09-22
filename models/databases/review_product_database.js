const mongoose = require("mongoose");

const ReviewProductSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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

const ReviewProductModels = mongoose.model("review_product", ReviewProductSchema);

module.exports = ReviewProductModels;
