class UpdateCategoryRequest {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.photo = data.photo || null;
    }
}

module.exports = UpdateCategoryRequest;