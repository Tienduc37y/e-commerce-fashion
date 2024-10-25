const categoryService = require('../services/category.service')

const findAllCategory = async (req, res) => {
    try {
        const categories = await categoryService.findAllCategory();
        return res.status(200).send({
            status: "200",
            message: "Lấy danh mục thành công",
            categories: categories
        });
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        });
    }
};

const findAllThirdLevelCategories = async (req, res) => {
    try {
        const thirdLevelCategories = await categoryService.findAllThirdLevelCategories();
        return res.status(200).send({
            status: "200",
            message: "Lấy danh sách danh mục cấp 3 thành công",
            thirdLevelCategories: thirdLevelCategories
        });
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        });
    }
};

module.exports = {
    findAllCategory,
    findAllThirdLevelCategories
};
