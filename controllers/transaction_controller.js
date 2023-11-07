const AgregationTransaction = require("../agregator/agregation_transaction");
const SecurityHelper = require("../helper/security_helper");
const TransactionModels = require("../models/databases/transaction_database");
const TransactionApproveRequest = require("../models/request/transaction_approve_request");

const getTransaction = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        const request = new TransactionApproveRequest(req.body);
        // if (request.verifyId()) {
        const pipeline = AgregationTransaction.getTransaction();
        const data = await TransactionModels.aggregate(pipeline);
        res.status(200).json({ message: "Success get transaction", data });
        // } else {
        //     res.status(403).json({ message: "You mistake with the id" });
        // }
    }
};

const approveTransaction = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, null)) {
        const request = new TransactionApproveRequest(req.body);
        if (request.verifyId()) {
            const pipeline = AgregationTransaction.getTransaction();
            const data = await TransactionModels.aggregate(pipeline);
            res.status(200).json({ message: "Success get transaction", data });
        } else {
            res.status(403).json({ message: "You mistake with the id" });
        }
    }

    // const stock = new StockProductModels();
    // stock.token = uuidv4();
    // stock.product = data.products._id;
    // stock.type = stockTypeEnum.subt;
    // stock.code = stockCodeEnum.checkout;
    // stock.total = data.total;
    // stock.createdAt = new Date();
    // await stock.save();
};

module.exports = { getTransaction, approveTransaction };
