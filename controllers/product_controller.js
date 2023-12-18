const SecurityHelper = require('../helper/security_helper');
const ProductModels = require('../models/databases/product_database');
const StockProductModels = require('../models/databases/stock_product_database');
const UpdateProductRequest = require('../models/request/update_product_request');
const FileHelper = require('../helper/file_helper');
const CategoryProductModels = require('../models/databases/category_product_database');
const ProductRequest = require('../models/request/product_request');
const AgregatorProduct = require('../agregator/agregation_product');
const CreateProductRequest = require('../models/request/create_product_request');
const FilesModels = require('../models/databases/image_database');
const FileRequest = require('../models/request/file_request');

const { v4: uuidv4 } = require('uuid');
const { basename } = require('path');
const { stockTypeEnum, stockCodeEnum } = require('../enum/stock_type_enum');
const { fileService } = require('../middleware/file_middleware');

const productCreate = async (req, res) => {
    try {
        if (await SecurityHelper.isSecure(req, res, null)) {
            const fileImage = [];
            const field = await fileService({ req, res, field: [{ name: 'images', maxCount: 5 }] });
            const images = (field.images || []).map((image) => new FileRequest(image));
            const request = new CreateProductRequest(req);
            const validations = request.validation();

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
            await ProductModels.findOneAndUpdate(
                { token: { $eq: request.token } },
                { isDelete: true }
            );

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
                    stock.type = request.updateStock < 0 ? stockTypeEnum.subt : stockTypeEnum.add;
                    stock.code = stockCodeEnum.update;
                    stock.total = Math.abs(request.updateStock);
                    stock.createdAt = new Date();
                    await stock.save();
                }
                res.status(200).json({
                    message: 'Congratulations, you have successfully update your data.',
                });
            } else {
                const isRequired =
                    request.title && request.price && request.deskripsi && request.updateStock;
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
                        product.photo = request.file.map((file) => `/product/${file.fileName}`);
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
                        stock.type = request.updateStock < 0 ? 'subtraction' : 'addition';
                        stock.code = 'update';
                        stock.total = Math.abs(request.updateStock);
                        stock.createdAt = new Date();
                        await stock.save();
                    }

                    res.status(200).json({
                        message: 'Congratulations, you have successfully update your data.',
                    });
                } else {
                    res.status(403).json({
                        message:
                            'Pay attention to your input, there are some required things you missed.',
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

module.exports = { productCreate, getProduct, deleteProduct };
