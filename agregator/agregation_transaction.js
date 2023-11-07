class AgregationTransaction {
    static getTransaction(id) {
        const token = id || null;
        const pipeline = [];

        if (token) pipeline.push({ $match: { token: token } });
        return [
            ...pipeline,
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$carts",
            },
            {
                $lookup: {
                    from: "cart_products",
                    localField: "carts",
                    foreignField: "_id",
                    as: "cart",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cart.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $lookup: {
                    from: "category_products",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $addFields: {
                    "cart.product": {
                        $first: "$product",
                    },
                    "user.created_at": {
                        $first: "$user.createdAt",
                    },
                    carts: {
                        $map: {
                            input: "$cart",
                            as: "cartItem",
                            in: {
                                $mergeObjects: [
                                    "$$cartItem",
                                    {
                                        product: {
                                            photos: {
                                                $first: "$product.photo",
                                            },
                                            token: {
                                                $first: "$product.token",
                                            },
                                            title: {
                                                $first: "$product.title",
                                            },
                                            price: {
                                                $first: "$product.price",
                                            },
                                            created_at: {
                                                $first: "$product.createdAt",
                                            },
                                            description: {
                                                $first: "$product.description",
                                            },
                                            specification: {
                                                $first: "$product.specification",
                                            },
                                            category: {
                                                token: {
                                                    $first: "$category.token",
                                                },
                                                name: {
                                                    $first: "$category.name",
                                                },
                                                photo: {
                                                    $first: "$category.photo",
                                                },
                                                created_at: {
                                                    $first: "$category.createdAt",
                                                },
                                            },
                                        },
                                        created_at: "$$cartItem.createdAt",
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    product: 0,
                    category: 0,
                    cart: 0,
                    __v: 0,
                    "user._id": 0,
                    "carts.product._id": 0,
                    "carts.product.__v": 0,
                    "carts.product.updatedAt": 0,
                    "carts.updatedAt": 0,
                    "user.updatedAt": 0,
                    "user.createdAt": 0,
                    "user.__v": 0,
                    "user.password": 0,
                    "user.role": 0,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    user: {
                        $first: {
                            $first: "$user",
                        },
                    },
                    token: {
                        $first: "$token",
                    },
                    paid: {
                        $first: "$paid",
                    },
                    uniq_number: {
                        $first: "$uniqNumber",
                    },
                    status: {
                        $first: "$status",
                    },
                    created_at: {
                        $first: "$createdAt",
                    },
                    carts: {
                        $push: "$carts",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    user: 1,
                    token: 1,
                    paid: 1,
                    uniq_number: 1,
                    status: 1,
                    created_at: 1,
                    carts: {
                        $reduce: {
                            input: "$carts",
                            initialValue: [],
                            in: {
                                $concatArrays: ["$$value", "$$this"],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    users: 0,
                    "carts.product.createdAt": 0,
                    "carts.updatedAt": 0,
                    "carts.createdAt": 0,
                    "carts.user": 0,
                    "user._id": 0,
                    "user.__v": 0,
                    "carts._id": 0,
                    "carts.__v": 0,
                },
            },
        ];
    }
}

module.exports = AgregationTransaction;
