const FileRequest = require('./file_request');

class CreateProductRequest {
    constructor(req) {
        this.title = req.body.title || null;
        this.price = req.body.price || null;
        this.description = req.body.description || null;
        this.specification = req.body.specification || null;
        this.stock = req.body.stock || null;
        this.category = req.body.category || null;
        // this.variants = req.body.variants || [];
    }

    validation() {
        return this.title && this.price && this.category && this.stock;
    }
}

module.exports = CreateProductRequest;
