class UpdateCategoryRequest {
    constructor(data) {
        this.token = data.id || null;
        this.name = data.name || null;
        this.photo = data.photo || null;
    }
}

module.exports = UpdateCategoryRequest;
