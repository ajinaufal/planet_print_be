const { userRoleEnum } = require("../enum/role_enum");
const FileHelper = require("../helper/file_helper");
const SecurityHelper = require("../helper/security_helper");
const CategoryProductModels = require("../models/databases/category_product_database");
const UpdateCategoryRequest = require("../models/request/update_category_request");
const { v4: uuidv4 } = require("uuid");

const updateCategory = async (req, res) => {
    try {
        if (SecurityHelper.isSecure(req, res, userRoleEnum.Admin)) {
            const request = new UpdateCategoryRequest(req);
            if (request.token) {
                const update = await CategoryProductModels.findOne({
                    token: { $eq: request.token },
                });
                if (request.file) {
                    if (update.photo) FileHelper.delete(`.${update.photo}`);
                    FileHelper.move(
                        `./public/temporary/${request.file.fileName}`,
                        `./public/category_product/${request.file.fileName}`
                    );
                    update.photo = `/category_product/${request.file.fileName}`;
                }
                if (request.name) update.name = request.name;
                update.updatedAt = new Date();
                await CategoryProductModels.updateOne(update);
                res.status(200).json({
                    message:
                        "Congratulations, you have successfully updated your data.",
                    data: { name: update.name, photo: update.photo },
                });
            } else {
                if (request.file) {
                    const category = new CategoryProductModels();
                    category.token = uuidv4();
                    category.name = request.name;
                    FileHelper.move(
                        `./public/temporary/${request.file.fileName}`,
                        `./public/category_product/${request.file.fileName}`
                    );
                    category.photo = `/category_product/${request.file.fileName}`;
                    category.createdAt = new Date();
                    category.updatedAt = new Date();
                    await category.save();
                    res.status(200).json({
                        message:
                            "Congratulations, you have successfully created your data.",
                        data: category,
                    });
                } else {
                    res.status(403).json({
                        message: `You forgot the photo`,
                        data: null,
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: `an error occurred in the system, ${error}`,
            data: null,
        });
    }
};

const getCategory = async (req, res) => {
    const secretKey = req.headers["secret-key"];
    const token = req.headers["Authorization"];
    if (
        EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey &&
        verifyToken(token, null)
    ) {
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
