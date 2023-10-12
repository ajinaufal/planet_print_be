const FileRequest = require("./file_request");

class UpdateCategoryRequest {
    constructor(req) {
        this.token = req.body.id || null;
        this.name = req.body.name || null;
        this.photo = req.body.photo || null;
        this.file = req.file ? new FileRequest(req.file) : null;
    }
}

module.exports = UpdateCategoryRequest;
