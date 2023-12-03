const FileRequest = require('./file_request');

class CreateProductRequest {
    constructor(req) {
        this.title = req.body.title || null;
        this.price = req.body.price || null;
        this.description = req.body.description || null;
        this.specification = req.body.specification || null;
        this.stock = req.body.stock || null;
        this.tokenCategory = req.body.token_category || null;
        this.file = req.files ? req.files.map((file) => new FileRequest(file)) : [];
    }

    validation() {
        return this.title && this.price && this.tokenCategory;
    }
}

module.exports = CreateProductRequest;
