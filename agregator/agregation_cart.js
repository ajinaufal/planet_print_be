class AgregatorCart {
    static getCart(user) {
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
                $group: {
                    _id: "$_id",
                    token: { $first: "$token" },
                    user: { $first: "$user" },
                    status: { $first: "$status" },
                    total: { $first: "$total" },
                    __v: { $first: "$__v" },
                    product: { $first: "$product" },
                    stock: { $first: "$stock" },
                    products: {
                        $push: {
                            photo: { $first: "$products.photo" },
                            token: { $first: "$products.token" },
                            title: { $first: "$products.title" },
                            price: { $first: "$products.price" },
                            updatedAt: { $first: "$products.updatedAt" },
                            category: { $first: "$categorys" },
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
                    // "categorys._id": 1,
                    "categorys.token": 1,
                    "categorys.name": 1,
                    "categorys.photo": 1,
                    "categorys.token": 1,
                    "categorys.updatedAt": 1,

                    products: { $arrayElemAt: ["$products", 0] },
                    // "products.title": 1,
                    // "products.price": 1,
                    // "products.photo": 1,
                    // "products.category": 1,
                    // "products.updatedAt": 1,
                    stock: { $sum: "$stock.total" },
                },
            },
        ];
    }
}
module.exports = AgregatorCart;
