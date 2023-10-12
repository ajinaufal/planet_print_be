class UpdateProductRequest {
    constructor(data) {
        this.token = data.id || null;
        this.title = data.title || null;
        this.price = data.base_price || null;
        this.deskripsi = data.deskripsi || null;
        this.spesifikasi = data.spesifikasi || null;
        this.updateStock = data.update_stock || null;
    }
}

module.exports = UpdateProductRequest;
