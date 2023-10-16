const SecurityHelper = require("../helper/security_helper");
const ClusterMessageModels = require("../models/databases/cluster_chat_database");
const UsersModels = require("../models/databases/users_database");
const ClusterChatRequest = require("../models/request/cluster_chat_request");

const getChat = async (req, res) => {
    if (await SecurityHelper.isSecure(req, res, userRoleEnum.Admin)) {
        const request = new ClusterChatRequest(req.body);
        const id = SecurityHelper.dataToken(req).token;
        const users = await UsersModels.findOne({ token: { $eq: id } });
        const chat = await ClusterMessageModels.aggregate(
            AgregatorChat.getChat(users._id, "admin")
        );
        res.status(200).json({
            message: "Congratulations, you have successfully get your data.",
            data: chat,
        });
    }
};

module.exports = { getChat };
