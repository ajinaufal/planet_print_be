class AgregatorProduct {
    static getProduct(token, skip, limit) {
        const pipeLine = [];
        if (token) pipeLine.push({ $match: { token: { $eq: token } } });
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
                        price: { $first: "$price" },
                        photo: { $first: "$photo" },
                        deskripsi: { $first: "$deskripsi" },
                        spesifikasi: { $first: "$spesifikasi" },
                        updatedAt: { $first: "$updatedAt" },
                        stock: { $first: "$stocks" },
                        categorys: { $first: "$categorys" },
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
