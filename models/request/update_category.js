class UpdateCategoryRequest {
    constructor(data) {
        this.id = data.email || null;
        this.name = data.password || null;
        this.photo = data.photo || null;
    }
}

module.exports = UpdateCategoryRequest;