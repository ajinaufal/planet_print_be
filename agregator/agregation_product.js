class AgregatorProduct {
    static getProduct(request, skip, limit) {
        const pipeLine = [];
        if (request.token) {
            pipeLine.push({ $match: { token: { $eq: request.token } } });
        }
        if (request.filter) {
            pipeLine.push({
                $match: { title: { $regex: new RegExp(request.filter, "i") } },
            });
        }
        pipeLine.push(
            ...[
                {
                    $lookup: {
                        from: "stock_products",
                        localField: "_id",
                        foreignField: "product",
                        as: "stocks",
                    },
                },
                {
                    $lookup: {
                        from: "category_products",
                        localField: "category",
                        foreignField: "_id",
                        as: "categorys",
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        token: { $first: "$token" },
                        title: { $first: "$title" },
                        price: { $first: "$price" },
                        photo: { $first: "$photo" },
                        deskripsi: { $first: "$deskripsi" },
                        spesifikasi: { $first: "$spesifikasi" },
                        updatedAt: { $first: "$updatedAt" },
                        stock: { $first: "$stocks" },
                        categorys: { $first: "$categorys" },
                        sold: {
                            $push: {
                                $sum: {
                                    $map: {
                                        input: "$stocks",
                                        as: "stocks",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$stocks.code",
                                                        "checkout",
                                                    ],
                                                },
                                                "$$stocks.total",
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        stocks: {
                            $push: {
                                $sum: {
                                    $map: {
                                        input: "$stocks",
                                        as: "stocks",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$stocks.type",
                                                        "addition",
                                                    ],
                                                },
                                                "$$stocks.total",
                                                {
                                                    $multiply: [
                                                        "$$stocks.total",
                                                        -1,
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        token: 1,
                        photo: 1,
                        title: 1,
                        price: 1,
                        deskripsi: 1,
                        spesifikasi: 1,
                        sold: { $arrayElemAt: ["$sold", 0] },
                        category: { $arrayElemAt: ["$categorys", 0] },
                        stocks: { $arrayElemAt: ["$stocks", 0] },
                        updatedAt: 1,
                    },
                },
                {
                    $project: {
                        stock: 0,
                        "category._id": 0,
                        "category.__v": 0,
                    },
                },
                { $skip: skip },
                { $limit: limit },
            ]
        );
        return pipeLine;
    }
}

module.exports = AgregatorProduct;
