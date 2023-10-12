class ProductRequest {
    constructor(data) {
        this.page = data.page || 1;
        this.size = data.size || 10;
        this.token = data.id || null;
    }
}

module.exports = ProductRequest;
