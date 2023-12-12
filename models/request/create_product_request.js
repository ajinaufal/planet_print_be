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
        const message = [];
        if (!this.title || !(this.title instanceof String)) {
            message.push('Title input must be required and string');
        }
        if (!this.price || !(this.price instanceof Number)) {
            message.push('Price input must be required and number');
        }

        if (!this.category || !(this.category instanceof String)) {
            message.push('Category input must be required and string');
        }
        if (!this.stock || !(this.stock instanceof Number)) {
            message.push('Stock input must be required and number');
        }
        return message;
    }
}

module.exports = CreateProductRequest;
