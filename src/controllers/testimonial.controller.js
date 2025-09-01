const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

exports.getAllTestimonials = async (req, res) => {
    try {
        const videos = await db.Video.aggregate([
            { $match: { isDeleted: false, type: 3 } }, // ✅ testimonial only
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category._id',
                    categoryTitle: { $first: '$category.categoryTitle' },
                    categoryId: { $first: '$category.categoryId' },
                    list: {
                        $push: {
                            title: '$title',
                            dec: '$description',
                            thubnail: '$thumbnail',
                            videoid: '$_id',
                            videoUrl: '$video'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: 1,
                    categoryTitle: 1,
                    list: 1
                }
            }
        ]);

        const response = {
            titleVideo: '',
            urlVideo: '',
            thumUrl: '',
            category: videos
        };

        return RESPONSE.success(res, 200, 7007, response);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
