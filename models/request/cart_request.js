class CartRequest {
    constructor(req) {
        this.tokenUser = req.user_token;
    }
}

module.exports = CartRequest;
