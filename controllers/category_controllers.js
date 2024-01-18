const FileHelper = require('../helper/file_helper');
const SecurityHelper = require('../helper/security_helper');
const CategoryModels = require('../models/databases/category_database');
const CategoryUpdateRequest = require('../models/request/category_update_request');
const AgregationCategory = require('../agregator/agregation_category');
const FileRequest = require('../models/request/file_request');
const CategoryCreateRequest = require('../models/request/category_create_request');
const FilesModels = require('../models/databases/image_database');
const CateogryDeleteRequest = require('../models/request/category_delete_request');
const { v4: uuidv4 } = require('uuid');
const { userRoleEnum } = require('../enum/role_enum');
const { fileService } = require('../middleware/file_middleware');
const CateogryRequest = require('../models/request/category_request');

const updateCategory = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const field = await fileService({ req, res, field: [{ name: 'image', maxCount: 1 }] });
            const images = (field?.image || []).map((image) => new FileRequest(image));
            const request = new CategoryUpdateRequest(req);
            const update = {};

            if (request.token) {
                const category = await CategoryModels.aggregate(
                    AgregationCategory.getCategory({ $match: { token: { $eq: request.token } } })
                )
                    .allowDiskUse(true)
                    .then((result) => {
                        if (result.length > 0) return result[0];
                        return undefined;
                    });

                if (category) {
                    if (images.length > 0) {
                        const image = images[0];
                        console.log('image : ', image);
                        await new Promise(async (resolve, reject) => {
                            const file = new FilesModels();
                            file.token = image.path.split('/').pop().split('.')[0];
                            file.path = `/public/category/${image.fileName}`;
                            file.name = image.fileName;
                            file.type = image.mimeType;
                            file.size = image.size;
                            file.basename = image.oldName;
                            const save = await file.save().then((result) => {
                                FileHelper.move(
                                    `./${image.path}`,
                                    `./public/category/${file.name}`
                                );
                                return result;
                            });
                            return resolve(save);
                        }).then((result) => {
                            update['image'] = result.token;
                        });

                        if (category.photo?.path) FileHelper.delete(`.${category.photo.path}`);
                    }

                    if (request.name) update['name'] = request.name;

                    update['updatedAt'] = new Date();

                    await CategoryModels.updateOne(
                        { token: { $eq: request.token } },
                        { $set: update }
                    );

                    res.status(200).json({
                        message: 'Congratulations, you have successfully updated your data.',
                    });
                } else {
                    res.status(404).json({
                        message: 'an error, data not found.',
                    });
                }
            } else {
                res.status(403).json({
                    message: 'an error, id not found.',
                });
            }
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system, ${error}`,
                data: null,
            });
        }
    }
};

const getCategory = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        const request = new CateogryRequest(req.body);
        try {
            const categorys = await CategoryModels.aggregate(
                AgregationCategory.getCategory({ token: request.token })
            ).allowDiskUse(true);
            res.status(200).json({
                message: 'Congratulations, you have successfully get your data.',
                data: categorys,
            });
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system, ${error}`,
            });
        }
    }
};

const createCategory = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const fileImage = [];
            const field = await fileService({ req, res, field: [{ name: 'image', maxCount: 1 }] });
            const images = (field.image || []).map((image) => new FileRequest(image));
            const request = new CategoryCreateRequest(req);

            await Promise.all(
                (images || []).map(async (image) => {
                    const file = new FilesModels();
                    file.token = image.path.split('/').pop().split('.')[0];
                    file.path = `/public/category/${image.fileName}`;
                    file.name = image.fileName;
                    file.type = image.mimeType;
                    file.size = image.size;
                    file.basename = image.oldName;
                    await file.save();
                    fileImage.push(file.token);
                    FileHelper.move(`./${image.path}`, `./public/category/${file.name}`);
                })
            );

            const category = new CategoryModels();
            category.token = uuidv4();
            category.name = request.name;
            category.image = fileImage[0];
            category.createdAt = new Date();
            category.updatedAt = new Date();
            await category.save();

            res.status(200).json({
                message: 'Congratulations, you have successfully create your data.',
                data: { id: category.token },
            });
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system, ${error}`,
            });
        }
    }
};

const deleteCategory = async (req, res) => {
    const request = new CateogryDeleteRequest(req.body);
    if (request.token) {
        const category = await CategoryModels.findOne({ token: { $eq: request.token } });
        const images = await FilesModels.find({ token: { $in: [category.image] } });

        images.map(
            async (image) =>
                await FilesModels.deleteOne({ token: { $eq: image.token } }).then((result) =>
                    FileHelper.delete(`.${image.path}`)
                )
        );

        await CategoryModels.deleteOne({ token: { $eq: category.token } });

        res.status(200).json({
            message: `Congratulations, you have successfully delete category ${request.token}`,
        });
    } else {
        res.status(403).json({ message: 'id not found' });
    }
};
module.exports = { getCategory, createCategory, deleteCategory, updateCategory };
