class AgregatorCart {
    static getCart(user) {
        const today = new Date();
        return [
            { $match: { user: user._id } },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $lookup: {
                    from: "stock_products",
                    localField: "products._id",
                    foreignField: "product",
                    as: "stock",
                },
            },
            {
                $lookup: {
                    from: "category_products",
                    localField: "products.category",
                    foreignField: "_id",
                    as: "categorys",
                },
            },
            {
                $lookup: {
                    from: "discount_product",
                    localField: "products._id",
                    foreignField: "product",
                    as: "discount",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    token: {
                        $first: "$token",
                    },
                    user: {
                        $first: "$user",
                    },
                    status: {
                        $first: "$status",
                    },
                    total: {
                        $first: "$total",
                    },
                    __v: {
                        $first: "$__v",
                    },
                    product: {
                        $first: "$product",
                    },
                    stock: {
                        $first: "$stock",
                    },
                    products: {
                        $push: {
                            discount: {
                                $map: {
                                    input: "$discount",
                                    as: "discount",
                                    in: {
                                        $cond: {
                                            if: {
                                                $and: [
                                                    {
                                                        $lte: [
                                                            "$startDate",
                                                            today,
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            "$endDate",
                                                            today,
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "$$discount",
                                            else: null,
                                        },
                                    },
                                },
                            },
                            photo: {
                                $first: "$products.photo",
                            },
                            token: {
                                $first: "$products.token",
                            },
                            title: {
                                $first: "$products.title",
                            },
                            price: {
                                $first: "$products.price",
                            },
                            updatedAt: {
                                $first: "$products.updatedAt",
                            },
                            category: {
                                $first: "$categorys",
                            },
                            stock: {
                                $sum: {
                                    $map: {
                                        input: "$stock",
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
            },
            {
                $project: {
                    _id: 0,
                    token: 1,
                    total: 1,
                    createdAt: 1,
                    status: 1,
                    "categorys.token": 1,
                    "categorys.name": 1,
                    "categorys.photo": 1,
                    "categorys.token": 1,
                    "categorys.updatedAt": 1,
                    products: { $arrayElemAt: ["$products", 0] },
                },
            },
            {
                $project: {
                    "products.discount._id": 0,
                    "products.discount.product": 0,
                    "products.stock._id": 0,
                    "products.stock.product": 0,
                    "products.stock.code": 0,
                    "products.stock.__v": 0,
                    "products.category._id": 0,
                    "products.category.__v": 0,
                    "products.category.createdAt": 0,
                },
            },
        ];
    }

    static checkoutCart(token) {
        const today = new Date();
        return [
            { $match: { token: { $in: token } } },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $lookup: {
                    from: "stock_products",
                    localField: "products._id",
                    foreignField: "product",
                    as: "stock",
                },
            },
            {
                $lookup: {
                    from: "discount_product",
                    localField: "products._id",
                    foreignField: "product",
                    as: "discount",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    token: {
                        $first: "$token",
                    },
                    user: {
                        $first: "$user",
                    },
                    status: {
                        $first: "$status",
                    },
                    total: {
                        $first: "$total",
                    },
                    __v: {
                        $first: "$__v",
                    },
                    product: {
                        $first: "$product",
                    },
                    stock: {
                        $first: "$stock",
                    },
                    products: {
                        $push: {
                            _id: { $first: "$products._id" },
                            discount: {
                                $map: {
                                    input: "$discount",
                                    as: "discount",
                                    in: {
                                        $cond: {
                                            if: {
                                                $and: [
                                                    {
                                                        $lte: [
                                                            "$startDate",
                                                            today,
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            "$endDate",
                                                            today,
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "$$discount",
                                            else: null,
                                        },
                                    },
                                },
                            },
                            photo: "$products.photo",
                            token: { $first: "$products.token" },
                            title: { $first: "$products.title" },
                            price: { $first: "$products.price" },
                            updatedAt: { $first: "$products.updatedAt" },
                            stock: {
                                $sum: {
                                    $map: {
                                        input: "$stock",
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
            },
            {
                $project: {
                    _id: 1,
                    token: 1,
                    total: 1,
                    createdAt: 1,
                    status: 1,
                    products: { $arrayElemAt: ["$products", 0] },
                },
            },
            {
                $project: {
                    "products.discount._id": 0,
                    "products.discount.product": 0,
                    "products.stock._id": 0,
                    "products.stock.product": 0,
                    "products.stock.code": 0,
                    "products.stock.__v": 0,
                    "products.category._id": 0,
                    "products.category.__v": 0,
                    "products.category.createdAt": 0,
                },
            },
        ];
    }
}
module.exports = AgregatorCart;
