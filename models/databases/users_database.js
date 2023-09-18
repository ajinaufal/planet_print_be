const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    unique: {
        type: String,
        unique: true,
    },
    photo: {
        type: String,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
    },
});

const UsersModels = mongoose.model('users', usersSchema);

module.exports = UsersModels;