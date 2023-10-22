class AgregationCategory {
    static getCategory() {
        const pipeLine = [];
        pipeLine.push(
            ...[
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "category",
                        as: "products",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        token: 1,
                        name: 1,
                        photo: 1,
                        total_product: { $size: "$products" },
                        updated_at: "$updatedAt",
                    },
                },
            ]
        );
        return pipeLine;
    }
}

module.exports = AgregationCategory;
