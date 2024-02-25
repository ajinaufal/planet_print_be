const FileRequest = require('./file_request');

class RegisterRequest {
    constructor(req) {
        this.email = req.body.email || null;
        this.name = req.body.name || null;
        this.password = req.body.password || null;
        this.phone = req.body.phone || null;
    }
}

module.exports = RegisterRequest;
