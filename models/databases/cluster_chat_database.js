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
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

const MessageModels = mongoose.model("cluster_message", ClusterMessageSchema);

module.exports = MessageModels;
