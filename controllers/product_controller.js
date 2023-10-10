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
            product.title = data.title;
            product.price = data.price;
            product.deskripsi = data.deskripsi;
            product.spesifikasi = data.spesifikasi;
            product.createdAt = new Date();
            product.updatedAt = new Date();
            await product.save();
        } else {
        }
    }
};

const cartProductUpdate = async (req, res) => {
    const { verify, dataToken } = SecurityHelper.isSecure(req, res, null);
    if (verify) {
    } else {
    }
};

module.exports = { updateProduct };
