const { v4: uuidv4 } = require("uuid");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temporary");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "." + file.originalname.split(".")[file.originalname.split(".").length - 1]);
    },
});

const fileFilter = (req, file, cb) => {
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

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: fileFilter });

function fileService(req, res, type, field, controller) {
    let services;
    if (type == "single") {
        services = upload.single(field);
    } else {
        services = upload.array(field);
    }

    services(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(400).json({
                message: `Failed to upload file, ${err}`,
                data: null,
            });
        } else if (err) {
            res.status(500).json({
                message: `An error occurred in the system, ${err}`,
                data: null,
            });
        } else {
            controller(req, res);
        }
    });
}

module.exports = { fileService };
