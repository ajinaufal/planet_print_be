class AgregationCategory {
    static getCategory(request) {
        const pipeLine = [];

        if (request?.token) pipeLine.push({ $match: { token: { $eq: request.token } } });

        pipeLine.push(
            ...[
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products',
                    },
                },
                {
                    $lookup: {
                        from: 'files',
                        localField: 'image',
                        foreignField: 'token',
                        as: 'photos',
                    },
                },
                {
                    $project: {
                        _id: 0,
                        token: 1,
                        name: 1,
                        photo: {
                            $arrayElemAt: ['$photos', 0],
                        },
                        total_product: {
                            $size: '$products',
                        },
                        updated_at: '$updatedAt',
                    },
                },
                {
                    $project: {
                        'photo._id': 0,
                        'photo.__v': 0,
                    },
                },
            ]
        );

        return pipeLine;
    }
}

module.exports = AgregationCategory;
