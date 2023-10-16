const SecurityHelper = require("../helper/security_helper");
const DiscountProductModels = require("../models/databases/discount_product_database");

const getDiscount = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        try {
            const discount = await DiscountProductModels.find({});
            res.status(200).json({
                message:
                    "Congratulations, you have successfully get your data.",
                data: discount,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    }
};

module.exports = { getDiscount };
