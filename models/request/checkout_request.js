class CheckoutRequest {
    constructor(data) {
        this.cartToken = data.cart_token ?? [];
    }
}

module.exports = CheckoutRequest;
