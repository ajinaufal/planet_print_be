const AgregatorCart = require("../agregator/agregation_cart");
const { cartTypeEnum } = require("../enum/cart_type_enum");
const { stockTypeEnum, stockCodeEnum } = require("../enum/stock_type_enum");
const { statusTransactionEnum } = require("../enum/transaction_enum");
const SecurityHelper = require("../helper/security_helper");
const { uniqPrinceHelper } = require("../helper/uniq_price_helper");
const CartProductModels = require("../models/databases/cart_product_database");
const ProductModels = require("../models/databases/product_database");
const StockProductModels = require("../models/databases/stock_product_database");
const TransactionModels = require("../models/databases/transaction_database");
const UsersModels = require("../models/databases/users_database");
const CheckoutRequest = require("../models/request/checkout_request");
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
                if (request.token) {
                    const update = await CartProductModels.findOne({
                        token: { $eq: request.token },
                    });
                    update.status = cartTypeEnum.hold;
                    update.total = update.total + request.total;
                    const cart = await CartProductModels.updateOne(update);
                    res.status(200).json({
                        message:
                            "Congratulations, you have successfully created your data.",
                        data: cart,
                    });
                } else {
                    const product = await ProductModels.findOne({
                        token: { $eq: request.productToken },
                    });
                    if (product) {
                        const cart = new CartProductModels();
                        cart.token = uuidv4();
                        cart.product = product._id;
                        cart.user = user._id;
                        cart.status = cartTypeEnum.hold;
                        cart.total = request.total;
                        await cart.save();
                        res.status(200).json({
                            message:
                                "Congratulations, you have successfully created your data.",
                        });
                    } else {
                        res.status(403).json({
                            message: "Failed, Product not found.",
                        });
                    }
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
            const user = await SecurityHelper.getUser(req);
            const cart = await CartProductModels.aggregate(
                AgregatorCart.getCart(user._id)
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

const checkoutCart = async (req, res) => {
    const request = new CheckoutRequest(req.body);
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const user = await SecurityHelper.getUser(req);
            const carts = await CartProductModels.aggregate(
                AgregatorCart.checkoutCart(request.cartToken)
            );

            if (carts.length > 0) {
                carts.map(async (data) => {
                    const update = await CartProductModels.findOne({
                        token: { $eq: data.token },
                    });
                    update.status = cartTypeEnum.deliver;
                    update.updatedAt = new Date();
                    await CartProductModels.updateOne(update);

                    // const stock = new StockProductModels();
                    // stock.token = uuidv4();
                    // stock.product = data.products._id;
                    // stock.type = stockTypeEnum.subt;
                    // stock.code = stockCodeEnum.checkout;
                    // stock.total = data.total;
                    // stock.createdAt = new Date();
                    // await stock.save();
                });

                const transaction = new TransactionModels();
                transaction.user = user._id;
                transaction.token = uuidv4();
                transaction.carts = carts.map((cart) => cart._id);
                transaction.paid = carts
                    .map((cart) => cart.total * cart.products.price)
                    .reduce(
                        (accumulator, currentValue) =>
                            accumulator + currentValue,
                        0
                    );
                transaction.status = statusTransactionEnum.pay;
                transaction.uniqNumber = uniqPrinceHelper();
                transaction.createdAt = new Date();
                transaction.updatedAt = new Date();
                await transaction.save();

                res.status(200).json({
                    message: "Congratulations, you have successfully checkout.",
                });
            } else {
                res.status(403).json({ message: "Token not found" });
            }
        } catch (error) {
            res.status(500).json({
                message: `an error occurred in the system checkout, ${error}`,
            });
        }
    }
};

module.exports = { updateCart, getCart, checkoutCart };
