class AgregatorProduct {
    static getProduct(request) {
        const pipeLine = [];
        pipeLine.push({ $match: { isDelete: { $eq: false } } });
        if (request.token) {
            pipeLine.push({ $match: { token: { $eq: request.token } } });
        }
        if (request.filter) {
            pipeLine.push({
                $match: { title: { $regex: new RegExp(request.filter, 'i') } },
            });
        }

        pipeLine.push(...[{ $skip: request.skip }, { $limit: request.size }]);

        pipeLine.push(
            ...[
                {
                    $lookup: {
                        from: 'stock_products',
                        localField: 'token',
                        foreignField: 'product',
                        as: 'stocks',
                    },
                },
                {
                    $lookup: {
                        from: 'category_products',
                        localField: 'category',
                        foreignField: 'token',
                        as: 'category',
                    },
                },
                {
                    $lookup: {
                        from: 'files',
                        localField: 'photo',
                        foreignField: 'token',
                        as: 'photos',
                    },
                },
                {
                    $lookup: {
                        from: 'variants',
                        localField: 'variants',
                        foreignField: 'token',
                        as: 'variant',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        token: {
                            $first: '$token',
                        },
                        photo: {
                            $first: '$photos',
                        },
                        variant: {
                            $first: '$variants',
                        },
                        title: {
                            $first: '$title',
                        },
                        price: {
                            $first: '$price',
                        },
                        description: {
                            $first: '$description',
                        },
                        specification: {
                            $first: '$specification',
                        },
                        stock: {
                            $first: '$stocks',
                        },
                        category: {
                            $first: '$category',
                        },
                        sold: {
                            $push: {
                                $sum: {
                                    $map: {
                                        input: '$stocks',
                                        as: 'stocks',
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: ['$$stocks.code', 'checkout'],
                                                },
                                                '$$stocks.total',
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
                                        input: '$stocks',
                                        as: 'stocks',
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: ['$$stocks.type', 'addition'],
                                                },
                                                '$$stocks.total',
                                                {
                                                    $multiply: ['$$stocks.total', -1],
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        updated_at: {
                            $first: '$updatedAt',
                        },
                        created_at: {
                            $first: '$createdAt',
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        token: 1,
                        variant: 1,
                        photo: 1,
                        title: 1,
                        price: 1,
                        description: 1,
                        specification: 1,
                        sold: {
                            $arrayElemAt: ['$sold', 0],
                        },
                        category: {
                            $arrayElemAt: ['$category', 0],
                        },
                        stocks: {
                            $arrayElemAt: ['$stocks', 0],
                        },
                    },
                },
                {
                    $project: {
                        'photo._id': 0,
                        'photo.__v': 0,
                        'variant._id': 0,
                        'variant.__v': 0,
                        'category._id': 0,
                        'category.__v': 0,
                    },
                },
            ]
        );
        return pipeLine;
    }
}

module.exports = AgregatorProduct;
