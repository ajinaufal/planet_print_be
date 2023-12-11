const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const FileRequest = require('../models/request/file_request');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temporary');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
        );
    },
});

const filter = (req, file, cb) => {
    if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/webp'
    ) {
        cb(null, true);
    } else {
        return cb(new Error('Invalid file type'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: filter,
});

const fileService = ({ req, res, type, field }) => {
    let services;
    const fields = [
        { name: 'images', maxCount: 5 },
        { name: 'documents', maxCount: 2 },
    ];

    if (fields.length > 0) {
        services = upload.fields(fields);
    } else {
        services = upload.none();
    }

    return new Promise((resolve, reject) => {
        services(req, res, async (err) => {
            if (err) throw reject(new Error(`${err}`));
            if (fields.length > 0) resolve(req.files);
        });
    });
};

module.exports = { fileService };
