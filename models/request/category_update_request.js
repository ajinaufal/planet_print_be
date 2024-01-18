class CategoryUpdateRequest {
    constructor(req) {
        this.token = req.body.id || null;
        this.name = req.body.name || null;
    }
}

module.exports = CategoryUpdateRequest;
