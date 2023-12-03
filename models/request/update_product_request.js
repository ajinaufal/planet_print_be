const FileRequest = require('./file_request');

class UpdateProductRequest {
    constructor(req) {
        this.token = req.body.id || null;
        this.title = req.body.title || null;
        this.price = req.body.base_price || null;
        this.deskripsi = req.body.deskripsi || null;
        this.spesifikasi = req.body.spesifikasi || null;
        this.updateStock = req.body.update_stock || null;
        this.tokenCategory = req.body.token_category || null;
        this.file = req.files ? req.files.map((file) => new FileRequest(file)) : [];
    }
}

module.exports = UpdateProductRequest;
