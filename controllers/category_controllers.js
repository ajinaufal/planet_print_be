const FileHelper = require("../helper/file_helper");
const SecurityHelper = require("../helper/security_helper");
const { fileService } = require("../middleware/file_middleware");
const CategoryProductModels = require("../models/databases/category_product_database");
const UpdateCategoryRequest = require("../models/request/update_category_request");

const updateCategory = async (req, res) => {
    try {
        const resultService = fileService(req, res, "single", "photo");
        if (resultService) {
            res.status(resultService.code).json({
                message: resultService.message,
                data: null,
            });
        } else {
            if (SecurityHelper.isSecure(req, res, "admin")) {
                const request = new UpdateCategoryRequest(req.body);
                if (request.token) {
                    const update = await CategoryProductModels.findOne({
                        token: { $eq: request.token },
                    });
                    if (req.file) {
                        if (update.photo) FileHelper.delete(`.${update.photo}`);
                        FileHelper.move(
                            `./public/temporary/${req.file.filename}`,
                            `./public/category_product/${req.file.filename}`
                        );
                        update.photo = `/public/category_product/${req.file.filename}`;
                    }
                    if (request.name) update.name = request.name;
                    update.updatedAt = new Date();
                    await CategoryProductModels.updateOne(update);
                    res.status(200).json({
                        message: "Congratulations, you have successfully updated your data.",
                        data: { name: update.name, photo: update.photo },
                    });
                } else {
                    const category = new CategoryProductModels();
                    category.token = uuidv4();
                    category.name = request.name;
                    if (req.file) {
                        FileHelper.move(
                            `./public/temporary/${req.file.filename}`,
                            `./public/category_product/${req.file.filename}`
                        );
                        category.photo = `/public/category_product/${req.file.filename}`;
                    }
                    category.createdAt = new Date();
                    category.updatedAt = new Date();
                    await category.save();
                    res.status(200).json({
                        message: "Congratulations, you have successfully created your data.",
                        data: { name: category.name, photo: category.photo },
                    });
                }
            }
            res.status(401).json({
                message: "Failed, you did not update your data successfully.",
                data: null,
            });
        }
    } catch (error) {
        res.status(400).json({
            message: `an error occurred in the system, ${error}`,
            data: null,
        });
    }
};

const getCategory = async (req, res) => {
    const secretKey = req.headers["secret-key"];
    const token = req.headers["Authorization"];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey && verifyToken(token, null)) {
        const categorys = await CategoryProductModels.find({});
        const data = categorys.map((category) => {
            return {
                id: category.token,
                name: category.name,
                photo: category.photo,
            };
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
