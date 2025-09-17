const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { getTextInLanguage } = require('../../utils/languageHelper.js');

exports.getAllTestimonials = async (req, res) => {
    try {
        const role = req.role;
        const language = role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';

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
                title: getTextInLanguage(video.title, language),
                dec: getTextInLanguage(video.description, language),
                thubnail: getTextInLanguage(video.thumbnail, language),
                videoid: video._id,
                videoUrl: getTextInLanguage(video.video, language)
            });
        });

        const response = {
            title: type3Videos ? getTextInLanguage(type3Videos.title, language) : '',
            thumUrl: type3Videos ? getTextInLanguage(type3Videos.thumbnail, language) : '',
            urlVideo: type3Videos ? getTextInLanguage(type3Videos.video, language) : '',
            category: Object.values(categoryMap)
        };

        return RESPONSE.success(res, 200, 9001, response);
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
