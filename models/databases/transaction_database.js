const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    carts: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    status: {
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

const TransactionModels = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModels;
