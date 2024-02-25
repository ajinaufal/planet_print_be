const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    unique: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
    token_user: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

usersSchema.index({ email: 1 }, { unique: true });

const UsersModels = mongoose.model('users', usersSchema);

module.exports = UsersModels;
