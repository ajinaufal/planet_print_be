const { v4: uuidv4 } = require("uuid");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temporary");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            uuidv4() +
                "." +
                file.originalname.split(".")[
                    file.originalname.split(".").length - 1
                ]
        );
    },
});

const filter = (req, file, cb) => {
    if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/webp"
    ) {
        cb(null, true);
    } else {
        return cb(new Error("Invalid file type"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: filter,
});

function fileService(req, res, type, field) {
    let services;
    if (type == "single") {
        services = upload.single(field);
    } else {
        services = upload.array(field);
    }

    services(req, res, async (err) => {
        return err;
    });
}

module.exports = { fileService, upload };
