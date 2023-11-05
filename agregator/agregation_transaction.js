class AgregationTransaction {
    static getTransaction(id) {
        const token = id || null;
        const pipeline = [];

        if (token) pipeline.push({ $match: { token: token } });
        return [
            ...pipeline,
            {
                $unwind: "$carts",
            },
            {
                $lookup: {
                    from: "carts",
                    localField: "carts",
                    foreignField: "_id",
                    as: "cart",
                },
            },
        ];
    }
}

module.exports = AgregationTransaction;
