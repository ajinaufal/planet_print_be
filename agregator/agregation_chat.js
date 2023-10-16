class AgregatorChat {
    static getChat(userId, type) {
        const regulation = [];
        const match = {};
        if (userId) match.users = { $elemMatch: { $eq: users._id } };
        if (type) match.type = { $eq: request.type };
        if (userId || type) regulation.push({ $match: match });
        regulation.push(
            ...[
                {
                    $lookup: {
                        from: "messages",
                        localField: "_id",
                        foreignField: "cluster",
                        as: "chats",
                    },
                },
            ]
        );
        return regulation;
    }
}
