const AgregatorCart = require("../agregator/agregation_cart");
const { cartTypeEnum } = require("../enum/cart_type_enum");
const SecurityHelper = require("../helper/security_helper");
const CartProductModels = require("../models/databases/cart_product_database");
const ProductModels = require("../models/databases/product_database");
const UsersModels = require("../models/databases/users_database");
const UpdateCartRequest = require("../models/request/update_cart_request");
const { v4: uuidv4 } = require("uuid");

const updateCart = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const data = SecurityHelper.dataToken(req);
            const request = new UpdateCartRequest(req.body);

            const user = await UsersModels.findOne({
                token: { $eq: data.token },
            });
            if (user) {
                const product = await ProductModels.findOne({
                    token: { $eq: request.productToken },
                });
                if (product) {
                    if (request.token) {
                        const update = await CartProductModels.findOne({
                            token: { $eq: request.token },
                        });
                        update.status = cartTypeEnum.Hold;
                        update.total = request.total;
                        await CartProductModels.updateOne(update);
                    } else {
                        const cart = new CartProductModels();
                        cart.token = uuidv4();
                        cart.product = product._id;
                        cart.user = user._id;
                        cart.status = cartTypeEnum.Hold;
                        cart.total = request.total;
                        await cart.save();
                    }
                    res.status(200).json({
                        message:
                            "Congratulations, you have successfully created your data.",
                    });
                } else {
                    res.status(403).json({
                        message: "Failed, Product not found.",
                    });
                }
            } else {
                res.status(403).json({
                    message: "Failed, User not found.",
                });
            }
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system, ${error}`,
            });
        }
    }
};

const getCart = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const data = SecurityHelper.dataToken(req);
            const user = await UsersModels.findOne({
                token: { $eq: data.token },
            });
            const cart = await CartProductModels.aggregate(
                AgregatorCart.getCart(user)
            );
            res.status(200).json({
                message:
                    "Congratulations, you have successfully created your data.",
                data: cart,
            });
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system, ${error}`,
            });
        }
    }
};

module.exports = { updateCart, getCart };
