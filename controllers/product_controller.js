const EncryptHelper = require("../helper/encript");
const CategoryProductModels = require("../models/databases/category_product_database");
const UsersModels = require("../models/databases/users_database");
const UpdateCategoryRequest = require("../models/request/update_category");
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("./authentication_controller");

const updateCategory = async (req, res) => {
    const secretKey = req.headers["secret-key"];
    const token = req.headers["Authorization"];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey) {
        const request = new UpdateCategoryRequest(req.body);
        if (request.id) {
            if (verifyToken(token, "admin")) {
                const update = CategoryProductModels.findOne({ _id: { $eq: request.id } });
                if (request.name) update.name = request.name;
                if (request.photo) update.photo = request.photo;
                update.updatedAt = new Date();
                await CategoryProductModels.updateOne(update);
                res.status(200).json({
                    message: "Congratulations, you have successfully updated your data.",
                    data: { name: update.name, photo: update.photo },
                });
            }
        } else {
            if (verifyToken(token, "admin")) {
                const category = new CategoryProductModels();
                category.token = uuidv4();
                category.name = request.name;
                category.photo = request.photo;
                category.createdAt = new Date();
                category.updatedAt = new Date();
                await category.save();
                res.status(200).json({
                    message: "Congratulations, you have successfully created your data.",
                    data: { name: category.name, photo: category.photo },
                });
            }
        }
    }
    res.status(401).json({
        message: "Failed, you did not update your data successfully.",
        data: null,
    });
};

const getCategory = async (req, res) => {
    const secretKey = req.headers["secret-key"];
    const token = req.headers["Authorization"];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey && verifyToken(token, null)) {
        const categorys = await CategoryProductModels.find({});
        const data = categorys.map((category) => {
            return { id: category.token, name: category.name, photo: category.photo };
        });
        res.status(200).json({
            message: "Congratulations, you have successfully get your data.",
            data: data,
        });
    }
    res.status(200).json({
        message: "Failed, you did not get your data successfully.",
        data: null,
    });
};

module.exports = { updateCategory, getCategory };
