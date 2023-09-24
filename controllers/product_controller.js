const EncryptHelper = require("../helper/encript");
const CategoryProductModels = require("../models/databases/category_product_database");
const UsersModels = require("../models/databases/users_database");
const UpdateCategoryRequest = require("../models/request/update_category_request");
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("./authentication_controller");
const FileHelper = require("../helper/file_helper");
const SecurityHelper = require("../helper/security_helper");
const ProductRequest = require("../models/request/update_product_request");
const ProductModels = require("../models/databases/product_database");
const StockProductModels = require("../models/databases/stock_product_database");
const { v4: uuidv4 } = require("uuid");

const updateProduct = async (req, res) => {
    const { verify, dataToken } = SecurityHelper.isSecure(req, res, null);
    const data = new ProductRequest(req.body);
    if (verify) {
        if (data.token) {
            const update = await ProductModels.findOne({
                token: { $eq: data.token },
            });

            if (data.title) update.title = data.title;
            if (data.price) update.price = data.price;
            if (data.deskripsi) update.deskripsi = data.deskripsi;
            if (data.spesifikasi) update.spesifikasi = data.spesifikasi;
            update.updatedAt = new Date();

            if (data.updateStock) {
                const stock = new StockProductModels();
                stock.product = update._id;
                stock.type = data.updateStock < 0 ? "subtraction" : "addition";
                stock.code = "update";
                stock.total = Math.abs(data.updateStock);
                stock.createdAt = new Date();
                await stock.save();
            }
        }
    } else {
        if (data.title && data.price && data.deskripsi && data.spesifikasi) {
            const product = new ProductModels();
            product.token = uuidv4();
        } else {
        }
    }
};

module.exports = { updateProduct };
