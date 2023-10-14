class UpdateCartRequest {
    constructor(data) {
        this.token = data.id || null;
        this.productToken = data.product_token || null;
        this.total = data.total || null;
    }
}

module.exports = UpdateCartRequest;
