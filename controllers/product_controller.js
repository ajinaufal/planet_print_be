const SecurityHelper = require("../helper/security_helper");
const ProductRequest = require("../models/request/update_product_request");
const ProductModels = require("../models/databases/product_database");
const StockProductModels = require("../models/databases/stock_product_database");
const { v4: uuidv4 } = require("uuid");
const CartRequest = require("../models/request/cart_request");
const UsersModels = require("../models/databases/users_database");
const CartProductModels = require("../models/databases/cart_product_database");

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
        const user = await UsersModels.findOne({ token: dataToken.token });
        if (user) {
            const listCart = await CartProductModels.find({ user: user._id });
            listCart.map(async (cart) => {
                if (cart.status == "stay") {
                    const product = await ProductModels.findOne({
                        _id: cart.product,
                    });
                    if (product) {
                        const maxStock = stockProduct(product._id);
                        const data = {
                            name: product.title,
                            original_price: product.price,
                            stock:
                                cart.total < maxStock ? cart.total : maxStock,
                            max_stock: maxStock,
                        };
                    }
                }
            });
        }
    } else {
    }
};

async function stockProduct(idProduct) {
    const products = await StockProductModels.find({ product: idProduct });
    var stock = 0;
    if (products) {
        products.map((product) => {
            if (product.type == "addition") {
                stock = stock + product.total;
            } else if (product.type == "subtraction") {
                stock = stock - product.total;
            }
        });
    }
    return stock;
}

module.exports = { updateProduct };
