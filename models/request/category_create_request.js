class CategoryCreateRequest {
    constructor(req) {
        this.name = req.body.name || null;
    }
}

module.exports = CategoryCreateRequest;
