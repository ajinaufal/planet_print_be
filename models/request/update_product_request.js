class UpdateProductRequest {
    constructor(data) {
        this.token = data?.token || '';
        this.title = data?.title || '';
        this.price = data?.price || 0;
        this.description = data?.description || '';
        this.spesification = data?.spesification || '';
        this.stock = data?.stock || '';
        this.category = data?.category || '';
        this.delete_photos = data?.delete_photos || [];
    }
}

module.exports = UpdateProductRequest;
