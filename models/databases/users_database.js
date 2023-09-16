const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
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
});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;