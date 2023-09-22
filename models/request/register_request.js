class RegisterRequest {
    constructor(data) {
        this.email = data.email || null;
        this.password = data.password || null;
        this.phone = data.phone || null;
        this.photo = data.photo || null;
    }
}

module.exports = RegisterRequest;
