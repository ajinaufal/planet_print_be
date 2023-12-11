const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    path: {
        type: String,
    },
    basename: {
        type: String,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    size: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FilesModels = mongoose.model('files', FileSchema);

module.exports = FilesModels;
