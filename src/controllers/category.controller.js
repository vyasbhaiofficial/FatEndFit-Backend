const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { categoryTitle } = req.body;
        if (!categoryTitle) {
            return RESPONSE.error(res, 400, 1885);
        }

        const newCategory = await db.Category.create({ categoryTitle });
        return RESPONSE.success(res, 201, 9003, newCategory);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.find().sort({ createdAt: -1 });
        return RESPONSE.success(res, 200, 9003, categories);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { categoryTitle } = req.body;

        const updatedCategory = await db.Category.findByIdAndUpdate(
            categoryId,
            { categoryTitle },
            { new: true }
        );

        if (!updatedCategory) return RESPONSE.error(res, 404, 9004);

        return RESPONSE.success(res, 200, 1887, updatedCategory);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await db.Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) return RESPONSE.error(res, 404,1883);

        return RESPONSE.success(res, 200,1886);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
