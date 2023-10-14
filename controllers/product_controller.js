const SecurityHelper = require("../helper/security_helper");

const ProductModels = require("../models/databases/product_database");
const StockProductModels = require("../models/databases/stock_product_database");
const { v4: uuidv4 } = require("uuid");
const UpdateProductRequest = require("../models/request/update_product_request");
const FileHelper = require("../helper/file_helper");
const CategoryProductModels = require("../models/databases/category_product_database");
const { basename } = require("path");

const getProduct = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        var product = [];
        try {
            const request = new ProductRequest(req.body);
            if (request.token) {
                product = await ProductModels.find({
                    token: { $eq: data.token },
                });
            } else {
                product = await ProductModels.findOne({})
                    .skip((request.page - 1) * request.size)
                    .limit(request.size);
            }
            res.status(200).json({
                message:
                    "Congratulations, you have successfully get your data.",
                data: product,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error, data: product });
        }
    }
};

const updateProduct = async (req, res) => {
    const request = new UpdateProductRequest(req);
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            if (request.token) {
                const update = await ProductModels.findOne({
                    token: { $eq: request.token },
                });

                if (request.title) update.title = request.title;
                if (request.price) update.price = request.price;
                if (request.deskripsi) update.deskripsi = request.deskripsi;
                if (request.spesifikasi) {
                    update.spesifikasi = request.spesifikasi;
                }
                update.updatedAt = new Date();
                if (request.tokenCategory) {
                    const category = await CategoryProductModels.findOne({
                        token: { $eq: request.tokenCategory },
                    });
                    update.category = category._id;
                }

                await ProductModels.updateOne(update);
                if (request.updateStock) {
                    const stock = new StockProductModels();
                    stock.product = update._id;
                    stock.type =
                        request.updateStock < 0 ? "subtraction" : "addition";
                    stock.code = "update";
                    stock.total = Math.abs(request.updateStock);
                    stock.createdAt = new Date();
                    await stock.save();
                }
                res.status(200).json({
                    message:
                        "Congratulations, you have successfully update your data.",
                });
            } else {
                const isRequired =
                    request.title &&
                    request.price &&
                    request.deskripsi &&
                    request.updateStock;
                if (isRequired) {
                    const product = new ProductModels();
                    product.token = uuidv4();
                    product.title = request.title;
                    product.price = request.price;
                    product.deskripsi = request.deskripsi;
                    product.spesifikasi = request.spesifikasi;
                    product.createdAt = new Date();
                    product.updatedAt = new Date();

                    if (request.file) {
                        product.photo = request.file.map(
                            (file) => `/product/${file.fileName}`
                        );
                    }

                    if (request.tokenCategory) {
                        const category = await CategoryProductModels.findOne({
                            token: { $eq: request.tokenCategory },
                        });
                        product.category = category._id;
                    }

                    await product.save().then((prod) => {
                        prod.photo.map((phot) =>
                            FileHelper.move(
                                `./public/temporary/${basename(phot)}`,
                                `./public/product/${basename(phot)}`
                            )
                        );
                    });

                    if (request.updateStock) {
                        const stock = new StockProductModels();
                        stock.token = uuidv4();
                        stock.product = product._id;
                        stock.type =
                            request.updateStock < 0
                                ? "subtraction"
                                : "addition";
                        stock.code = "update";
                        stock.total = Math.abs(request.updateStock);
                        stock.createdAt = new Date();
                        await stock.save();
                    }

                    res.status(200).json({
                        message:
                            "Congratulations, you have successfully update your data.",
                    });
                } else {
                    res.status(403).json({
                        message:
                            "Pay attention to your input, there are some required things you missed.",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(403).json({
                message: `An error occurred in the system update product. ${error}`,
            });
        }
    }
};

module.exports = { getProduct, updateProduct };
