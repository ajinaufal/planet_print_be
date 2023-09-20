const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const FileRequest = require("../models/request/file_request");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temporary");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.originalname.split(".")[file.originalname.split(".").length - 1]);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
