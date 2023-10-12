const FileRequest = require("./file_request");

class RegisterRequest {
    constructor(req) {
        this.email = req.body.email || null;
        this.password = req.body.password || null;
        this.phone = req.body.phone || null;
        this.file = req.body.photo ? new FileRequest(req.file) : null;
    }
}

module.exports = RegisterRequest;
