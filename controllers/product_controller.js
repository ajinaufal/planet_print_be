const SecurityHelper = require('../helper/security_helper');
const ProductModels = require('../models/databases/product_database');
const StockProductModels = require('../models/databases/stock_product_database');
const UpdateProductRequest = require('../models/request/update_product_request');
const FileHelper = require('../helper/file_helper');
const ProductRequest = require('../models/request/product_request');
const AgregatorProduct = require('../agregator/agregation_product');
const CreateProductRequest = require('../models/request/create_product_request');
const FilesModels = require('../models/databases/image_database');
const FileRequest = require('../models/request/file_request');

const { v4: uuidv4 } = require('uuid');
const { stockTypeEnum, stockCodeEnum } = require('../enum/stock_type_enum');
const { fileService } = require('../middleware/file_middleware');

const createProduct = async (req, res) => {
    try {
        if (await SecurityHelper.isSecure(req, res, null)) {
            const fileImage = [];
            const field = await fileService({ req, res, field: [{ name: 'images', maxCount: 5 }] });
            const images = (field.images || []).map((image) => new FileRequest(image));
            const request = new CreateProductRequest(req);
            const validations = request.validation();

            console.log(request);

            if (validations.length > 0) {
                await Promise.all(
                    (images || []).map(async (image) => {
                        const file = new FilesModels();
                        file.token = image.path.split('/').pop().split('.')[0];
                        file.path = `/public/product/${image.fileName}`;
                        file.name = image.fileName;
                        file.type = image.mimeType;
                        file.size = image.size;
                        file.basename = image.oldName;

                        await file.save();

                        fileImage.push(file.token);

                        FileHelper.move(`./${image.path}`, `./public/product/${file.name}`);
                    })
                );

                const product = new ProductModels();
                product.token = uuidv4();
                product.title = request.title;
                product.price = request.price;
                product.category = request.tokenCategory;
                product.photo = fileImage;
                product.description = request.description;
                product.specification = request.specification;
                product.createdAt = new Date();
                product.updatedAt = new Date();
                product.category = request.category;
                product.isDelete = false;
                await product.save();

                if (request.stock) {
                    const stock = new StockProductModels();
                    stock.token = uuidv4();
                    stock.product = product.token;
                    stock.type = request.stock < 0 ? stockTypeEnum.subt : stockTypeEnum.add;
                    stock.code = stockCodeEnum.update;
                    stock.total = Math.abs(request.stock);
                    stock.createdAt = new Date();
                    await stock.save();
                }

                res.status(200).json({
                    message: 'Congratulations, you have successfully create your data.',
                    data: { id: product.token },
                });
            } else {
                res.status(403).json({ message: validations[0] });
            }
        }
    } catch (error) {
        console.error(`Error create product : ${error}`);
        res.status(500).json({ message: `Error create product : ${error}` });
    }
};

const getProduct = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const request = new ProductRequest(req.query);
            const products = await ProductModels.aggregate(
                AgregatorProduct.getProduct(request),
                { allowDiskUse: true },
                { explain: true }
            );
            const totalItem = await ProductModels.find({ isDelete: false }).countDocuments();
            const totalPage = totalItem > 0 ? Math.ceil(totalItem / request.size) : 1;
            res.status(200).json({
                message: 'Congratulations, you have successfully get your data.',
                data: products,
                pagination: {
                    size: request.size,
                    total_item: totalItem,
                    page: request.page,
                    total_page: totalPage,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    }
};

const deleteProduct = async (req, res) => {
    const request = new ProductRequest(req.body);
    try {
        if (request.token) {
            const product = await ProductModels.findOne({ token: { $eq: request.token } });
            const images = await FilesModels.find({ token: { $in: product.photo } });

            images.map(async (image) => {
                await FilesModels.deleteOne({ token: { $eq: image.token } }).then((result) =>
                    FileHelper.delete(`.${image.path}`)
                );
            });

            const rest = product.stocks - product.sold;

            if (rest > 0) {
                const stock = new StockProductModels();
                stock.token = uuidv4();
                stock.product = product.token;
                stock.type = request.stock < 0 ? stockTypeEnum.subt : stockTypeEnum.add;
                stock.code = stockCodeEnum.update;
                stock.total = Math.abs(request.stock);
                stock.createdAt = new Date();
                await stock.save();
            }

            await ProductModels.deleteOne({ token: { $eq: product.token } });

            res.status(200).json({
                message: `Congratulations, you have successfully delete product ${request.token}`,
            });
        } else {
            res.status(403).json({ message: 'id not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Error delete product : ${error}` });
    }
};

const updateProduct = async (req, res) => {
    const request = new UpdateProductRequest(req);
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            if (request.token) {
                const prorduct = await ProductModels.findOne({
                    token: { $eq: request.token },
                });

                if (request.title) prorduct.title = request.title;
                if (request.price) prorduct.price = request.price;
                if (request.description) prorduct.description = request.description;
                if (request.spesification) prorduct.specification = request.spesification;
                if (request.category) prorduct.category = category._id;
                prorduct.updatedAt = new Date();

                await ProductModels.updateOne(update);

                if (request.updateStock) {
                    const stock = new StockProductModels();
                    stock.product = update._id;
                    stock.type = request.updateStock < 0 ? stockTypeEnum.subt : stockTypeEnum.add;
                    stock.code = stockCodeEnum.update;
                    stock.total = Math.abs(request.updateStock);
                    stock.createdAt = new Date();
                    await stock.save();
                }

                if ((request.delete_photos || []).length > 0) {
                    const imgs = await FilesModels.find({
                        token: { $in: request.delete_photos },
                    });

                    imgs.map((image) => {
                        if (image?.path) FileHelper.delete(image?.path);
                    });
                }

                res.status(200).json({
                    message: 'Congratulations, you have successfully update your data.',
                });
            } else {
                res.status(403).json({
                    message: `An error occurred in the system update product. ${error}`,
                });
            }
        } catch (error) {
            res.status(403).json({
                message: `An error occurred in the system update product. ${error}`,
            });
        }
    }
};

module.exports = { createProduct, getProduct, deleteProduct, updateProduct };
