const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

exports.getAllTestimonials = async (req, res) => {
    try {
        // Type 3: Testimonial videos
        const type3Videos = await db.Video.findOne({ type: 3, isDeleted: false });

        // Type 4: Category-wise videos
        const type4Videos = await db.Video.find({ type: 4, isDeleted: false }).populate('category');

        // Category-wise grouping
        const categoryMap = {};
        type4Videos.forEach(video => {
            const catId = video.category?._id?.toString();
            if (!catId) return;

            if (!categoryMap[catId]) {
                categoryMap[catId] = {
                    categoryId: catId,
                    categoryTitle: video.category.categoryTitle,
                    list: []
                };
            }

            categoryMap[catId].list.push({
                title: video.title,
                dec: video.description,
                thubnail: video.thumbnail,
                videoid: video._id,
                videoUrl: video.video
            });
        });

        const response = {
            title: type3Videos.title,
            thumUrl: type3Videos.thumbnail,
            urlVideo: type3Videos.video,
            category: Object.values(categoryMap)
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
