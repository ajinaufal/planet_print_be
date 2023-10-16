const mongoose = require("mongoose");

const ClusterMessageSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
    },
    type: {
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

const ClusterMessageModels = mongoose.model(
    "cluster_message",
    ClusterMessageSchema
);

module.exports = ClusterMessageModels;
