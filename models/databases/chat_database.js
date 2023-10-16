const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    cluster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cluster_chat",
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    photo: {
        type: String,
    },
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const MessageModels = mongoose.model("message", MessageSchema);

module.exports = MessageModels;
