class ProductRequest {
    constructor(data) {
        this.token = data.id || null;
        this.filter = data.filter || null;
    }
}

module.exports = ProductRequest;
