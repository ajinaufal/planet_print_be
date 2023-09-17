const EncryptHelper = require("../helper/encript");
const CategoryProductModels = require("../models/databases/category_product_database");
const UsersModels = require("../models/databases/users_database");
const UpdateCategoryRequest = require("../models/request/update_category");
const { v4: uuidv4 } = require('uuid');

const updateCategory = async (req, res) => {
    const secretKey = req.headers['secret-key'];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey) {
        const request = new UpdateCategoryRequest(req.body);
        if (request.id) {
            const update = CategoryProductModels.findOne({ _id: { $eq: request.id } });
            if (request.name) update.name = request.name;
            if (request.photo) update.photo = request.photo;
            update.updatedAt = new Date();
            await CategoryProductModels.updateOne(update);
        } else {
            const category = new CategoryProductModels();
            category._id = uuidv4;
            category.name = request.name;
            category.photo = request.photo;
            category.createdAt = new Date();
            category.updatedAt = new Date();
            await category.save();
        }
    }
}